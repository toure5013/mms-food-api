import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RequestOtpDto, VerifyOtpDto, SetPasswordDto, RefreshTokenDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion email + mot de passe' })
  @ApiResponse({ status: 200, description: 'Token JWT retourné.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Demande d'OTP par email" })
  @ApiResponse({ status: 200, description: 'OTP envoyé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérification du code OTP' })
  @ApiResponse({ status: 200, description: 'OTP vérifié.' })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré.' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('password/set')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Définir ou réinitialiser le mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe défini.' })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré.' })
  setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir le access_token via le refresh_token' })
  @ApiResponse({ status: 200, description: 'Nouveau access_token retourné.' })
  @ApiResponse({ status: 401, description: 'Refresh token invalide ou expiré.' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Déconnexion (invalide le token côté client)' })
  @ApiResponse({ status: 200, description: 'Déconnecté avec succès.' })
  logout() {
    return { message: 'Déconnexion réussie' };
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Profil de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Profil retourné.' })
  @ApiResponse({ status: 401, description: 'Token JWT manquant ou invalide.' })
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}
