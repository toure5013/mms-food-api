import { MenuMode, SubventionType } from '../../common/enums/index';
export declare class CreateOrganisationDto {
    nom: string;
    slug: string;
    logo_url?: string;
    couleur_primaire?: string;
    mode_menu?: MenuMode;
    type_subvention?: SubventionType;
}
export declare class UpdateOrganisationDto {
    nom?: string;
    logo_url?: string;
    couleur_primaire?: string;
}
