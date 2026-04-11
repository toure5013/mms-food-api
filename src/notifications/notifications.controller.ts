import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, MarkReadDto, RegisterFcmTokenDto } from './dto/notifications.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Mes notifications' })
  findAll(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.findAllByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Nombre de notifications non lues' })
  getUnreadCount(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.findUnreadCount(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une notification' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Envoyer une notification à un utilisateur' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue/non lue' })
  markAsRead(@Param('id') id: string, @Body() dto: MarkReadDto) {
    return this.notificationsService.markAsRead(id, dto.is_read);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marquer toutes mes notifications comme lues' })
  markAllAsRead(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post('fcm-token')
  @ApiOperation({ summary: 'Enregistrer le token FCM pour les notifications push' })
  registerFcmToken(@Req() req: any, @Body() dto: RegisterFcmTokenDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.registerFcmToken(userId, dto.fcm_token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une notification' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
