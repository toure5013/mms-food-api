import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreditWalletDto, DebitWalletDto } from './dto/wallet.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Wallet')
@ApiBearerAuth('JWT-auth')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Consulter mon solde', description: 'Retourne le solde actuel du porte-monnaie de l\'utilisateur connecté.' })
  @ApiResponse({ status: 200, description: 'Porte-monnaie trouvé.' })
  @ApiResponse({ status: 401, description: 'Non authentifié.' })
  getWallet(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.getWallet(userId);
  }

  @Post('credit')
  @ApiOperation({ summary: 'Recharger le porte-monnaie', description: 'Initie une recharge via Mobile Money pour augmenter le solde.' })
  @ApiResponse({ status: 201, description: 'Recharge initiée.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  credit(@Req() req: any, @Body() dto: CreditWalletDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.credit(userId, dto);
  }

  @Post('debit')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Débiter le porte-monnaie', description: 'Effectue un débit manuel sur le solde d\'un utilisateur (usage administratif).' })
  @ApiResponse({ status: 201, description: 'Débit effectué.' })
  @ApiResponse({ status: 403, description: 'Interdit.' })
  debit(@Req() req: any, @Body() dto: DebitWalletDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.debit(userId, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Historique des transactions', description: 'Liste toutes les opérations de crédit et débit passées sur le porte-monnaie.' })
  @ApiResponse({ status: 200, description: 'Liste des transactions retournée.' })
  getTransactions(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.getTransactions(userId);
  }
}
