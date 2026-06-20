import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';
import { UserRole } from '../common/enums/index';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll(organisationId?: string, role?: UserRole) {
    const where: any = {};
    if (organisationId) where.organisation_id = organisationId;
    if (role) where.role = role;
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

  async create(dto: CreateUserDto, currentUser?: User) {
    if (currentUser?.role === UserRole.ADMIN_CLIENT) {
      const allowed = [UserRole.EMPLOYEE, UserRole.COOK, UserRole.SERVER];
      if (!allowed.includes(dto.role)) {
        throw new ForbiddenException(`Un admin client ne peut créer que les rôles : ${allowed.join(', ')}`);
      }
      dto.organisation_id = currentUser.organisation_id;
    }
    const user = this.userRepo.create({ ...dto, is_first_login: true, is_active: true });
    return this.userRepo.save(user);
  }

  async update(id: string, dto: any, currentUser?: User) {
    const user = await this.findOne(id);
    if (currentUser?.role === UserRole.ADMIN_CLIENT) {
      if (user.organisation_id !== currentUser.organisation_id) {
        throw new ForbiddenException('Accès refusé — cet utilisateur n\'appartient pas à votre organisation');
      }
    }
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async toggleActive(id: string, currentUser: User) {
    const user = await this.findOne(id);
    if (currentUser.role === UserRole.ADMIN_CLIENT) {
      if (user.organisation_id !== currentUser.organisation_id) {
        throw new ForbiddenException('Accès refusé — cet utilisateur n\'appartient pas à votre organisation');
      }
    }
    user.is_active = !user.is_active;
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
