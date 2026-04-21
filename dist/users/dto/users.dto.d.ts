import { UserRole } from '../../common/enums/index';
export declare class CreateUserDto {
    prenom: string;
    nom: string;
    email: string;
    role: UserRole;
    organisation_id?: string;
    telephone?: string;
    avatar_url?: string;
    service?: string;
    regimes?: string[];
    allergies?: string[];
}
export declare class UpdateUserDto {
    prenom?: string;
    nom?: string;
    avatar_url?: string;
    telephone?: string;
    regimes?: string[];
    allergies?: string[];
}
