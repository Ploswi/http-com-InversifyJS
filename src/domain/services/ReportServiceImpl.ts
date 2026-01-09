import { inject, injectable } from 'inversify';
import { faker } from '@faker-js/faker';
import { Logger } from '../interfaces/Logger';
import { Mailer } from '../interfaces/Mailer';
import { ReportService } from '../interfaces/ReportService';
import { InvalidReportSizeError } from '../errors/InvalidReportSizeError';
import { TYPES } from '../../container/types';

@injectable()
export class ReportServiceImpl implements ReportService
{
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Mailer) private mailer: Mailer
  ) {}

  async generateAndSend(email: string, n: number): Promise<void> {
    if (n <= 0 || n > 10) throw new InvalidReportSizeError();

    this.logger.info(`Iniciando geração de relatório (${n})`);

    const data = Array.from({ length: n }).map(() => ({
      nome: faker.person.fullName(),
      cidade: faker.location.city()
    }));

    const body = data.map(d => `Nome: ${d.nome} - Cidade: ${d.cidade}`).join('\n');

    await this.mailer.send(email, 'Relatório Gerado', body);
    this.logger.info('Relatório enviado com sucesso');
  }
}
