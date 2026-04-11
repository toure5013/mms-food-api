import { NotificationChannel } from '../common/enums/index';
import { User } from '../users/user.entity';
export declare class Notification {
    id: string;
    titre: string;
    message: string;
    canal: NotificationChannel;
    is_read: boolean;
    read_at: Date;
    action_url: string;
    metadata: string;
    user: User;
    user_id: string;
    created_at: Date;
}
