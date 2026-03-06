const pool = require("../config/db");
const repository = require("../repositories/order.repository");
const AppError = require("../utils/appError");
const { mapRequestToOrder, mapOrderToResponse } = require("../utils/mapper");
const { normalizeOrderId } = require("../utils/orderId");

/*
  Valida o body recebido.
*/
function validatePayload(payload) {
  if (!payload) {
    throw new AppError("Body da requisição é obrigatório", 400);
  }

  if (!payload.numeroPedido) {
    throw new AppError("numeroPedido é obrigatório", 400);
  }

  if (payload.valorTotal === undefined || payload.valorTotal === null) {
    throw new AppError("valorTotal é obrigatório", 400);
  }

  if (!payload.dataCriacao) {
    throw new AppError("dataCriacao é obrigatória", 400);
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new AppError("items deve ser um array com pelo menos 1 item", 400);
  }

  for (const item of payload.items) {
    if (!item.idItem) {
      throw new AppError("idItem é obrigatório em todos os items", 400);
    }

    if (item.quantidadeItem === undefined || item.quantidadeItem === null) {
      throw new AppError("quantidadeItem é obrigatório em todos os items", 400);
    }

    if (item.valorItem === undefined || item.valorItem === null) {
      throw new AppError("valorItem é obrigatório em todos os items", 400);
    }
  }
}

/*
  Cria um pedido e seus itens usando transação.
*/
async function create(payload) {
  validatePayload(payload);

  const mappedOrder = mapRequestToOrder(payload);

  if (Number.isNaN(mappedOrder.value)) {
    throw new AppError("valorTotal inválido", 400);
  }

  if (Number.isNaN(mappedOrder.creationDate.getTime())) {
    throw new AppError("dataCriacao inválida", 400);
  }

  if (await repository.orderExists(mappedOrder.orderId)) {
    throw new AppError("Pedido já existe", 409);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await repository.createOrder(client, mappedOrder);
    await repository.createItems(client, mappedOrder.orderId, mappedOrder.items);

    await client.query("COMMIT");

    const createdOrder = await repository.findOrderById(mappedOrder.orderId);
    return mapOrderToResponse(createdOrder);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/*
  Busca um pedido por ID.
*/
async function findById(orderIdParam) {
  const orderId = normalizeOrderId(orderIdParam);
  const order = await repository.findOrderById(orderId);

  if (!order) {
    throw new AppError("Pedido não encontrado", 404);
  }

  return mapOrderToResponse(order);
}

/*
  Lista todos os pedidos.
*/
async function findAll() {
  const orders = await repository.findAllOrders();
  return orders.map(mapOrderToResponse);
}

/*
  Atualiza um pedido existente.
*/
async function update(orderIdParam, payload) {
  validatePayload(payload);

  const orderId = normalizeOrderId(orderIdParam);
  const mappedOrder = mapRequestToOrder(payload);

  // força o ID da URL a ser o ID realmente atualizado
  mappedOrder.orderId = orderId;

  if (!(await repository.orderExists(orderId))) {
    throw new AppError("Pedido não encontrado", 404);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await repository.updateOrder(client, mappedOrder);
    await repository.deleteItemsByOrderId(client, orderId);
    await repository.createItems(client, orderId, mappedOrder.items);

    await client.query("COMMIT");

    const updatedOrder = await repository.findOrderById(orderId);
    return mapOrderToResponse(updatedOrder);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/*
  Remove um pedido pelo ID.
*/
async function remove(orderIdParam) {
  const orderId = normalizeOrderId(orderIdParam);
  const deleted = await repository.deleteOrderById(orderId);

  if (!deleted) {
    throw new AppError("Pedido não encontrado", 404);
  }
}

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove
};