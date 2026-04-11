import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Dish } from '../dishes/dish.entity';
import { CreateOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly dishRepo;
    constructor(orderRepo: Repository<Order>, dishRepo: Repository<Dish>);
    findAll(organisationId?: string, employeId?: string, statut?: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    findByQrCode(qrCodeToken: string): Promise<Order>;
    create(dto: CreateOrderDto): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order>;
    retrieveByQrCode(dto: RetrieveOrderDto): Promise<Order>;
    getStats(organisationId: string): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        retrieved: number;
        cancelled: number;
    }>;
}
