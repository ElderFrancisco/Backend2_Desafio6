const { Router } = require('express');

module.exports = (app) => {
  let router = new Router();

  app.use('/', router);

  router.get('/', async (req, res) => {
    try {
      const user = req.session.user;
      return res.render('index', { user });
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/singup', async (req, res) => {
    try {
      if (req.session?.user) {
        return res.redirect('/products');
      }
      return res.render('singup', {});
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/login', async (req, res) => {
    try {
      if (req.session?.user) {
        return res.redirect('/products');
      }
      return res.render('login', {});
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/authfailed', async (req, res) => {
    try {
      if (req.session?.user) {
        return res.redirect('/');
      }
      return res.render('authfailed', {});
    } catch (error) {
      console.log(error);
    }
  });
};
