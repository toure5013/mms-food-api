import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    findAll(organisationId?: string): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    update(id: string, dto: any): Promise<User>;
    remove(id: string): Promise<User>;
}
