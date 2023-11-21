const ProductManagerDb = require('../../dao/managersDb/ProductManagerDb');
const { Router } = require('express');
const bodyParser = require('body-parser');

const productController = new ProductManagerDb();

module.exports = (app) => {
  let router = new Router();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/products', router);

  router.get('/', auth, async (req, res) => {
    try {
      const user = req.session.user;
      const currentPath = req.originalUrl;
      const params = req.query;
      const productsList = await productController.getProducts(
        params,
        currentPath,
      );
      res
        .status(200)
        .render('products', { products: productsList, user: user });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  router.get('/:pid', auth, async (req, res) => {
    try {
      const paramsID = req.params.pid;
      const productId = await productController.getProductById(paramsID);
      if (!productId) {
        return res
          .status(400)
          .send('no se econtro el producto con el ' + paramsID);
      }

      return res.status(200).render('productView', { product: productId });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
};
function auth(req, res, next) {
  if (req.session?.user) return next();
  res.redirect('/login');
}
