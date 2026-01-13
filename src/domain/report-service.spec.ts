import { describe, it, expect, beforeEach } from 'vitest';
import { ReportServiceImpl } from './services/ReportServiceImpl';
import { Logger } from './interfaces/Logger';
import { Mailer } from './interfaces/Mailer';
import { InvalidReportSizeError } from './errors/InvalidReportSizeError';

// Mock do Logger
class MockLogger implements Logger {
  info(message: string): void {
    // Não faz nada - mock silencioso
  }
  
  warn(message: string): void {
    // Não faz nada - mock silencioso
  }
  
  error(message: string): void {
    // Não faz nada - mock silencioso
  }
}

// Mock do Mailer
class MockMailer implements Mailer {
  // Armazena as chamadas para verificação
  public calls: Array<{ to: string; subject: string; body: string }> = [];
  
  async send(to: string, subject: string, body: string): Promise<void> {
    this.calls.push({ to, subject, body });
  }
}

describe('ReportService', () => {
  let reportService: ReportServiceImpl;
  let mockLogger: MockLogger;
  let mockMailer: MockMailer;

  beforeEach(() => {
    mockLogger = new MockLogger();
    mockMailer = new MockMailer();
    reportService = new ReportServiceImpl(mockLogger, mockMailer);
  });

  describe('Cenários de Erro - Validação de Tamanho', () => {
    it('deve lançar InvalidReportSizeError quando n = -5', async () => {
      await expect(
        reportService.generateAndSend('test@example.com', -5)
      ).rejects.toThrow(InvalidReportSizeError);
    });

    it('deve lançar InvalidReportSizeError quando n = 15', async () => {
      await expect(
        reportService.generateAndSend('test@example.com', 15)
      ).rejects.toThrow(InvalidReportSizeError);
    });

    it('deve lançar InvalidReportSizeError quando n = 0', async () => {
      await expect(
        reportService.generateAndSend('test@example.com', 0)
      ).rejects.toThrow(InvalidReportSizeError);
    });

    it('deve lançar InvalidReportSizeError quando n = 11', async () => {
      await expect(
        reportService.generateAndSend('test@example.com', 11)
      ).rejects.toThrow(InvalidReportSizeError);
    });

  });

  describe('Cenários de Sucesso', () => {
    it('deve gerar e enviar relatório com n = 1', async () => {
      const email = 'user@example.com';
      
      await reportService.generateAndSend(email, 1);
      
      expect(mockMailer.calls.length).toBe(1);
      expect(mockMailer.calls[0].to).toBe(email);
      expect(mockMailer.calls[0].subject).toBe('Relatório Gerado');
      expect(mockMailer.calls[0].body).toContain('Nome:');
      expect(mockMailer.calls[0].body).toContain('Cidade:');
    });

    it('deve gerar e enviar relatório com n = 5', async () => {
      const email = 'admin@example.com';
      
      await reportService.generateAndSend(email, 5);
      
      expect(mockMailer.calls.length).toBe(1);
      expect(mockMailer.calls[0].to).toBe(email);
      expect(mockMailer.calls[0].subject).toBe('Relatório Gerado');
      
      // Verifica se o corpo contém 5 linhas (5 registros)
      const lines = mockMailer.calls[0].body.split('\n');
      expect(lines.length).toBe(5);
      
      // Verifica formato de cada linha
      lines.forEach(line => {
        expect(line).toMatch(/Nome: .+ - Cidade: .+/);
      });
    });

    it('deve gerar e enviar relatório com n = 10 (limite máximo)', async () => {
      const email = 'test@example.com';
      
      await reportService.generateAndSend(email, 10);
      
      expect(mockMailer.calls.length).toBe(1);
      expect(mockMailer.calls[0].to).toBe(email);
      
      const lines = mockMailer.calls[0].body.split('\n');
      expect(lines.length).toBe(10);
    });

    it('deve chamar mailer.send com os parâmetros corretos', async () => {
      const email = 'specific@test.com';
      
      await reportService.generateAndSend(email, 3);
      
      expect(mockMailer.calls.length).toBe(1);
      
      const call = mockMailer.calls[0];
      expect(call.to).toBe(email);
      expect(call.subject).toBe('Relatório Gerado');
      expect(call.body).toBeTruthy();
      expect(typeof call.body).toBe('string');
    });

    it('deve gerar dados diferentes em cada chamada', async () => {
      await reportService.generateAndSend('test1@example.com', 2);
      await reportService.generateAndSend('test2@example.com', 2);
      
      expect(mockMailer.calls.length).toBe(2);
      
      const body1 = mockMailer.calls[0].body;
      const body2 = mockMailer.calls[1].body;
      
      // Os corpos devem ser diferentes (faker gera dados aleatórios)
      expect(body1).not.toBe(body2);
    });
  });

  describe('Integração Logger e Mailer', () => {
    it('não deve falhar mesmo com logger não funcional', async () => {
      // Testa que o serviço funciona mesmo se o logger não fizer nada
      await expect(
        reportService.generateAndSend('test@example.com', 5)
      ).resolves.not.toThrow();
      
      expect(mockMailer.calls.length).toBe(1);
    });
  });
});