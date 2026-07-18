import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BootstrapDto {
  @ApiProperty({ description: 'Code secret défini dans BOOTSTRAP_SECRET (env)' })
  @IsString()
  @IsNotEmpty()
  secret: string;

  @ApiProperty({ description: 'Exécuter les migrations TypeORM avant le seed', default: false })
  @IsBoolean()
  runMigrations: boolean;
}
