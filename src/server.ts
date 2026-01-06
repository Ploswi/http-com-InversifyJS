import express from 'express';
import { ReportController } from './http/ReportController';

export function createServer() {
  const app = express();
  const controller = new ReportController();
  app.get('/relatorio/:n', (req, res) => controller.handle(req, res));
  return app;
}
