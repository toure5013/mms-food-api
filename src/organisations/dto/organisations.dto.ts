import { IsString, IsNotEmpty, IsOptional, IsEnum, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuMode, SubventionType } from '../../common/enums/index';

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

  @ApiPropertyOptional({ enum: MenuMode, example: MenuMode.AUTONOME })
  @IsOptional()
  @IsEnum(MenuMode)
  mode_menu?: MenuMode;

  @ApiPropertyOptional({ enum: SubventionType, example: SubventionType.FIXED })
  @IsOptional()
  @IsEnum(SubventionType)
  type_subvention?: SubventionType;
}

export class UpdateOrganisationDto {
  @ApiPropertyOptional({ example: 'BMCE Bank' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/logos/bmce.png' })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiPropertyOptional({ example: '#E87722' })
  @IsOptional()
  @IsHexColor()
  couleur_primaire?: string;
}
