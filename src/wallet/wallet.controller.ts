import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreditWalletDto, DebitWalletDto } from './dto/wallet.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Consulter mon porte-monnaie (solde)' })
  getWallet(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.getWallet(userId);
  }

  @Post('credit')
  @ApiOperation({ summary: 'Recharger le porte-monnaie via Mobile Money' })
  credit(@Req() req: any, @Body() dto: CreditWalletDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.credit(userId, dto);
  }

  @Post('debit')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Débiter le porte-monnaie (usage interne)' })
  debit(@Req() req: any, @Body() dto: DebitWalletDto) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.debit(userId, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Historique des transactions du porte-monnaie' })
  getTransactions(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.walletService.getTransactions(userId);
  }
}
