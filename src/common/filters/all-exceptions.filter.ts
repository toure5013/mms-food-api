import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message || 'Internal server error' };

    // Construction du log d'erreur détaillé
    const userRole = (request as any).user?.role || 'Guest';
    const userId = (request as any).user?.id || 'anonymous';
    
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      user: `${userRole}:${userId}`,
      message: message,
      stack: exception instanceof Error ? exception.stack : null,
    };

    // Logger l'erreur
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} [${status}] - Error: ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} [${status}] - Warning: ${JSON.stringify(message)}`,
      );
    }

    // Réponse au client (on cache la stack en prod mais on garde le message)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof message === 'object' ? message : { message }),
    });
  }
}
