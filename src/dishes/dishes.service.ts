import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';

import { CreateDishDto } from './dto/dishes.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  findAll() {
    return this.dishRepo.find({
      where: { is_active: true },
      order: { nom: 'ASC' },
    });
  }

  async findOne(id: string) {
    const dish = await this.dishRepo.findOne({ where: { id } });
    if (!dish) throw new NotFoundException('Plat introuvable');
    return dish;
  }

  create(dto: CreateDishDto) {
    const dish = this.dishRepo.create(dto);
    return this.dishRepo.save(dish);
  }
}
