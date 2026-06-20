import { DishCategory } from '../common/enums/index';
import { Organisation } from '../organisations/organisation.entity';
export declare class Dish {
    id: string;
    nom: string;
    description: string;
    photo_url: string;
    categorie: DishCategory;
    prix: number;
    sans_sel: boolean;
    sans_gras: boolean;
    sans_sucre: boolean;
    sans_huile: boolean;
    vegetarien: boolean;
    halal: boolean;
    allergenes: string[];
    organisation_id: string;
    organisation: Organisation;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
