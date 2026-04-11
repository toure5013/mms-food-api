import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DishCategory } from '../../common/enums/index';

export class CreateDishDto {
  @ApiProperty({ example: 'Poulet Yassa' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({ example: 'Délicieux poulet mariné au citron et oignons' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/dishes/poulet-yassa.jpg' })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiPropertyOptional({ enum: DishCategory, example: DishCategory.RESISTANCE })
  @IsOptional()
  @IsEnum(DishCategory)
  categorie?: DishCategory;

  @ApiProperty({ example: 3500 })
  @IsNumber()
  @Min(0)
  prix: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sans_sel?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sans_gras?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sans_sucre?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  vegetarien?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  halal?: boolean;

  @ApiPropertyOptional({ example: ['Arachide'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergenes?: string[];
}

export class UpdateDishDto {
  @ApiPropertyOptional({ example: 'Poulet Yassa' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'Délicieux poulet mariné au citron et oignons' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/dishes/poulet-yassa.jpg' })
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiPropertyOptional({ enum: DishCategory })
  @IsOptional()
  @IsEnum(DishCategory)
  categorie?: DishCategory;

  @ApiPropertyOptional({ example: 3500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sans_sel?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sans_gras?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sans_sucre?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  vegetarien?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  halal?: boolean;

  @ApiPropertyOptional({ example: ['Arachide'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergenes?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
