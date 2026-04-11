import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private readonly configService;
    private readonly minioClient;
    private readonly bucketName;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
}
