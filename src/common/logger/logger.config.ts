import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const getWinstonConfig = (): winston.LoggerOptions => {
  const logTargets = process.env.LOG_TARGETS || 'terminal'; // default to terminal
  const targets = logTargets.split(',').map((t) => t.trim().toLowerCase());

  const transports: winston.transport[] = [];

  // 1. Terminal Transport
  if (targets.includes('terminal') || targets.includes('console') || targets.length === 0) {
    transports.push(
      new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('MMS-API', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        ),
      }),
    );
  }

  // 2. File Transport with rotation
  if (targets.includes('file')) {
    transports.push(
      new DailyRotateFile({
        level: process.env.LOG_LEVEL || 'info',
        dirname: 'logs',
        filename: 'mms-api-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  }

  // 3. Elasticsearch Transport
  if (targets.includes('elasticsearch')) {
    const esNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
    transports.push(
      new ElasticsearchTransport({
        level: process.env.LOG_LEVEL || 'info',
        clientOpts: { node: esNode },
        indexPrefix: 'mms-api-logs',
      })
    );
  }

  return { transports };
};
