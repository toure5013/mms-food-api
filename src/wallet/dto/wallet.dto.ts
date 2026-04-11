import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../common/enums/index';

export class CreditWalletDto {
  @ApiProperty({ example: 5000, description: 'Montant à créditer en FCFA' })
  @IsNumber()
  @Min(100)
  montant: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ORANGE_MONEY })
  @IsEnum(PaymentMethod)
  methode_paiement: PaymentMethod;

  @ApiPropertyOptional({ example: '+225 0102030405' })
  @IsOptional()
  @IsString()
  telephone?: string;
}

export class DebitWalletDto {
  @ApiProperty({ example: 1500, description: 'Montant à débiter en FCFA' })
  @IsNumber()
  @Min(1)
  montant: number;

  @ApiPropertyOptional({ example: 'Paiement commande MMS-2026-001' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-order' })
  @IsOptional()
  @IsString()
  reference?: string;
}
