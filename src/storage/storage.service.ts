import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'node:path';

@Injectable()
export class StorageService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  // Base URL utilisée pour construire les liens publics — dérivée de la
  // même config que le client (host/port/protocole réellement utilisés),
  // pour ne jamais renvoyer une URL qui ne correspond pas à l'endpoint
  // effectivement configuré (ex: S3 managé en HTTPS sans port explicite).
  private readonly publicBaseUrl: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    // Le déploiement en production fournit S3_ENDPOINT/S3_BUCKET/S3_ACCESS_KEY/
    // S3_SECRET_KEY (S3/MinIO managé, endpoint = URL complète avec protocole).
    // MINIO_* reste supporté pour le docker-compose local (host + port séparés).
    const rawEndpoint =
      this.configService.get<string>('S3_ENDPOINT') ??
      this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const hasProtocol = /^https?:\/\//.test(rawEndpoint);
    const parsed = hasProtocol ? new URL(rawEndpoint) : null;

    const endPoint = parsed ? parsed.hostname : rawEndpoint;
    const useSSL = parsed
      ? parsed.protocol === 'https:'
      : this.configService.get<string>('NODE_ENV') === 'production';
    const defaultPort = useSSL ? 443 : 80;
    const port = parsed
      ? Number(parsed.port || defaultPort)
      : this.configService.get<number>('MINIO_PORT', 9000);

    const accessKey =
      this.configService.get<string>('S3_ACCESS_KEY') ??
      this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey =
      this.configService.get<string>('S3_SECRET_KEY') ??
      this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');
    const region = this.configService.get<string>('S3_REGION');
    this.bucketName =
      this.configService.get<string>('S3_BUCKET') ??
      this.configService.get<string>('MINIO_BUCKET_NAME', 'mms-cantine');

    this.minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
      ...(region ? { region } : {}),
    });

    const portSuffix = port === defaultPort ? '' : `:${port}`;
    this.publicBaseUrl = `${useSSL ? 'https' : 'http'}://${endPoint}${portSuffix}`;
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

      return `${this.publicBaseUrl}/${this.bucketName}/${filename}`;
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
