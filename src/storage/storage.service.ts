import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'node:path';

@Injectable()
export class StorageService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('MINIO_PORT', 9000);
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME', 'mms-cantine');

    this.minioClient = new Minio.Client({
      endPoint,
      port: Number(port),
      useSSL: false, // À passer à true en production si configuré
      accessKey,
      secretKey,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    try {
      const extension = path.extname(file.originalname);
      const filename = `${folder}/${uuidv4()}${extension}`;
      
      const metaData = {
        'Content-Type': file.mimetype,
      };

      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        metaData,
      );

      // Génération de l'URL publique
      const endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
      const port = this.configService.get<number>('MINIO_PORT', 9000);
      const isDev = this.configService.get<string>('NODE_ENV') !== 'production';

      // En mode dev (docker-compose local), the endpoint for external access is often localhost
      const host = isDev && endPoint === 'minio' ? 'localhost' : endPoint;
      const url = `http://${host}:${port}/${this.bucketName}/${filename}`;

      return url;
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload du fichier : ${error.message}`, error.stack);
      throw new InternalServerErrorException("Impossible d'uploader le fichier");
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl) return;
      const urlParts = new URL(fileUrl);
      // Extraire le chemin après le bucket
      const prefix = `/${this.bucketName}/`;
      const filename = urlParts.pathname.startsWith(prefix) 
        ? urlParts.pathname.substring(prefix.length)
        : urlParts.pathname.substring(1);

      await this.minioClient.removeObject(this.bucketName, filename);
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression du fichier : ${error.message}`, error.stack);
      // On ne jette pas d'erreur pour ne pas bloquer les processus de suppression en cascade
    }
  }
}
