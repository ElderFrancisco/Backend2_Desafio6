const ProductManagerDb = require('../../dao/managersDb/ProductManagerDb');
const productController = new ProductManagerDb();
const { Router } = require('express');

module.exports = (app) => {
  let router = new Router();

  app.use('/websocket', router);

  router.get('/', async (req, res) => {
    try {
      const currentPath = req.originalUrl;
      const params = req.query;
      const productsList = await productController.getProducts(
        params,
        currentPath,
      );
      res.render('products', { products: productsList });
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/realtimeproducts', async (req, res) => {
    try {
      res.render('realTimeProducts');
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });

  router.get('/chat', async (req, res) => {
    try {
      res.render('chat');
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
      res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
  });
};
