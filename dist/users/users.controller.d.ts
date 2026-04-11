import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(orgId?: string): Promise<import("./user.entity").User[]>;
    create(dto: CreateUserDto): Promise<import("./user.entity").User>;
    findOne(id: string): Promise<import("./user.entity").User>;
}
