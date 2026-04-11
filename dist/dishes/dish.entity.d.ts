import { DishCategory } from '../common/enums/index';
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
    vegetarien: boolean;
    halal: boolean;
    allergenes: string[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
