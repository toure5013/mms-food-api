import { UsersService } from './users.service';
import { UserRole } from '../common/enums/index';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(orgId?: string, role?: UserRole, req?: any): Promise<import("./user.entity").User[]>;
    create(dto: CreateUserDto, req: any): Promise<import("./user.entity").User>;
    findOne(id: string): Promise<import("./user.entity").User>;
    update(id: string, dto: UpdateUserDto, req: any): Promise<import("./user.entity").User>;
    toggleActive(id: string, req: any): Promise<import("./user.entity").User>;
    remove(id: string): Promise<import("./user.entity").User>;
}
