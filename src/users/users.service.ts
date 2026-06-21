import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/users.dto';
import { UserRole } from '../common/enums/index';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

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
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    if (currentUser?.role === UserRole.ADMIN_CLIENT) {
      const allowed = [UserRole.EMPLOYEE, UserRole.COOK, UserRole.SERVER];
      if (!allowed.includes(dto.role)) {
        throw new ForbiddenException(`Un admin client ne peut créer que les rôles : ${allowed.join(', ')}`);
      }
      dto.organisation_id = currentUser.organisation_id;
    } else if (currentUser?.role === UserRole.ADMIN_MMS) {
      const forbidden = [UserRole.SUPER_ADMIN];
      if (forbidden.includes(dto.role)) {
        throw new ForbiddenException('Un ADMIN_MMS ne peut pas créer de SUPER_ADMIN');
      }
    }

    const hash = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const user = this.userRepo.create({
      prenom: dto.prenom,
      nom: dto.nom,
      email: dto.email,
      role: dto.role,
      organisation_id: dto.organisation_id,
      telephone: dto.telephone,
      avatar_url: dto.avatar_url,
      service: dto.service,
      regimes: dto.regimes,
      allergies: dto.allergies,
      password_hash: hash,
      is_first_login: !dto.password,
      is_active: true
    });
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
