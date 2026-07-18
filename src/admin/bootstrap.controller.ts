import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { timingSafeEqual } from 'crypto';
import { Public } from '../common/decorators/public.decorator';
import { BootstrapService } from './bootstrap.service';
import { BootstrapDto } from './bootstrap.dto';

@ApiTags('Bootstrap')
@Public()
@Controller('bootstrap')
export class BootstrapController {
  constructor(
    private readonly bootstrapService: BootstrapService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Initialise l\'application (migrations + seed complet)',
    description: 'Protégé par un code secret (BOOTSTRAP_SECRET en env). Idempotent : les données déjà présentes sont ignorées.',
  })
  @ApiResponse({ status: 200, description: 'Initialisation réussie' })
  @ApiResponse({ status: 401, description: 'Code secret invalide ou BOOTSTRAP_SECRET non défini' })
  async bootstrap(@Body() dto: BootstrapDto) {
    const envSecret = this.configService.get<string>('BOOTSTRAP_SECRET');
    if (!envSecret) throw new UnauthorizedException('BOOTSTRAP_SECRET non configuré dans l\'environnement');

    const a = Buffer.from(dto.secret);
    const b = Buffer.from(envSecret);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Code secret invalide');
    }

    return this.bootstrapService.run(dto.runMigrations);
  }
}
