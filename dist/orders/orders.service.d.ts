import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';
import { User } from '../users/user.entity';
import { Notification } from '../notifications/notification.entity';
import { CreateOrderDto, CreateGuestOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { WalletService } from '../wallet/wallet.service';
import { PushService } from '../common/push/push.service';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly dishRepo;
    private readonly organisationRepo;
    private readonly userRepo;
    private readonly notificationRepo;
    private readonly walletService;
    private readonly pushService;
    constructor(orderRepo: Repository<Order>, dishRepo: Repository<Dish>, organisationRepo: Repository<Organisation>, userRepo: Repository<User>, notificationRepo: Repository<Notification>, walletService: WalletService, pushService: PushService);
    findAll(organisationId?: string, employeId?: string, statut?: string): Promise<Order[]>;
    findMyOrders(employeId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    findByQrCode(qrCodeToken: string): Promise<Order>;
    create(dto: CreateOrderDto): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order>;
    cancel(id: string, userId: string): Promise<Order>;
    retrieveByQrCode(dto: RetrieveOrderDto): Promise<Order>;
    getStats(organisationId: string): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        retrieved: number;
        cancelled: number;
    }>;
    createGuestOrder(dto: CreateGuestOrderDto): Promise<Order>;
    private notifyUser;
    private calculateSubvention;
}
