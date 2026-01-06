export interface ReportService {
  generateAndSend(email: string, n: number): Promise<void>;
}
