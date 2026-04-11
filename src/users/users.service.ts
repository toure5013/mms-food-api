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

  findAllByOrganisation(orgId: string) {
    return this.userRepo.find({
      where: { organisation_id: orgId },
      order: { created_at: 'DESC' },
    });
  }

  findAllSuperAdmins() {
    return this.userRepo.find({
      where: { role: 'SUPER_ADMIN' as any },
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
}
