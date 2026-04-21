import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RequestOtpDto, VerifyOtpDto, SetPasswordDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion email + mot de passe', description: 'Authentifie un utilisateur avec ses identifiants et retourne un token JWT.' })
  @ApiResponse({ status: 200, description: 'Connexion réussie — retourne le token JWT et les infos utilisateur.' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demande d\'OTP par email', description: 'Envoie un code OTP à 6 chiffres par email pour la première connexion ou la réinitialisation du mot de passe.' })
  @ApiResponse({ status: 200, description: 'OTP envoyé avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérification du code OTP', description: 'Valide le code OTP reçu par email. Retourne un token temporaire pour définir le mot de passe.' })
  @ApiResponse({ status: 200, description: 'OTP vérifié avec succès.' })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré.' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('password/set')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Définir ou réinitialiser le mot de passe', description: 'Définit un nouveau mot de passe après validation de l\'OTP.' })
  @ApiResponse({ status: 200, description: 'Mot de passe défini avec succès.' })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré.' })
  setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté', description: 'Retourne les informations complètes de l\'utilisateur authentifié (nom, rôle, organisation, etc.).' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur retourné.' })
  @ApiResponse({ status: 401, description: 'Token JWT manquant ou invalide.' })
  getProfile(@CurrentUser() user: any) {
    console.log("CurrentUser");
    console.log(user);

    return this.authService.getProfile(user.id);
  }
}
