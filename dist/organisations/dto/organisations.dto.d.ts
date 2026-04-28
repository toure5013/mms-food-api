import { MenuMode, SubventionType, DishCategory, FinancialMode } from '../../common/enums/index';
export declare class CreateOrganisationDto {
    nom: string;
    slug: string;
    logo_url?: string;
    couleur_primaire?: string;
    couleur_secondaire?: string;
    mode_gestion_menu?: MenuMode;
    subvention_type?: SubventionType;
    subvention_valeur?: number;
    subvention_plafond_mensuel?: number;
    prix_min_plats?: number;
    prix_max_plats?: number;
    prix_max_menu?: number;
    composition_menu?: DishCategory[];
    financial_mode?: FinancialMode;
    is_active?: boolean;
    is_guest_order_enabled?: boolean;
    guest_config?: any;
    guest_order_start_time?: string;
    guest_order_end_time?: string;
    order_day_offset?: number;
}
export declare class UpdateOrganisationDto {
    nom?: string;
    slug?: string;
    logo_url?: string;
    couleur_primaire?: string;
    couleur_secondaire?: string;
    mode_gestion_menu?: MenuMode;
    subvention_type?: SubventionType;
    subvention_valeur?: number;
    subvention_plafond_mensuel?: number;
    prix_min_plats?: number;
    prix_max_plats?: number;
    prix_max_menu?: number;
    composition_menu?: DishCategory[];
    financial_mode?: FinancialMode;
    is_active?: boolean;
    is_guest_order_enabled?: boolean;
    guest_config?: any;
    guest_order_start_time?: string;
    guest_order_end_time?: string;
    order_day_offset?: number;
}
