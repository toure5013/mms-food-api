import { MealSlot } from '../common/enums/index';
import { Organisation } from '../organisations/organisation.entity';
import { Dish } from '../dishes/dish.entity';
export declare class Menu {
    id: string;
    date: string;
    creneau: MealSlot;
    is_published: boolean;
    image_url: string;
    published_at: Date;
    publication_limite: Date;
    organisation: Organisation;
    organisation_id: string;
    plats: Dish[];
    created_at: Date;
    updated_at: Date;
}
