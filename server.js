const express = require('express');
const routes = require('./controllers');
// import sequelize connection
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
// library allows us to connect to the back end
const session = require('express-session');
// library automatically stores the sessions
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// implement helpers
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
// this should come before turning on routes to properly use loggedIn functionality
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
