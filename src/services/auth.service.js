const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

/*
  Simples autenticação fixa para atender ao requisito opcional de JWT.
  Em projeto real, isso viria de banco de dados.
*/
function login(username, password) {
  const validUsername = "admin";
  const validPassword = "123456";

  if (username !== validUsername || password !== validPassword) {
    throw new AppError("Credenciais inválidas", 401);
  }

  return jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

module.exports = {
  login
};