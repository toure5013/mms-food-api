import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from './organisation.entity';
import { CreateOrganisationDto } from './dto/organisations.dto';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private readonly organisationRepo: Repository<Organisation>,
  ) {}

  findAll() {
    return this.organisationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const org = await this.organisationRepo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organisation introuvable');
    return org;
  }

  async findBySlugPublic(slug: string) {
    const org = await this.organisationRepo.findOne({
      where: { slug, is_active: true },
      select: ['id', 'nom', 'slug', 'logo_url', 'couleur_primaire', 'couleur_secondaire', 'guest_config', 'is_guest_order_enabled', 'guest_order_start_time', 'guest_order_end_time']
    });
    if (!org) throw new NotFoundException('Organisation introuvable');
    return org;
  }

  create(dto: CreateOrganisationDto) {
    const org = this.organisationRepo.create(dto);
    return this.organisationRepo.save(org);
  }

  async update(id: string, dto: any) {
    const org = await this.findOne(id);
    Object.assign(org, dto);
    return this.organisationRepo.save(org);
  }

  async remove(id: string) {
    const org = await this.findOne(id);
    return this.organisationRepo.remove(org);
  }
}
