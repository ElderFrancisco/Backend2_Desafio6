const passport = require('passport');
const local = require('passport-local');
const userModel = require('../dao/models/users.model');
const HashManager = require('../util/hash');

const HashController = new HashManager();

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },

      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            console.log('user already existst');
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: HashController.createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.log(error);
        }
      },
    ),
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
      },

      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log('user doesnt exist');
            return done(null, false);
          }
          if (HashController.isValidPassword(user, password) == false)
            return done(null, false);

          return done(null, user);
        } catch (err) {
          console.log(err);
          return done(null, false);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

module.exports = initializePassport();
