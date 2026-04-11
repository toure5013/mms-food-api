import { NotificationChannel } from '../../common/enums/index';
export declare class CreateNotificationDto {
    titre: string;
    message: string;
    user_id: string;
    canal?: NotificationChannel;
    action_url?: string;
    metadata?: string;
}
export declare class MarkReadDto {
    is_read: boolean;
}
export declare class RegisterFcmTokenDto {
    fcm_token: string;
}
