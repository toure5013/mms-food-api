import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { LoginDto, RequestOtpDto, VerifyOtpDto, SetPasswordDto } from './dto/auth.dto';
import { UserRole } from '../common/enums/index';
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string | undefined;
            email: string | undefined;
            prenom: string | undefined;
            nom: string | undefined;
            role: UserRole | undefined;
            organisation_id: string | undefined;
            is_first_login: boolean | undefined;
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
            role: UserRole | undefined;
            organisation_id: string | undefined;
            is_first_login: boolean | undefined;
        };
    }>;
    private generateTokens;
    private generateOtp;
}
