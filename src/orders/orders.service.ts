import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from '../dishes/dish.entity';
import { CreateOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { OrderStatus } from '../common/enums/index';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  findAll(organisationId?: string, employeId?: string, statut?: string) {
    const where: any = {};
    if (organisationId) where.organisation_id = organisationId;
    if (employeId) where.employe_id = employeId;
    if (statut) where.statut = statut;

    return this.orderRepo.find({
      where,
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

    // Récupérer les plats pour calculer le montant
    const plats = await this.dishRepo.find({
      where: { id: In(plats_ids) },
    });

    if (plats.length === 0) {
      throw new BadRequestException('Aucun plat valide trouvé');
    }

    // Calculer le montant total
    const montant_total = plats.reduce((sum, dish) => sum + Number(dish.prix), 0);

    // Générer le numéro de commande et le QR code token
    const timestamp = Date.now().toString().slice(-6);
    const numero_commande = `MMS-${new Date().getFullYear()}-${timestamp}`;
    const qr_code_token = uuidv4();

    const order = this.orderRepo.create({
      ...orderData,
      numero_commande,
      qr_code_token,
      montant_total,
      montant_employe: montant_total, // sera ajusté avec la subvention
      plats,
      statut: OrderStatus.PENDING,
      points_gagnes: Math.floor(montant_total / 1000), // 1 point pour 1000 FCFA
    });

    return this.orderRepo.save(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    // Validation des transitions de statut
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
        `Transition invalide: ${order.statut} → ${dto.statut}. Transitions autorisées: ${allowed.join(', ')}`,
      );
    }

    order.statut = dto.statut;

    if (dto.statut === OrderStatus.RETRIEVED) {
      order.date_recuperation = new Date();
    }

    return this.orderRepo.save(order);
  }

  async retrieveByQrCode(dto: RetrieveOrderDto) {
    const order = await this.findByQrCode(dto.qr_code_token);

    if (order.statut !== OrderStatus.READY) {
      throw new BadRequestException(
        `La commande n'est pas prête pour le retrait (statut actuel: ${order.statut})`,
      );
    }

    order.statut = OrderStatus.RETRIEVED;
    order.date_recuperation = new Date();
    if (dto.recupere_par) {
      order.recupere_par = dto.recupere_par;
    }

    return this.orderRepo.save(order);
  }

  async getStats(organisationId: string) {
    const qb = this.orderRepo.createQueryBuilder('order');
    qb.where('order.organisation_id = :organisationId', { organisationId });

    const total = await qb.getCount();
    const pending = await qb.clone().andWhere('order.statut = :s', { s: OrderStatus.PENDING }).getCount();
    const confirmed = await qb.clone().andWhere('order.statut = :s', { s: OrderStatus.CONFIRMED }).getCount();
    const retrieved = await qb.clone().andWhere('order.statut = :s', { s: OrderStatus.RETRIEVED }).getCount();
    const cancelled = await qb.clone().andWhere('order.statut = :s', { s: OrderStatus.CANCELLED }).getCount();

    return { total, pending, confirmed, retrieved, cancelled };
  }
}
