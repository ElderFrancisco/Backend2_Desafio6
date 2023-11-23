const { Router } = require('express');
const userModel = require('../../../dao/models/users.model');
const HashManager = require('../../../util/hash');
const passport = require('passport');

const HashController = new HashManager();

module.exports = (app) => {
  let router = new Router();

  app.use('/api/session', router);

  router.post(
    '/login',
    passport.authenticate('login', { failureRedirect: '/authfailed' }),
    async (req, res) => {
      if (!req.user) {
        return res
          .status(400)
          .send({ status: error, error: 'credenciales invalidas' });
      }
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol,
      };
      return res.redirect('/products');
    },
  ),
    // router.post('/login', async (req, res) => {
    //   try {
    //     const { email, password } = req.body;
    //     if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
    //       const userAdmin = {
    //         first_name: 'Admin',
    //         last_name: 'admin',
    //         email: 'adminCoder@coder.com',
    //         age: 0,
    //         password: 'adminCod3r123',
    //         rol: 'admin',
    //       };
    //       req.session.user = userAdmin;
    //       return res.redirect('/products');
    //     }
    //     const user = await userModel.findOne({ email });

    //     if (!user) return res.redirect('/authfailed');
    //     if (HashController.isValidPassword(user, password) == false)
    //       return res.redirect('/authfailed');
    //     req.session.user = user;
    //     return res.redirect('/products');
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    router.post(
      '/singup',
      passport.authenticate('register', { failureRedirect: '/authfailed' }),
      async (req, res) => {
        return res.redirect('/login');
      },
    ),
    /*async (req, res) => {
    try {
      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        password: HashController.createHash(req.body.password),
      };
      await userModel.create(user);
      return res.redirect('/login');
    } catch (error) {
      console.log(error);
    }
  );*/

    router.get('/logout', async (req, res) => {
      try {
        if (req.session?.user) {
          req.session.destroy((err) => {
            if (err) return res.status(500).send('logout error');
          });
          return res.redirect('/login');
        }
        return res.render('authfailed', {});
      } catch (error) {
        console.log(error);
      }
    });
};
