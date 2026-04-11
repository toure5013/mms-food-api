import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { AddPointsDto, RedeemPointsDto } from './dto/loyalty.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Loyalty')
@ApiBearerAuth()
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('points')
  @ApiOperation({ summary: 'Consulter mes points de fidélité' })
  getPoints(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.loyaltyService.getPoints(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historique des points gagnés / dépensés' })
  getHistory(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.loyaltyService.getHistory(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Classement des utilisateurs par points de fidélité' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre max de résultats (défaut: 10)' })
  getLeaderboard(@Query('limit') limit?: number) {
    return this.loyaltyService.getLeaderboard(limit ? Number(limit) : 10);
  }

  @Post('add')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Ajouter des points de fidélité à un utilisateur (admin)' })
  addPoints(@Body() dto: AddPointsDto) {
    return this.loyaltyService.addPoints(dto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Utiliser des points de fidélité' })
  redeemPoints(@Req() req: any, @Body() dto: RedeemPointsDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.loyaltyService.redeemPoints(userId, dto);
  }
}
