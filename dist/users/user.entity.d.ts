import { UserRole } from '../common/enums/index';
import { Organisation } from '../organisations/organisation.entity';
import { Wallet } from '../wallet/wallet.entity';
export declare class User {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    password_hash: string;
    role: UserRole;
    telephone: string;
    avatar_url: string;
    service: string;
    regimes: string[];
    allergies: string[];
    otp_code: string;
    otp_expires_at: Date;
    loyalty_points: number;
    loyalty_expires_at: Date;
    fcm_token: string;
    is_active: boolean;
    is_first_login: boolean;
    organisation: Organisation;
    organisation_id: string;
    created_at: Date;
    updated_at: Date;
    wallet: Wallet;
}
