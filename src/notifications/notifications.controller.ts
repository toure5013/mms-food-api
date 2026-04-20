import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, MarkReadDto, RegisterFcmTokenDto } from './dto/notifications.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Mes notifications', description: 'Liste toutes les notifications reçues par l\'utilisateur connecté.' })
  @ApiResponse({ status: 200, description: 'Liste des notifications retournée.' })
  findAll(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.findAllByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Compteur de non lues', description: 'Retourne le nombre total de notifications non encore consultées.' })
  @ApiResponse({ status: 200, description: 'Compteur retourné.' })
  getUnreadCount(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.findUnreadCount(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails notification', description: 'Retourne le contenu détaillé d\'une notification spécifique.' })
  @ApiParam({ name: 'id', description: 'UUID de la notification' })
  @ApiResponse({ status: 200, description: 'Notification trouvée.' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Envoyer une notification', description: 'Envoie manuellement une notification à un utilisateur (admin uniquement).' })
  @ApiResponse({ status: 201, description: 'Notification envoyée.' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Changer statut lecture', description: 'Marque une notification comme lue ou non lue.' })
  @ApiParam({ name: 'id', description: 'UUID de la notification' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  markAsRead(@Param('id') id: string, @Body() dto: MarkReadDto) {
    return this.notificationsService.markAsRead(id, dto.is_read);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Tout marquer comme lu', description: 'Marque instantanément toutes les notifications de l\'utilisateur comme lues.' })
  @ApiResponse({ status: 200, description: 'Toutes les notifications marquées comme lues.' })
  markAllAsRead(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post('fcm-token')
  @ApiOperation({ summary: 'Enregistrer token FCM', description: 'Associe un token Firebase Cloud Messaging à l\'utilisateur pour les notifications Push.' })
  @ApiResponse({ status: 201, description: 'Token enregistré.' })
  registerFcmToken(@Req() req: any, @Body() dto: RegisterFcmTokenDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.notificationsService.registerFcmToken(userId, dto.fcm_token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une notification', description: 'Supprime définitivement une notification de l\'historique.' })
  @ApiParam({ name: 'id', description: 'UUID de la notification' })
  @ApiResponse({ status: 200, description: 'Notification supprimée.' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
