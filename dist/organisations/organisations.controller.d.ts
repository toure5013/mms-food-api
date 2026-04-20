import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto, UpdateOrganisationDto } from './dto/organisations.dto';
export declare class OrganisationsController {
    private readonly organisationsService;
    constructor(organisationsService: OrganisationsService);
    findAll(): Promise<import("./organisation.entity").Organisation[]>;
    create(dto: CreateOrganisationDto): Promise<import("./organisation.entity").Organisation>;
    findOne(id: string, req: any): Promise<import("./organisation.entity").Organisation>;
    update(id: string, dto: UpdateOrganisationDto): Promise<import("./organisation.entity").Organisation>;
    remove(id: string): Promise<import("./organisation.entity").Organisation>;
}
