import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';

export class TypeOrmWinstonLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('TypeORM');
  private readonly logQueries = process.env.DB_LOG_QUERIES === 'true';

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (this.logQueries) {
      this.logger.debug(`[Query]: ${query} -- [Parameters]: ${JSON.stringify(parameters)}`);
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.error(`[Query Error]: ${error} -- [Query]: ${query} -- [Parameters]: ${JSON.stringify(parameters)}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.warn(`[Slow Query] (${time}ms): ${query} -- [Parameters]: ${JSON.stringify(parameters)}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(`[Schema Build]: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`[Migration]: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'log' || level === 'info') {
      this.logger.log(message);
    } else if (level === 'warn') {
      this.logger.warn(message);
    }
  }
}
