import { Repository } from 'typeorm';
import { Organisation } from './organisation.entity';
import { CreateOrganisationDto } from './dto/organisations.dto';
export declare class OrganisationsService {
    private readonly organisationRepo;
    constructor(organisationRepo: Repository<Organisation>);
    findAll(): Promise<Organisation[]>;
    findOne(id: string): Promise<Organisation>;
    create(dto: CreateOrganisationDto): Promise<Organisation>;
    update(id: string, dto: any): Promise<Organisation>;
    remove(id: string): Promise<Organisation>;
}
