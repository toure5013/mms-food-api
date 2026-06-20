import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';
import { UserRole } from '../common/enums/index';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findAll(organisationId?: string, role?: UserRole): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(dto: CreateUserDto, currentUser?: User): Promise<User>;
    update(id: string, dto: any, currentUser?: User): Promise<User>;
    toggleActive(id: string, currentUser: User): Promise<User>;
    remove(id: string): Promise<User>;
}
