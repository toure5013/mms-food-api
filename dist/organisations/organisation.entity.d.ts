import { MenuMode, SubventionType, FinancialMode } from '../common/enums/index';
import { User } from '../users/user.entity';
export declare class Organisation {
    id: string;
    slug: string;
    nom: string;
    logo_url: string;
    couleur_primaire: string;
    couleur_secondaire: string;
    mode_gestion_menu: MenuMode;
    subvention_type: SubventionType;
    financial_mode: FinancialMode;
    subvention_valeur: number;
    subvention_plafond_mensuel: number;
    is_active: boolean;
    prix_min_plats: number;
    prix_max_plats: number;
    prix_max_menu: number;
    is_guest_order_enabled: boolean;
    guest_config: any;
    guest_order_start_time: string;
    guest_order_end_time: string;
    order_day_offset: number;
    users: User[];
    created_at: Date;
    updated_at: Date;
}
