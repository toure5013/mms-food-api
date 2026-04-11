import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';
import { CreateNotificationDto } from './dto/notifications.dto';
export declare class NotificationsService {
    private readonly notificationRepo;
    private readonly userRepo;
    constructor(notificationRepo: Repository<Notification>, userRepo: Repository<User>);
    findAllByUser(userId: string): Promise<Notification[]>;
    findUnreadCount(userId: string): Promise<{
        unread_count: number;
    }>;
    findOne(id: string): Promise<Notification>;
    create(dto: CreateNotificationDto): Promise<Notification>;
    markAsRead(id: string, isRead: boolean): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    registerFcmToken(userId: string, fcmToken: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<Notification>;
}
