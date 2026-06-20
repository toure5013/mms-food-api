import { DishesService } from './dishes.service';
import { CreateDishDto, UpdateDishDto } from './dto/dishes.dto';
export declare class DishesController {
    private readonly dishesService;
    constructor(dishesService: DishesService);
    findAll(req: any): Promise<import("./dish.entity").Dish[]>;
    create(dto: CreateDishDto, req: any): Promise<import("./dish.entity").Dish>;
    findOne(id: string): Promise<import("./dish.entity").Dish>;
    update(id: string, dto: UpdateDishDto): Promise<import("./dish.entity").Dish>;
    remove(id: string): Promise<import("./dish.entity").Dish>;
}
