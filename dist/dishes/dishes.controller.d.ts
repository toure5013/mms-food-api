import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/dishes.dto';
export declare class DishesController {
    private readonly dishesService;
    constructor(dishesService: DishesService);
    findAll(): Promise<import("./dish.entity").Dish[]>;
    create(dto: CreateDishDto): Promise<import("./dish.entity").Dish>;
    findOne(id: string): Promise<import("./dish.entity").Dish>;
}
