import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { AddPointsDto, RedeemPointsDto } from './dto/loyalty.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Loyalty')
@ApiBearerAuth('JWT-auth')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('points')
  @ApiOperation({ summary: 'Mes points', description: 'Retourne le solde actuel de points de fidélité de l\'utilisateur.' })
  @ApiResponse({ status: 200, description: 'Solde de points retourné.' })
  getPoints(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.loyaltyService.getPoints(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historique des points', description: 'Affiche toutes les transactions de gains et dépenses de points de fidélité.' })
  @ApiResponse({ status: 200, description: 'Historique retourné.' })
  getHistory(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.loyaltyService.getHistory(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Classement', description: 'Retourne le top des utilisateurs ayant le plus de points de fidélité.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Nb max de résultats (défaut: 10)' })
  @ApiResponse({ status: 200, description: 'Classement retourné.' })
  getLeaderboard(@Query('limit') limit?: number) {
    return this.loyaltyService.getLeaderboard(limit ? Number(limit) : 10);
  }

  @Post('add')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Ajouter des points (Admin)', description: 'Crédite manuellement des points à un utilisateur (récompense exceptionnelle, etc.).' })
  @ApiResponse({ status: 201, description: 'Points ajoutés.' })
  @ApiResponse({ status: 403, description: 'Interdit.' })
  addPoints(@Body() dto: AddPointsDto) {
    return this.loyaltyService.addPoints(dto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Utiliser mes points', description: 'Convertit des points de fidélité en avantages ou bons (selon règles business).' })
  @ApiResponse({ status: 201, description: 'Points utilisés avec succès.' })
  @ApiResponse({ status: 400, description: 'Points insuffisants ou offre invalide.' })
  redeemPoints(@Req() req: any, @Body() dto: RedeemPointsDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.loyaltyService.redeemPoints(userId, dto);
  }
}
