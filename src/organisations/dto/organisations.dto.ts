import { IsString, IsNotEmpty, IsOptional, IsEnum, IsHexColor, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuMode, SubventionType, DishCategory, FinancialMode } from '../../common/enums/index';

export class CreateOrganisationDto {
  @ApiProperty({ example: 'BMCE Bank' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'bmce-bank' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/logos/bmce.png' })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiPropertyOptional({ example: '#E87722' })
  @IsOptional()
  @IsHexColor()
  couleur_primaire?: string;

  @ApiPropertyOptional({ example: '#1A1A2E' })
  @IsOptional()
  @IsHexColor()
  couleur_secondaire?: string;

  @ApiPropertyOptional({ enum: MenuMode, example: MenuMode.AUTONOME })
  @IsOptional()
  @IsEnum(MenuMode)
  mode_gestion_menu?: MenuMode;

  @ApiPropertyOptional({ enum: SubventionType, example: SubventionType.FIXED })
  @IsOptional()
  @IsEnum(SubventionType)
  subvention_type?: SubventionType;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subvention_valeur?: number;

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subvention_plafond_mensuel?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_min_plats?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_max_plats?: number;

  @ApiPropertyOptional({ example: 6000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_max_menu?: number;

  @ApiPropertyOptional({ example: [DishCategory.RESISTANCE] })
  @IsOptional()
  @IsArray()
  @IsEnum(DishCategory, { each: true })
  composition_menu?: DishCategory[];

  @ApiPropertyOptional({ enum: FinancialMode, example: FinancialMode.DEBT })
  @IsOptional()
  @IsEnum(FinancialMode)
  financial_mode?: FinancialMode;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  is_guest_order_enabled?: boolean;

  @ApiPropertyOptional({ example: { fields: [] } })
  @IsOptional()
  guest_config?: any;

  @ApiPropertyOptional({ example: "08:00" })
  @IsOptional()
  @IsString()
  guest_order_start_time?: string;

  @ApiPropertyOptional({ example: "11:30" })
  @IsOptional()
  @IsString()
  guest_order_end_time?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order_day_offset?: number;
}

export class UpdateOrganisationDto {
  @ApiPropertyOptional({ example: 'BMCE Bank' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'bmce-bank' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/logos/bmce.png' })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiPropertyOptional({ example: '#E87722' })
  @IsOptional()
  @IsHexColor()
  couleur_primaire?: string;

  @ApiPropertyOptional({ example: '#1A1A2E' })
  @IsOptional()
  @IsHexColor()
  couleur_secondaire?: string;

  @ApiPropertyOptional({ enum: MenuMode, example: MenuMode.AUTONOME })
  @IsOptional()
  @IsEnum(MenuMode)
  mode_gestion_menu?: MenuMode;

  @ApiPropertyOptional({ enum: SubventionType, example: SubventionType.FIXED })
  @IsOptional()
  @IsEnum(SubventionType)
  subvention_type?: SubventionType;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subvention_valeur?: number;

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subvention_plafond_mensuel?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_min_plats?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_max_plats?: number;

  @ApiPropertyOptional({ example: 6000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_max_menu?: number;

  @ApiPropertyOptional({ example: [DishCategory.RESISTANCE] })
  @IsOptional()
  @IsArray()
  @IsEnum(DishCategory, { each: true })
  composition_menu?: DishCategory[];

  @ApiPropertyOptional({ enum: FinancialMode, example: FinancialMode.DEBT })
  @IsOptional()
  @IsEnum(FinancialMode)
  financial_mode?: FinancialMode;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  is_guest_order_enabled?: boolean;

  @ApiPropertyOptional({ example: { fields: [] } })
  @IsOptional()
  guest_config?: any;

  @ApiPropertyOptional({ example: "08:00" })
  @IsOptional()
  @IsString()
  guest_order_start_time?: string;

  @ApiPropertyOptional({ example: "11:30" })
  @IsOptional()
  @IsString()
  guest_order_end_time?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  order_day_offset?: number;
}
