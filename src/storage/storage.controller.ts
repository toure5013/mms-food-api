import {
  Controller, Post, UseInterceptors, UploadedFile,
  BadRequestException, Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Storage')
@ApiBearerAuth('JWT-auth')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Uploader un fichier', description: 'Enregistre une image ou un document sur le stockage MinIO (S3).' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Le fichier à uploader (JPG, PNG, WEBP — Max 5 Mo)',
        },
        folder: {
          type: 'string',
          example: 'dishes',
          description: 'dossier de destination (ex: dishes, avatars, logos)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fichier uploadé avec succès — Retourne l\'URL publique.' })
  @ApiResponse({ status: 400, description: 'Fichier manquant, trop gros ou format invalide.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Format de fichier non supporté. Utilisez JPG, PNG ou WEBP.');
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      throw new BadRequestException('Le fichier est trop volumineux (max 5 MB).');
    }

    const url = await this.storageService.uploadFile(file, folder || 'uploads');
    
    return {
      message: 'Fichier uploadé avec succès',
      url,
    };
  }
}
