const swaggerUi = require("swagger-ui-express");
const openapi = require("../docs/openapi");

/*
  Publica a documentação Swagger em /api-docs
*/
function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));
}

module.exports = setupSwagger;