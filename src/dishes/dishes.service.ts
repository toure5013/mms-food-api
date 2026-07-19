import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { CreateDishDto, UpdateDishDto } from './dto/dishes.dto';
import { UserRole } from '../common/enums/index';

interface RequestUser {
  role: UserRole;
  organisation_id?: string | null;
}

const isPlatformAdmin = (user?: RequestUser) =>
  user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN_MMS;

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  findAll(user?: RequestUser) {
    // SUPER_ADMIN / ADMIN_MMS gèrent le catalogue global: ils voient tout.
    if (isPlatformAdmin(user) || !user?.organisation_id) {
      return this.dishRepo.find({ where: { is_active: true }, order: { nom: 'ASC' } });
    }
    // Les autres rôles (dont ADMIN_CLIENT) voient les plats globaux (créés par le
    // super admin) ainsi que les plats de leur propre organisation, jamais ceux
    // d'une autre organisation.
    return this.dishRepo.find({
      where: [
        { is_active: true, organisation_id: IsNull() },
        { is_active: true, organisation_id: user.organisation_id },
      ],
      order: { nom: 'ASC' },
    });
  }

  async findOne(id: string, user?: RequestUser) {
    const dish = await this.dishRepo.findOne({ where: { id } });
    if (!dish) throw new NotFoundException('Plat introuvable');
    this.assertVisible(dish, user);
    return dish;
  }

  create(dto: CreateDishDto, organisationId?: string) {
    const dish = this.dishRepo.create({ ...dto, organisation_id: organisationId ?? undefined });
    return this.dishRepo.save(dish);
  }

  async update(id: string, dto: UpdateDishDto, user?: RequestUser) {
    const dish = await this.findOne(id, user);
    this.assertEditable(dish, user);
    Object.assign(dish, dto);
    return this.dishRepo.save(dish);
  }

  async remove(id: string, user?: RequestUser) {
    const dish = await this.findOne(id, user);
    this.assertEditable(dish, user);
    dish.is_active = false;
    return this.dishRepo.save(dish);
  }

  private assertVisible(dish: Dish, user?: RequestUser) {
    if (isPlatformAdmin(user) || !user?.organisation_id) return;
    if (dish.organisation_id && dish.organisation_id !== user.organisation_id) {
      // 404 plutôt que 403: un admin ne doit même pas savoir qu'un plat
      // appartenant à une autre organisation existe.
      throw new NotFoundException('Plat introuvable');
    }
  }

  private assertEditable(dish: Dish, user?: RequestUser) {
    if (isPlatformAdmin(user)) return;
    if (!dish.organisation_id || dish.organisation_id !== user?.organisation_id) {
      throw new ForbiddenException('Seul le plat de votre organisation peut être modifié');
    }
  }
}
