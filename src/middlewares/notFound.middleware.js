/*
  Middleware para rotas inexistentes.
*/
function notFoundMiddleware(req, res) {
  return res.status(404).json({
    message: "Rota não encontrada"
  });
}

module.exports = notFoundMiddleware;