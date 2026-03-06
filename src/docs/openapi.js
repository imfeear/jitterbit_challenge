module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Order API",
    version: "1.0.0",
    description: "API de pedidos com Node.js, PostgreSQL, JWT e Swagger"
  },
  servers: [
    {
      url: "http://localhost:3000"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      LoginRequest: {
        type: "object",
        properties: {
          username: { type: "string", example: "admin" },
          password: { type: "string", example: "123456" }
        },
        required: ["username", "password"]
      },
      CreateOrderRequest: {
        type: "object",
        properties: {
          numeroPedido: { type: "string", example: "v10089015vdb-01" },
          valorTotal: { type: "number", example: 10000 },
          dataCriacao: { type: "string", example: "2023-07-19T12:24:11.5299601+00:00" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                idItem: { type: "string", example: "2434" },
                quantidadeItem: { type: "number", example: 1 },
                valorItem: { type: "number", example: 1000 }
              },
              required: ["idItem", "quantidadeItem", "valorItem"]
            }
          }
        },
        required: ["numeroPedido", "valorTotal", "dataCriacao", "items"]
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Realiza login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest"
              }
            }
          }
        },
        responses: {
          "200": { description: "Login realizado com sucesso" },
          "401": { description: "Credenciais inválidas" }
        }
      }
    },
    "/order": {
      post: {
        tags: ["Order"],
        summary: "Cria um pedido",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrderRequest"
              }
            }
          }
        },
        responses: {
          "201": { description: "Pedido criado com sucesso" }
        }
      }
    },
    "/order/list": {
      get: {
        tags: ["Order"],
        summary: "Lista todos os pedidos",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Lista de pedidos" }
        }
      }
    },
    "/order/{orderId}": {
      get: {
        tags: ["Order"],
        summary: "Busca pedido por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Pedido encontrado" },
          "404": { description: "Pedido não encontrado" }
        }
      },
      put: {
        tags: ["Order"],
        summary: "Atualiza pedido por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateOrderRequest"
              }
            }
          }
        },
        responses: {
          "200": { description: "Pedido atualizado com sucesso" }
        }
      },
      delete: {
        tags: ["Order"],
        summary: "Remove pedido por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "204": { description: "Pedido removido com sucesso" }
        }
      }
    }
  }
};