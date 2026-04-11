import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { Dish } from '../dishes/dish.entity';
import { CreateMenuDto, UpdateMenuDto } from './dto/menus.dto';
export declare class MenusService {
    private readonly menuRepo;
    private readonly dishRepo;
    constructor(menuRepo: Repository<Menu>, dishRepo: Repository<Dish>);
    findAll(organisationId?: string, date?: string): Promise<Menu[]>;
    findOne(id: string): Promise<Menu>;
    create(dto: CreateMenuDto): Promise<Menu>;
    update(id: string, dto: UpdateMenuDto): Promise<Menu>;
    publish(id: string, isPublished: boolean): Promise<Menu>;
    remove(id: string): Promise<Menu>;
}
