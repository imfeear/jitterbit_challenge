/*
  Remove o sufixo final do pedido.
  Exemplo:
  v10089015vdb-01 -> v10089015vdb
*/
function normalizeOrderId(rawOrderId) {
  if (!rawOrderId || typeof rawOrderId !== "string") {
    return rawOrderId;
  }

  return rawOrderId.replace(/-\d+$/, "");
}

module.exports = {
  normalizeOrderId
};