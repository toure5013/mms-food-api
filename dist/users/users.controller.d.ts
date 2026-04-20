import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(orgId?: string, req?: any): Promise<import("./user.entity").User[]>;
    create(dto: CreateUserDto): Promise<import("./user.entity").User>;
    findOne(id: string): Promise<import("./user.entity").User>;
    update(id: string, dto: any): Promise<import("./user.entity").User>;
    remove(id: string): Promise<import("./user.entity").User>;
}
