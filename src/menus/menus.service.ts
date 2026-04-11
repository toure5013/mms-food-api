import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Menu } from './menu.entity';
import { Dish } from '../dishes/dish.entity';
import { CreateMenuDto, UpdateMenuDto } from './dto/menus.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  findAll(organisationId?: string, date?: string) {
    const where: any = {};
    if (organisationId) where.organisation_id = organisationId;
    if (date) where.date = date;

    return this.menuRepo.find({
      where,
      relations: ['plats', 'organisation'],
      order: { date: 'DESC', creneau: 'ASC' },
    });
  }

  async findOne(id: string) {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['plats', 'organisation'],
    });
    if (!menu) throw new NotFoundException('Menu introuvable');
    return menu;
  }

  async create(dto: CreateMenuDto) {
    const { plats_ids, ...menuData } = dto;

    const menu = this.menuRepo.create(menuData);

    if (plats_ids?.length) {
      menu.plats = await this.dishRepo.find({
        where: { id: In(plats_ids) },
      });
    }

    return this.menuRepo.save(menu);
  }

  async update(id: string, dto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    const { plats_ids, ...updateData } = dto;

    Object.assign(menu, updateData);

    if (plats_ids) {
      menu.plats = await this.dishRepo.find({
        where: { id: In(plats_ids) },
      });
    }

    return this.menuRepo.save(menu);
  }

  async publish(id: string, isPublished: boolean) {
    const menu = await this.findOne(id);
    menu.is_published = isPublished;
    if (isPublished) {
      menu.published_at = new Date();
    }
    return this.menuRepo.save(menu);
  }

  async remove(id: string) {
    const menu = await this.findOne(id);
    return this.menuRepo.remove(menu);
  }
}
