const pool = require("../config/db");

/*
  Insere o pedido na tabela orders.
*/
async function createOrder(client, order) {
  const query = `
    INSERT INTO orders (order_id, value, creation_date)
    VALUES ($1, $2, $3)
    RETURNING order_id, value, creation_date
  `;

  const values = [order.orderId, order.value, order.creationDate];
  const result = await client.query(query, values);
  return result.rows[0];
}

/*
  Insere os itens na tabela items.
*/
async function createItems(client, orderId, items) {
  const query = `
    INSERT INTO items (order_id, product_id, quantity, price)
    VALUES ($1, $2, $3, $4)
  `;

  for (const item of items) {
    await client.query(query, [
      orderId,
      item.productId,
      item.quantity,
      item.price
    ]);
  }
}

/*
  Busca um pedido pelo ID e também seus itens.
*/
async function findOrderById(orderId) {
  const orderQuery = `
    SELECT order_id, value, creation_date
    FROM orders
    WHERE order_id = $1
  `;

  const itemsQuery = `
    SELECT product_id, quantity, price
    FROM items
    WHERE order_id = $1
    ORDER BY id
  `;

  const orderResult = await pool.query(orderQuery, [orderId]);

  if (orderResult.rowCount === 0) {
    return null;
  }

  const itemsResult = await pool.query(itemsQuery, [orderId]);

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows
  };
}

/*
  Lista todos os pedidos com seus itens.
*/
async function findAllOrders() {
  const query = `
    SELECT order_id, value, creation_date
    FROM orders
    ORDER BY creation_date DESC
  `;

  const result = await pool.query(query);
  const orders = [];

  for (const order of result.rows) {
    const itemsResult = await pool.query(
      `
      SELECT product_id, quantity, price
      FROM items
      WHERE order_id = $1
      ORDER BY id
      `,
      [order.order_id]
    );

    orders.push({
      ...order,
      items: itemsResult.rows
    });
  }

  return orders;
}

/*
  Atualiza os dados principais do pedido.
*/
async function updateOrder(client, order) {
  const query = `
    UPDATE orders
    SET value = $2,
        creation_date = $3
    WHERE order_id = $1
    RETURNING order_id, value, creation_date
  `;

  const values = [order.orderId, order.value, order.creationDate];
  const result = await client.query(query, values);
  return result.rows[0];
}

/*
  Remove todos os itens de um pedido.
*/
async function deleteItemsByOrderId(client, orderId) {
  await client.query(`DELETE FROM items WHERE order_id = $1`, [orderId]);
}

/*
  Remove o pedido.
*/
async function deleteOrderById(orderId) {
  const result = await pool.query(
    `DELETE FROM orders WHERE order_id = $1 RETURNING order_id`,
    [orderId]
  );

  return result.rowCount > 0;
}

/*
  Verifica se o pedido já existe.
*/
async function orderExists(orderId) {
  const result = await pool.query(
    `SELECT 1 FROM orders WHERE order_id = $1`,
    [orderId]
  );

  return result.rowCount > 0;
}

module.exports = {
  createOrder,
  createItems,
  findOrderById,
  findAllOrders,
  updateOrder,
  deleteItemsByOrderId,
  deleteOrderById,
  orderExists
};