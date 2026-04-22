import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsArray, IsUUID, IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealSlot } from '../../common/enums/index';

export class CreateMenuDto {
  @ApiProperty({ example: '2026-04-14', description: 'Date du menu (YYYY-MM-DD)' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: MealSlot, example: MealSlot.NOON, description: 'Créneau: MORNING | NOON | EVENING' })
  @IsEnum(MealSlot)
  creneau: MealSlot;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/menus/menu-1.jpg', description: 'URL de l\'image du menu' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ example: 'uuid-organisation', description: 'UUID de l\'organisation' })
  @IsUUID()
  @IsNotEmpty()
  organisation_id: string;

  @ApiPropertyOptional({ example: ['uuid-dish-1', 'uuid-dish-2'], description: 'Liste des UUIDs des plats' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  plats_ids?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}

export class UpdateMenuDto {
  @ApiPropertyOptional({ example: '2026-04-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ enum: MealSlot })
  @IsOptional()
  @IsEnum(MealSlot)
  creneau?: MealSlot;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/menus/menu-1.jpg' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ example: ['uuid-dish-1'] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  plats_ids?: string[];

  @ApiPropertyOptional({ example: 'uuid-organisation' })
  @IsOptional()
  @IsUUID()
  organisation_id?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}

export class PublishMenuDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  is_published: boolean;
}
