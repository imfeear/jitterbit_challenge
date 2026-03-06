const express = require("express");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const setupSwagger = require("./config/swagger");

const app = express();

/*
  Permite receber JSON no body.
*/
app.use(express.json());

/*
  Swagger
*/
setupSwagger(app);

/*
  Rotas
*/
app.use("/auth", authRoutes);
app.use("/", orderRoutes);

/*
  Middlewares finais
*/
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;