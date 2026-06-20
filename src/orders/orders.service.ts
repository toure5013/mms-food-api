import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';
import { CreateOrderDto, CreateGuestOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { OrderStatus, SubventionType } from '../common/enums/index';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
    @InjectRepository(Organisation)
    private readonly organisationRepo: Repository<Organisation>,
  ) {}

  findAll(organisationId?: string, employeId?: string, statut?: string) {
    const where: any = {};
    if (organisationId) where.organisation_id = organisationId;
    if (employeId) where.employe_id = employeId;
    if (statut) where.statut = statut.toUpperCase();

    return this.orderRepo.find({
      where,
      relations: ['plats', 'employe', 'organisation'],
      order: { created_at: 'DESC' },
    });
  }

  async findMyOrders(employeId: string) {
    return this.orderRepo.find({
      where: { employe_id: employeId },
      relations: ['plats', 'employe', 'organisation'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['plats', 'employe', 'organisation'],
    });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

  async findByQrCode(qrCodeToken: string) {
    const order = await this.orderRepo.findOne({
      where: { qr_code_token: qrCodeToken },
      relations: ['plats', 'employe', 'organisation'],
    });
    if (!order) throw new NotFoundException('Commande introuvable pour ce QR code');
    return order;
  }

  async create(dto: CreateOrderDto) {
    const { plats_ids, ...orderData } = dto;

    const plats = await this.dishRepo.find({ where: { id: In(plats_ids) } });
    if (plats.length === 0) throw new BadRequestException('Aucun plat valide trouvé');

    const org = await this.organisationRepo.findOneBy({ id: dto.organisation_id });
    if (!org) throw new NotFoundException('Organisation introuvable');
    if (!org.is_active) throw new BadRequestException('Organisation inactive');

    const montant_total = plats.reduce((sum, d) => sum + Number(d.prix), 0);
    const montant_subvention = this.calculateSubvention(montant_total, org);
    const montant_employe = Math.max(0, montant_total - montant_subvention);

    const timestamp = Date.now().toString().slice(-6);
    const numero_commande = `MMS-${new Date().getFullYear()}-${timestamp}`;
    const qr_code_token = uuidv4();

    const order = this.orderRepo.create({
      ...orderData,
      numero_commande,
      qr_code_token,
      montant_total,
      montant_subvention,
      montant_employe,
      plats,
      statut: OrderStatus.PENDING,
      points_gagnes: Math.floor(montant_total / 1000),
    });

    return this.orderRepo.save(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY],
      [OrderStatus.READY]: [OrderStatus.RETRIEVED],
    };

    const allowed = validTransitions[order.statut] || [];
    if (!allowed.includes(dto.statut)) {
      throw new BadRequestException(
        `Transition invalide: ${order.statut} → ${dto.statut}. Autorisées: ${allowed.join(', ')}`,
      );
    }

    order.statut = dto.statut;
    if (dto.statut === OrderStatus.RETRIEVED) {
      order.date_recuperation = new Date();
    }

    return this.orderRepo.save(order);
  }

  async cancel(id: string, userId: string) {
    const order = await this.findOne(id);

    const cancellable = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellable.includes(order.statut)) {
      throw new BadRequestException(
        `Impossible d'annuler une commande au statut ${order.statut}`,
      );
    }

    if (order.employe_id && order.employe_id !== userId) {
      throw new BadRequestException("Vous ne pouvez annuler que vos propres commandes");
    }

    order.statut = OrderStatus.CANCELLED;
    return this.orderRepo.save(order);
  }

  async retrieveByQrCode(dto: RetrieveOrderDto) {
    const order = await this.findByQrCode(dto.qr_code_token);

    if (order.statut !== OrderStatus.READY) {
      throw new BadRequestException(
        `La commande n'est pas prête (statut: ${order.statut})`,
      );
    }

    order.statut = OrderStatus.RETRIEVED;
    order.date_recuperation = new Date();
    if (dto.recupere_par) order.recupere_par = dto.recupere_par;

    return this.orderRepo.save(order);
  }

  async getStats(organisationId: string) {
    const qb = this.orderRepo.createQueryBuilder('order');
    qb.where('order.organisation_id = :organisationId', { organisationId });

    const [total, pending, confirmed, retrieved, cancelled] = await Promise.all([
      qb.getCount(),
      qb.clone().andWhere('order.statut = :s', { s: OrderStatus.PENDING }).getCount(),
      qb.clone().andWhere('order.statut = :s', { s: OrderStatus.CONFIRMED }).getCount(),
      qb.clone().andWhere('order.statut = :s', { s: OrderStatus.RETRIEVED }).getCount(),
      qb.clone().andWhere('order.statut = :s', { s: OrderStatus.CANCELLED }).getCount(),
    ]);

    return { total, pending, confirmed, retrieved, cancelled };
  }

  async createGuestOrder(dto: CreateGuestOrderDto) {
    const org = await this.organisationRepo.findOneBy({ id: dto.organisation_id });
    if (!org) throw new NotFoundException('Organisation introuvable');
    if (!org.is_guest_order_enabled) {
      throw new BadRequestException('Les commandes invités sont désactivées pour cette organisation');
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (org.guest_order_start_time && currentTime < org.guest_order_start_time) {
      throw new BadRequestException(`Commandes pas encore ouvertes (Ouverture: ${org.guest_order_start_time})`);
    }
    if (org.guest_order_end_time && currentTime > org.guest_order_end_time) {
      throw new BadRequestException(`Commandes fermées (Fermeture: ${org.guest_order_end_time})`);
    }

    const { plats_ids, ...orderData } = dto;
    const plats = await this.dishRepo.find({ where: { id: In(plats_ids) } });
    if (plats.length === 0) throw new BadRequestException('Aucun plat valide trouvé');

    const montant_total = plats.reduce((sum, d) => sum + Number(d.prix), 0);
    const timestamp = Date.now().toString().slice(-6);

    const order = this.orderRepo.create({
      ...orderData,
      numero_commande: `GUEST-${new Date().getFullYear()}-${timestamp}`,
      qr_code_token: uuidv4(),
      montant_total,
      montant_subvention: 0,
      montant_employe: montant_total,
      plats,
      statut: OrderStatus.PENDING,
      is_guest: true,
      points_gagnes: 0,
    });

    return this.orderRepo.save(order);
  }

  private calculateSubvention(montant_total: number, org: Organisation): number {
    const valeur = Number(org.subvention_valeur);
    const plafond = org.subvention_plafond_mensuel ? Number(org.subvention_plafond_mensuel) : Infinity;

    switch (org.subvention_type) {
      case SubventionType.FIXED:
        return Math.min(valeur, montant_total);

      case SubventionType.PERCENTAGE:
        return Math.min((montant_total * valeur) / 100, montant_total);

      case SubventionType.CAPPED:
        return Math.min((montant_total * valeur) / 100, plafond, montant_total);

      case SubventionType.HYBRID:
        // Montant fixe + % sur le reste, plafonné
        return Math.min(valeur + (montant_total * 0.1), plafond, montant_total);

      case SubventionType.FULL:
        return montant_total;

      default:
        return 0;
    }
  }
}
