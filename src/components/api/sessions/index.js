const { Router } = require('express');
const passport = require('passport');

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
    router.post(
      '/register',
      passport.authenticate('register', { failureRedirect: '/authfailed' }),
      async (req, res) => {
        return res.redirect('/login');
      },
    ),
    router.get(
      '/login-github',
      passport.authenticate('github', { scope: ['user:email'] }),
      async (req, res) => {},
    ),
    router.get(
      '/githubcallback',
      passport.authenticate('github', { failureRedirect: '/authfailed' }),
      async (req, res) => {
        req.session.user = req.user;
        res.redirect('/products');
      },
    ),
    router.get('/logout', async (req, res) => {
      try {
        if (req.session?.user) {
          req.session.destroy((err) => {
            if (err) return res.status(500).send('logout error');
          });
          return res.redirect('/login');
        }
        return res.redirect('/authfailed');
      } catch (error) {
        console.log(error);
      }
    });
};
