const { Pool } = require("pg");
require("dotenv").config();

/*
  Cria um pool de conexões com o PostgreSQL.
  O pool é melhor que abrir e fechar conexão manualmente a cada operação.
*/
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

module.exports = pool;