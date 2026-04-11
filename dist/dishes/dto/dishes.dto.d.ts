import { DishCategory } from '../../common/enums/index';
export declare class CreateDishDto {
    nom: string;
    description?: string;
    photo_url?: string;
    categorie?: DishCategory;
    prix: number;
    sans_sel?: boolean;
    sans_gras?: boolean;
    sans_sucre?: boolean;
    vegetarien?: boolean;
    halal?: boolean;
    allergenes?: string[];
}
export declare class UpdateDishDto {
    nom?: string;
    description?: string;
    photo_url?: string;
    categorie?: DishCategory;
    prix?: number;
    sans_sel?: boolean;
    sans_gras?: boolean;
    sans_sucre?: boolean;
    vegetarien?: boolean;
    halal?: boolean;
    allergenes?: string[];
    is_active?: boolean;
}
