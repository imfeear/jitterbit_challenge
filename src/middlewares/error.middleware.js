/*
  Middleware global de erro.
  Todo erro vai passar por aqui.
*/
function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || "Erro interno do servidor"
  });
}

module.exports = errorMiddleware;