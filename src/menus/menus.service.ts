import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Menu } from './menu.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';
import { CreateMenuDto, UpdateMenuDto } from './dto/menus.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
    @InjectRepository(Organisation)
    private readonly orgRepo: Repository<Organisation>,
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

    const organisation = await this.orgRepo.findOne({ where: { id: dto.organisation_id } });
    if (!organisation) throw new NotFoundException('Organisation introuvable');

    const menu = this.menuRepo.create(menuData);

    if (plats_ids?.length) {
      menu.plats = await this.resolveDishesForOrganisation(plats_ids, dto.organisation_id);
    }

    return this.menuRepo.save(menu);
  }

  async update(id: string, dto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    const { plats_ids, ...updateData } = dto;

    Object.assign(menu, updateData);

    if (plats_ids) {
      menu.plats = await this.resolveDishesForOrganisation(plats_ids, menu.organisation_id);
    }

    return this.menuRepo.save(menu);
  }

  /**
   * Un menu ne peut être composé que des plats globaux (créés par le super admin)
   * et des plats appartenant à sa propre organisation — jamais des plats d'une
   * autre organisation.
   */
  private async resolveDishesForOrganisation(platsIds: string[], organisationId: string) {
    const plats = await this.dishRepo.find({ where: { id: In(platsIds) } });
    if (plats.length !== platsIds.length) {
      throw new NotFoundException('Un ou plusieurs plats sont introuvables');
    }
    const invalid = plats.find((p) => p.organisation_id && p.organisation_id !== organisationId);
    if (invalid) {
      throw new BadRequestException(
        `Le plat "${invalid.nom}" appartient à une autre organisation et ne peut pas être utilisé dans ce menu`,
      );
    }
    return plats;
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

  async findDailyDishes(date: string, organisationId?: string) {
    const where: any = { date, is_published: true };
    if (organisationId) where.organisation_id = organisationId;

    const menus = await this.menuRepo.find({
      where,
      relations: ['plats'],
    });

    // Flatten all dishes from all menus of that day
    const allDishes = menus.flatMap((m) => m.plats);

    // Remove duplicates by ID
    const uniqueDishes = Array.from(new Map(allDishes.map((d) => [d.id, d])).values());

    return uniqueDishes;
  }

  async findDailyPublic(organisationId: string) {
    const org = await this.orgRepo.findOne({ where: { id: organisationId } });
    if (!org) throw new NotFoundException('Organisation introuvable');

    const date = new Date();
    if (org.order_day_offset) {
      date.setDate(date.getDate() + org.order_day_offset);
    }
    const dateStr = date.toISOString().split('T')[0];

    return this.findDailyDishes(dateStr, organisationId);
  }
}
