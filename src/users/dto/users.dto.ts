import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/index';

export class CreateUserDto {
  @ApiProperty({ example: 'Souleymane' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: 'Touré' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'toure@test.ci' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ example: 'uuid-organisation' })
  @IsOptional()
  @IsUUID()
  organisation_id?: string;

  @ApiPropertyOptional({ example: '+225 0102030405' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/avatars/user-1.jpg' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ example: 'Informatique' })
  @IsOptional()
  @IsString()
  service?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Souleymane' })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiPropertyOptional({ example: 'Touré' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'http://localhost:9000/mms-cantine/avatars/user-1.jpg' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ example: '+225 0102030405' })
  @IsOptional()
  @IsString()
  telephone?: string;
}
