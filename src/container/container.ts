import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { WinstonLogger } from '../infra/logger/WinstonLogger';
import { NodemailerMailer } from '../infra/mailer/NodemailerMailer';
import { ReportServiceImpl } from '../domain/services/ReportServiceImpl';

const container = new Container();
const env = process.env.APP_ENV || 'dev';

container.bind(TYPES.Logger)
  .toConstantValue(new WinstonLogger(env));

container.bind(TYPES.Mailer)
  .to(NodemailerMailer)
  .inSingletonScope();

container.bind(TYPES.ReportService)
  .to(ReportServiceImpl);

export { container };