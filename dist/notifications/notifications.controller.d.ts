import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, MarkReadDto, RegisterFcmTokenDto } from './dto/notifications.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<import("./notification.entity").Notification[]>;
    getUnreadCount(req: any): Promise<{
        unread_count: number;
    }>;
    findOne(id: string): Promise<import("./notification.entity").Notification>;
    create(dto: CreateNotificationDto): Promise<import("./notification.entity").Notification>;
    markAsRead(id: string, dto: MarkReadDto): Promise<import("./notification.entity").Notification>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    registerFcmToken(req: any, dto: RegisterFcmTokenDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<import("./notification.entity").Notification>;
}
