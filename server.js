const express = require('express');
const routes = require('./controllers');
// import sequelize connection
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
// library allows us to connect to the back end
const session = require('express-session');
// library automatically stores the sessions
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//
app.use(express.json());
//
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

app.use(session(sess));

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
