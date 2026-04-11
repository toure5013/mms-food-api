import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoyaltyTransactionType } from '../loyalty-transaction.entity';

export class AddPointsDto {
  @ApiProperty({ example: 'uuid-user', description: 'UUID de l\'utilisateur' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 10, description: 'Nombre de points' })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiPropertyOptional({ enum: LoyaltyTransactionType, example: LoyaltyTransactionType.EARNED })
  @IsOptional()
  @IsEnum(LoyaltyTransactionType)
  type?: LoyaltyTransactionType;

  @ApiPropertyOptional({ example: 'Points commande MMS-2026-001' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-order' })
  @IsOptional()
  @IsString()
  reference?: string;
}

export class RedeemPointsDto {
  @ApiProperty({ example: 50, description: 'Nombre de points à utiliser' })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiPropertyOptional({ example: 'Réduction sur commande' })
  @IsOptional()
  @IsString()
  description?: string;
}
