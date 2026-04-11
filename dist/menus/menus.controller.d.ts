import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto, PublishMenuDto } from './dto/menus.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    findAll(organisationId?: string, date?: string): Promise<import("./menu.entity").Menu[]>;
    findOne(id: string): Promise<import("./menu.entity").Menu>;
    create(dto: CreateMenuDto): Promise<import("./menu.entity").Menu>;
    update(id: string, dto: UpdateMenuDto): Promise<import("./menu.entity").Menu>;
    publish(id: string, dto: PublishMenuDto): Promise<import("./menu.entity").Menu>;
    remove(id: string): Promise<import("./menu.entity").Menu>;
}
