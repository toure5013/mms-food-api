import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationChannel } from '../../common/enums/index';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Commande prête !', description: 'Titre de la notification' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ example: 'Votre commande MMS-2026-001 est prête au retrait.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'uuid-user', description: 'UUID du destinataire' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiPropertyOptional({ enum: NotificationChannel, example: NotificationChannel.PUSH })
  @IsOptional()
  @IsEnum(NotificationChannel)
  canal?: NotificationChannel;

  @ApiPropertyOptional({ example: '/orders/uuid-order' })
  @IsOptional()
  @IsString()
  action_url?: string;

  @ApiPropertyOptional({ example: '{"order_id": "uuid"}' })
  @IsOptional()
  @IsString()
  metadata?: string;
}

export class MarkReadDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  is_read: boolean;
}

export class RegisterFcmTokenDto {
  @ApiProperty({ example: 'firebase_cloud_messaging_token_here' })
  @IsString()
  @IsNotEmpty()
  fcm_token: string;
}
