/*
  Classe para padronizar erros da aplicação.
  Exemplo:
  throw new AppError("Pedido não encontrado", 404);
*/
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;