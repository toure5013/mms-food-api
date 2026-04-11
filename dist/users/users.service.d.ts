import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findAllByOrganisation(orgId: string): Promise<User[]>;
    findAllSuperAdmins(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
}
