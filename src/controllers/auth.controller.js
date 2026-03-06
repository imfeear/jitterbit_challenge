const authService = require("../services/auth.service");

/*
  Controller do login.
*/
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const token = authService.login(username, password);

    return res.status(200).json({
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login
};