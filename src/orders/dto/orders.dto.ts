import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsArray, IsUUID, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealSlot, OrderStatus, PaymentMethod } from '../../common/enums/index';

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-employe', description: 'UUID de l\'employé commandant' })
  @IsUUID()
  @IsOptional()
  employe_id?: string;

  @ApiProperty({ example: 'uuid-organisation', description: 'UUID de l\'organisation' })
  @IsUUID()
  @IsNotEmpty()
  organisation_id: string;

  @ApiProperty({ enum: MealSlot, example: MealSlot.NOON })
  @IsEnum(MealSlot)
  creneau: MealSlot;

  @ApiProperty({ example: '2026-04-14', description: 'Date de livraison (YYYY-MM-DD)' })
  @IsDateString()
  date_livraison: string;

  @ApiProperty({ example: ['uuid-dish-1', 'uuid-dish-2'], description: 'UUIDs des plats commandés' })
  @IsArray()
  @IsUUID('4', { each: true })
  plats_ids: string[];

  @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.WAVE })
  @IsOptional()
  @IsEnum(PaymentMethod)
  methode_paiement?: PaymentMethod;
}

export class CreateGuestOrderDto {
  @ApiProperty({ example: 'uuid-organisation' })
  @IsUUID()
  @IsNotEmpty()
  organisation_id: string;

  @ApiProperty({ enum: MealSlot, example: MealSlot.NOON })
  @IsEnum(MealSlot)
  creneau: MealSlot;

  @ApiProperty({ example: '2026-04-14' })
  @IsDateString()
  date_livraison: string;

  @ApiProperty({ example: ['uuid-dish-1'] })
  @IsArray()
  @IsUUID('4', { each: true })
  plats_ids: string[];

  @ApiProperty({ example: { nom: 'Jean', chambre: '102' } })
  @IsNotEmpty()
  guest_info: any;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CONFIRMED, description: 'Nouveau statut de la commande' })
  @IsEnum(OrderStatus)
  statut: OrderStatus;
}

export class RetrieveOrderDto {
  @ApiProperty({ example: 'qr-code-token-string', description: 'Token QR code scanné' })
  @IsString()
  @IsNotEmpty()
  qr_code_token: string;

  @ApiPropertyOptional({ example: 'uuid-distributeur', description: 'UUID du distributeur' })
  @IsOptional()
  @IsUUID()
  recupere_par?: string;
}
