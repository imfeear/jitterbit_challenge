const orderService = require("../services/order.service");

/*
  Cria pedido.
*/
async function create(req, res, next) {
  try {
    const result = await orderService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/*
  Busca pedido por ID.
*/
async function findById(req, res, next) {
  try {
    const result = await orderService.findById(req.params.orderId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/*
  Lista pedidos.
*/
async function findAll(req, res, next) {
  try {
    const result = await orderService.findAll();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/*
  Atualiza pedido.
*/
async function update(req, res, next) {
  try {
    const result = await orderService.update(req.params.orderId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/*
  Remove pedido.
*/
async function remove(req, res, next) {
  try {
    await orderService.remove(req.params.orderId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove
};