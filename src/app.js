const express = require('express');
const http = require('http');
const routes = require('./routes');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const utilSocket = require('./util/socket');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initializePassport = require('./config/passport.config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.mongoUrl = process.env.MONGO_URL;
    this.mongoName = process.env.MONGO_NAME;
    this.settings();
    this.routes();
    this.server = http.createServer(this.app);
    this.utilSocket();
    this.connect();
    this.runPassport();
  }

  settings() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.engine('handlebars', exphbs.engine());
    this.app.set('view engine', 'handlebars');
    this.app.set('views', __dirname + '/views');
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: this.mongoUrl,
          dbName: this.mongoName,
          ttl: 1100, //tiempo de vida de la sesion
        }),
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
      }),
    );
  }

  connect() {
    mongoose
      .connect(this.mongoUrl, { dbName: this.mongoName })
      .then(() => {
        console.log('db connected');
      })
      .catch((e) => {
        console.log('error' + e);
      });
  }
  runPassport() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  routes() {
    routes(this.app);
  }

  utilSocket() {
    utilSocket(this.server);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`http://localhost:${this.port}`);
    });
  }
}

module.exports = new Server();
