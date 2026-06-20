import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { CreateDishDto, UpdateDishDto } from './dto/dishes.dto';
export declare class DishesService {
    private readonly dishRepo;
    constructor(dishRepo: Repository<Dish>);
    findAll(organisationId?: string): Promise<Dish[]>;
    findOne(id: string): Promise<Dish>;
    create(dto: CreateDishDto): Promise<Dish>;
    update(id: string, dto: UpdateDishDto): Promise<Dish>;
    remove(id: string): Promise<Dish>;
}
