import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { CreateDishDto, UpdateDishDto } from './dto/dishes.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  findAll(organisationId?: string) {
    const where: any = { is_active: true };
    if (organisationId) where.organisation_id = organisationId;
    return this.dishRepo.find({ where, order: { nom: 'ASC' } });
  }

  async findOne(id: string) {
    const dish = await this.dishRepo.findOne({ where: { id } });
    if (!dish) throw new NotFoundException('Plat introuvable');
    return dish;
  }

  create(dto: CreateDishDto, organisationId?: string) {
    const dish = this.dishRepo.create({ ...dto, organisation_id: organisationId ?? undefined });
    return this.dishRepo.save(dish);
  }

  async update(id: string, dto: UpdateDishDto) {
    const dish = await this.findOne(id);
    Object.assign(dish, dto);
    return this.dishRepo.save(dish);
  }

  async remove(id: string) {
    const dish = await this.findOne(id);
    dish.is_active = false;
    return this.dishRepo.save(dish);
  }
}
