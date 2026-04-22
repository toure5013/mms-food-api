import { MealSlot } from '../../common/enums/index';
export declare class CreateMenuDto {
    date: string;
    creneau: MealSlot;
    image_url?: string;
    organisation_id: string;
    plats_ids?: string[];
    is_published?: boolean;
}
export declare class UpdateMenuDto {
    date?: string;
    creneau?: MealSlot;
    image_url?: string;
    plats_ids?: string[];
    organisation_id?: string;
    is_published?: boolean;
}
export declare class PublishMenuDto {
    is_published: boolean;
}
