const CartManagerDb = require('../../dao/managersDb/CartManagerDb');
const { Router } = require('express');
const bodyParser = require('body-parser');

const cartController = new CartManagerDb();

module.exports = (app) => {
  let router = new Router();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/cart', router);

  router.get('/:cid', async (req, res) => {
    try {
      const params = req.params;
      const cartId = await cartController.getCartById(params);
      res.status(200).render('cartView', { cart: cartId });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
