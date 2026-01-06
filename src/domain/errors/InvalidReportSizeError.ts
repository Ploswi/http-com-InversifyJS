export class InvalidReportSizeError extends Error {
  constructor() {
    super('Número máximo de registros permitido é 10');
  }
}
