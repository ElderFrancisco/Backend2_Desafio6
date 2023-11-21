const productsApi = require('./products');
const cartsApi = require('./cart');
const sessions = require('./sessions');

module.exports = (app) => {
  productsApi(app);
  cartsApi(app);
  sessions(app);
};
