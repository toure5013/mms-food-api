"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmWinstonLogger = void 0;
const common_1 = require("@nestjs/common");
class TypeOrmWinstonLogger {
    logger = new common_1.Logger('TypeORM');
    logQueries = process.env.DB_LOG_QUERIES === 'true';
    logQuery(query, parameters, queryRunner) {
        if (this.logQueries) {
            this.logger.debug(`[Query]: ${query} -- [Parameters]: ${JSON.stringify(parameters)}`);
        }
    }
    logQueryError(error, query, parameters, queryRunner) {
        this.logger.error(`[Query Error]: ${error} -- [Query]: ${query} -- [Parameters]: ${JSON.stringify(parameters)}`);
    }
    logQuerySlow(time, query, parameters, queryRunner) {
        this.logger.warn(`[Slow Query] (${time}ms): ${query} -- [Parameters]: ${JSON.stringify(parameters)}`);
    }
    logSchemaBuild(message, queryRunner) {
        this.logger.debug(`[Schema Build]: ${message}`);
    }
    logMigration(message, queryRunner) {
        this.logger.log(`[Migration]: ${message}`);
    }
    log(level, message, queryRunner) {
        if (level === 'log' || level === 'info') {
            this.logger.log(message);
        }
        else if (level === 'warn') {
            this.logger.warn(message);
        }
    }
}
exports.TypeOrmWinstonLogger = TypeOrmWinstonLogger;
//# sourceMappingURL=typeorm-logger.js.map