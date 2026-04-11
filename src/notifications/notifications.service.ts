import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';
import { CreateNotificationDto } from './dto/notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAllByUser(userId: string) {
    return this.notificationRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findUnreadCount(userId: string) {
    const count = await this.notificationRepo.count({
      where: { user_id: userId, is_read: false },
    });
    return { unread_count: count };
  }

  async findOne(id: string) {
    const notif = await this.notificationRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification introuvable');
    return notif;
  }

  async create(dto: CreateNotificationDto) {
    const notification = this.notificationRepo.create(dto);
    return this.notificationRepo.save(notification);
  }

  async markAsRead(id: string, isRead: boolean) {
    const notif = await this.findOne(id);
    notif.is_read = isRead;
    notif.read_at = isRead ? new Date() : null as any;
    return this.notificationRepo.save(notif);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      { user_id: userId, is_read: false },
      { is_read: true, read_at: new Date() },
    );
    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  async registerFcmToken(userId: string, fcmToken: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    user.fcm_token = fcmToken;
    await this.userRepo.save(user);
    return { message: 'Token FCM enregistré' };
  }

  async remove(id: string) {
    const notif = await this.findOne(id);
    return this.notificationRepo.remove(notif);
  }
}
