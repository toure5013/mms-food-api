import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/organisations.dto';
export declare class OrganisationsController {
    private readonly organisationsService;
    constructor(organisationsService: OrganisationsService);
    findAll(): Promise<import("./organisation.entity").Organisation[]>;
    create(dto: CreateOrganisationDto): Promise<import("./organisation.entity").Organisation>;
    findOne(id: string): Promise<import("./organisation.entity").Organisation>;
}
