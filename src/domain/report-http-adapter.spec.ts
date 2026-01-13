import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { ReportController } from '../http/ReportController';
import { ReportService } from './interfaces/ReportService';
import { InvalidReportSizeError } from './errors/InvalidReportSizeError';
import { container } from '../container/container';
import { TYPES } from '../container/types';

describe('ReportController - Adaptador HTTP', () => {
  let controller: ReportController;
  let mockReportService: ReportService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    // Cria mock do ReportService
    mockReportService = {
      generateAndSend: vi.fn()
    };

    // Substitui o serviço no container
    container.rebind(TYPES.ReportService).toConstantValue(mockReportService);

    // Cria o controller
    controller = new ReportController();

    // Cria mocks do Express Request e Response
    jsonMock = vi.fn();
    statusMock = vi.fn(() => mockResponse);

    mockResponse = {
      status: statusMock,
      json: jsonMock
    } as Partial<Response>;

    mockRequest = {
      params: {},
      query: {}
    };
  });

  describe('Cenário 400 - Bad Request', () => {
    it('deve retornar 400 quando email não é fornecido', async () => {
      mockRequest.params = { n: '5' };
      mockRequest.query = {}; // Sem email

      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email obrigatório' });
      expect(mockReportService.generateAndSend).not.toHaveBeenCalled();
    });

    it('deve retornar 400 quando serviço lança InvalidReportSizeError', async () => {
      mockRequest.params = { n: '15' };
      mockRequest.query = { email: 'test@example.com' };

      vi.mocked(mockReportService.generateAndSend).mockRejectedValue(
        new InvalidReportSizeError()
      );

      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ 
        error: 'Número máximo de registros permitido é 10' 
      });
      expect(mockReportService.generateAndSend).toHaveBeenCalledWith(
        'test@example.com',
        15
      );
    });

  });

  describe('Cenário 500 - Internal Server Error', () => {
    it('deve retornar 500 quando serviço lança erro genérico', async () => {
      mockRequest.params = { n: '5' };
      mockRequest.query = { email: 'admin@example.com' };

      vi.mocked(mockReportService.generateAndSend).mockRejectedValue(
        new Error('Database down')
      );

      await controller.handle(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Erro interno' });
    });

  });

});