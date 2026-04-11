import { AuthService } from './auth.service';
import { LoginDto, RequestOtpDto, VerifyOtpDto, SetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string | undefined;
            email: string | undefined;
            prenom: string | undefined;
            nom: string | undefined;
            role: import("../common/enums").UserRole | undefined;
            organisation_id: string | undefined;
            is_first_login: boolean | undefined;
            loyalty_points: number | undefined;
            wallet: {
                solde: number;
            } | null;
        };
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        message: string;
        expires_in_minutes: number;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        valid: boolean;
        message: string;
    }>;
    setPassword(dto: SetPasswordDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string | undefined;
            email: string | undefined;
            prenom: string | undefined;
            nom: string | undefined;
            role: import("../common/enums").UserRole | undefined;
            organisation_id: string | undefined;
            is_first_login: boolean | undefined;
            loyalty_points: number | undefined;
            wallet: {
                solde: number;
            } | null;
        };
    }>;
    getProfile(user: any): Promise<import("../users/user.entity").User>;
}
