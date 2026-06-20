import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';
import { User } from '../users/user.entity';
import { Notification } from '../notifications/notification.entity';
import { CreateOrderDto, CreateGuestOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { OrderStatus, SubventionType, PaymentMethod, NotificationChannel } from '../common/enums/index';
import { WalletService } from '../wallet/wallet.service';
import { PushService } from '../common/push/push.service';
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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly walletService: WalletService,
    private readonly pushService: PushService,
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

    // Déduction wallet si paiement WALLET
    if (dto.methode_paiement === PaymentMethod.WALLET && dto.employe_id && montant_employe > 0) {
      await this.walletService.debit(dto.employe_id, {
        montant: montant_employe,
        description: `Paiement commande ${numero_commande}`,
        reference: numero_commande,
      });
    }

    // Paiement EMPLOYER = entièrement pris en charge, pas de déduction
    const initialStatut =
      dto.methode_paiement === PaymentMethod.WALLET ||
      dto.methode_paiement === PaymentMethod.EMPLOYER
        ? OrderStatus.CONFIRMED
        : OrderStatus.PENDING;

    const order = this.orderRepo.create({
      ...orderData,
      numero_commande,
      qr_code_token,
      montant_total,
      montant_subvention,
      montant_employe,
      plats,
      statut: initialStatut,
      points_gagnes: Math.floor(montant_total / 1000),
    });

    const saved = await this.orderRepo.save(order);

    // Notification de confirmation à l'employé
    if (dto.employe_id) {
      await this.notifyUser(dto.employe_id, {
        titre: 'Commande confirmée',
        message: `Votre commande ${numero_commande} a été enregistrée.`,
        pushTitle: 'Commande confirmée ✅',
        pushBody: `${numero_commande} — ${plats.map((p) => p.nom).join(', ')}`,
        data: { order_id: saved.id, numero_commande },
      });
    }

    return saved;
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

    const saved = await this.orderRepo.save(order);

    // Push FCM quand la commande est prête
    if (dto.statut === OrderStatus.READY && order.employe_id) {
      await this.notifyUser(order.employe_id, {
        titre: 'Commande prête 🍽️',
        message: `Votre commande ${order.numero_commande} est prête à être récupérée.`,
        pushTitle: 'Commande prête ! 🍽️',
        pushBody: `${order.numero_commande} — venez récupérer votre repas.`,
        data: { order_id: order.id, numero_commande: order.numero_commande },
      });
    }

    // Push FCM si annulée
    if (dto.statut === OrderStatus.CANCELLED && order.employe_id) {
      await this.notifyUser(order.employe_id, {
        titre: 'Commande annulée',
        message: `Votre commande ${order.numero_commande} a été annulée.`,
        pushTitle: 'Commande annulée ❌',
        pushBody: `${order.numero_commande} a été annulée.`,
        data: { order_id: order.id, numero_commande: order.numero_commande },
      });
    }

    return saved;
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
    const saved = await this.orderRepo.save(order);

    if (order.employe_id) {
      await this.notifyUser(order.employe_id, {
        titre: 'Commande annulée',
        message: `Votre commande ${order.numero_commande} a été annulée.`,
        pushTitle: 'Commande annulée',
        pushBody: `${order.numero_commande} a été annulée.`,
        data: { order_id: order.id },
      });
    }

    return saved;
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

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async notifyUser(
    userId: string,
    opts: {
      titre: string;
      message: string;
      pushTitle: string;
      pushBody: string;
      data?: Record<string, string>;
    },
  ): Promise<void> {
    // 1. DB notification
    try {
      await this.notificationRepo.save(
        this.notificationRepo.create({
          titre: opts.titre,
          message: opts.message,
          user_id: userId,
          canal: NotificationChannel.PUSH,
        }),
      );
    } catch { /* non bloquant */ }

    // 2. Push FCM
    try {
      const user = await this.userRepo.findOne({ where: { id: userId }, select: ['fcm_token'] });
      if (user?.fcm_token) {
        await this.pushService.sendToToken(user.fcm_token, opts.pushTitle, opts.pushBody, opts.data);
      }
    } catch { /* non bloquant */ }
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
        return Math.min(valeur + (montant_total * 0.1), plafond, montant_total);

      case SubventionType.FULL:
        return montant_total;

      default:
        return 0;
    }
  }
}
