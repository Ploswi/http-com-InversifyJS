import { createLogger, format, transports } from 'winston';
import { Logger } from '../../domain/interfaces/Logger';

export class WinstonLogger implements Logger {
  private logger;

  constructor(env: string) {
    this.logger = createLogger({
      format: env === 'dev'
        ? format.combine(format.colorize(), format.simple())
        : format.combine(format.timestamp(), format.json()),
      transports: env === 'dev'
        ? [new transports.Console()]
        : [new transports.File({ filename: 'app.log' })]
    });
  }

  info(msg: string) { this.logger.info(msg); }
  warn(msg: string) { this.logger.warn(msg); }
  error(msg: string) { this.logger.error(msg); }
}
