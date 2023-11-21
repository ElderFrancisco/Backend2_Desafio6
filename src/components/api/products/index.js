const ProductManagerDb = require('../../../dao/managersDb/ProductManagerDb');
const { Router } = require('express');
const bodyParser = require('body-parser');

const productController = new ProductManagerDb();

module.exports = (app) => {
  let router = new Router();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/products', router);

  router.get('/', async (req, res) => {
    try {
      const currentPath = req.originalUrl;
      const params = req.query;
      const productsList = await productController.getProducts(
        params,
        currentPath,
      );
      res.status(200).send(productsList);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const body = req.body;
      const newProduct = await productController.addProduct(body);
      res.status(200).send(newProduct);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.get('/:pid', async (req, res) => {
    try {
      const paramsID = req.params.pid;
      const productId = await productController.getProductById(paramsID);
      if (productId == null) {
        return res
          .status(400)
          .send('no se econtro el producto con el ' + paramsID);
      }

      return res.status(200).send(productId);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.put('/:pid', async (req, res) => {
    try {
      const paramsID = req.params.pid;
      const body = req.body;
      const productUpdate = await productController.updateProduct(
        paramsID,
        body,
      );
      return res.status(200).json(productUpdate);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.delete('/:pid', async (req, res) => {
    try {
      const paramsID = req.params.pid;
      const productDeleted = await productController.deleteProduct(paramsID);
      return res.status(200).json(productDeleted);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
};
