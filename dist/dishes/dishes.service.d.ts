import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { CreateDishDto } from './dto/dishes.dto';
export declare class DishesService {
    private readonly dishRepo;
    constructor(dishRepo: Repository<Dish>);
    findAll(): Promise<Dish[]>;
    findOne(id: string): Promise<Dish>;
    create(dto: CreateDishDto): Promise<Dish>;
}
