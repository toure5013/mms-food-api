import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll(organisationId?: string) {
    const where: any = {};
    if (organisationId) where.organisation_id = organisationId;
    
    return this.userRepo.find({
      where,
      relations: ['organisation'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ 
      where: { id },
      relations: ['organisation']
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create({
      ...dto,
      is_first_login: true,
      is_active: true,
    });
    return this.userRepo.save(user);
  }

  async update(id: string, dto: any) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
