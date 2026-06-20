import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto, UpdateOrganisationDto, UpdateGuestModeDto } from './dto/organisations.dto';
export declare class OrganisationsController {
    private readonly organisationsService;
    constructor(organisationsService: OrganisationsService);
    findPublic(slug: string): Promise<import("./organisation.entity").Organisation>;
    findAll(): Promise<import("./organisation.entity").Organisation[]>;
    create(dto: CreateOrganisationDto): Promise<import("./organisation.entity").Organisation>;
    findMine(req: any): Promise<import("./organisation.entity").Organisation>;
    findOne(id: string, req: any): Promise<import("./organisation.entity").Organisation>;
    updateGuestMode(dto: UpdateGuestModeDto, req: any): Promise<import("./organisation.entity").Organisation>;
    update(id: string, dto: UpdateOrganisationDto, req: any): Promise<import("./organisation.entity").Organisation>;
    remove(id: string): Promise<import("./organisation.entity").Organisation>;
}
