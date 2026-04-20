import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
export declare class TypeOrmWinstonLogger implements TypeOrmLogger {
    private readonly logger;
    private readonly logQueries;
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void;
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): void;
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void;
    logSchemaBuild(message: string, queryRunner?: QueryRunner): void;
    logMigration(message: string, queryRunner?: QueryRunner): void;
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): void;
}
