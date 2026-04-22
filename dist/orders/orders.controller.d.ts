import { OrdersService } from './orders.service';
import { CreateOrderDto, CreateGuestOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(organisationId?: string, employeId?: string, statut?: string): Promise<import("./order.entity").Order[]>;
    getStats(organisationId: string): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        retrieved: number;
        cancelled: number;
    }>;
    findOne(id: string): Promise<import("./order.entity").Order>;
    create(dto: CreateOrderDto): Promise<import("./order.entity").Order>;
    createGuest(dto: CreateGuestOrderDto): Promise<import("./order.entity").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("./order.entity").Order>;
    retrieveByQrCode(dto: RetrieveOrderDto): Promise<import("./order.entity").Order>;
}
