const webSocket = require('../components/webSocket');
const api = require('../components/api');
const products = require('../components/products');
const carts = require('../components/carts');
const loginRegister = require('../components/loginRegister');
module.exports = (app) => {
  webSocket(app);
  api(app);
  products(app);
  carts(app);
  loginRegister(app);
};
