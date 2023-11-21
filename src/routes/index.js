const webSocket = require('../components/webSocket');
const api = require('../components/api');
const products = require('../components/products');
const carts = require('../components/carts');
const loginSingup = require('../components/loginSingup');
module.exports = (app) => {
  webSocket(app);
  api(app);
  products(app);
  carts(app);
  loginSingup(app);
};
