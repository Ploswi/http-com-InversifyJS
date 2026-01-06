import { Request, Response } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { InvalidReportSizeError } from '../domain/errors/InvalidReportSizeError';

export class ReportController {
  async handle(req: Request, res: Response) {
    const n = Number(req.params.n);
    const email = req.query.email as string;

    if (!email) return res.status(400).json({ error: 'Email obrigatório' });

    try {
      const service = container.get<any>(TYPES.ReportService);
      await service.generateAndSend(email, n);
      return res.json({ message: 'Relatório enviado' });
    } catch (e) {
      if (e instanceof InvalidReportSizeError)
        return res.status(400).json({ error: e.message });
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}
