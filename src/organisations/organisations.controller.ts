import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganisationsService } from './organisations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateOrganisationDto } from './dto/organisations.dto';

@ApiTags('Organisations')
@ApiBearerAuth()
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste toutes les organisations (Super Admin uniquement)' })
  findAll() {
    return this.organisationsService.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une nouvelle organisation' })
  create(@Body() dto: CreateOrganisationDto) {
    return this.organisationsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une organisation' })
  findOne(@Param('id') id: string) {
    return this.organisationsService.findOne(id);
  }
}
