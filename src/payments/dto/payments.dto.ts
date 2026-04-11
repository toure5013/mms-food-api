import { IsEnum, IsNotEmpty, IsOptional, IsUUID, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../common/enums/index';

export class CreatePaymentDto {
  @ApiProperty({ example: 'uuid-order', description: 'UUID de la commande à payer' })
  @IsUUID()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({ example: 'uuid-user', description: 'UUID de l\'utilisateur payeur' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.WAVE })
  @IsEnum(PaymentMethod)
  methode: PaymentMethod;

  @ApiProperty({ example: 1500, description: 'Montant en FCFA' })
  @IsNumber()
  @Min(1)
  montant: number;

  @ApiPropertyOptional({ example: '+225 0102030405', description: 'Numéro Mobile Money' })
  @IsOptional()
  @IsString()
  telephone?: string;
}

export class WebhookPaymentDto {
  @ApiProperty({ example: 'TXN-123456', description: 'ID de transaction du provider' })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({ example: 'REF-MMS-001', description: 'Référence interne MMS' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ enum: ['SUCCESS', 'FAILED'], example: 'SUCCESS' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ example: 'WAVE' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  amount?: number;
}
