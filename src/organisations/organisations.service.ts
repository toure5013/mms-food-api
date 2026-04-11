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

  create(dto: CreateOrganisationDto) {
    const org = this.organisationRepo.create(dto);
    return this.organisationRepo.save(org);
  }
}
