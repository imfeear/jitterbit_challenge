const { normalizeOrderId } = require("./orderId");

/*
  Converte o payload recebido no body para o formato interno da aplicação.
*/
function mapRequestToOrder(payload) {
  return {
    orderId: normalizeOrderId(payload.numeroPedido),
    value: Number(payload.valorTotal),
    creationDate: new Date(payload.dataCriacao),
    items: Array.isArray(payload.items)
      ? payload.items.map((item) => ({
          productId: Number(item.idItem),
          quantity: Number(item.quantidadeItem),
          price: Number(item.valorItem)
        }))
      : []
  };
}

/*
  Converte o resultado do banco para o JSON de resposta da API.
*/
function mapOrderToResponse(order) {
  return {
    orderId: order.order_id,
    value: Number(order.value),
    creationDate: order.creation_date,
    items: order.items.map((item) => ({
      productId: Number(item.product_id),
      quantity: Number(item.quantity),
      price: Number(item.price)
    }))
  };
}

module.exports = {
  mapRequestToOrder,
  mapOrderToResponse
};