// Set up external libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';

// Connecting to database
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-14087.c100.us-east-1-4.ec2.cloud.redislabs.com',
  port: '14087'
};

let redisPASS = 'rbnFxpxP4VKG4S83gKdkBScMj9k3eNz0';

if(process.env.REDISCOULD_URL)
{
  redisURL = url.parse(process.env.REDISCOULD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

const router = require('./router.js');

const app = express();

// Set up use components
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  key: 'sessionid', 
  secret: 'Domo Arigato', 
  resave: true, 
  saveUninitialized: true,
  store: new RedisStore({
    host: redisURL.hostname, 
    port: redisURL.port, 
    pass: redisPASS},),
  cookie: {httpOnly:true,}
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

app.use(cookieParser());


app.use(csrf());
app.use((err, req, res, next) =>{
  if(err.code !=='EBADCSRFTOKEN') 
    return next(err);

  console.log("Missing CSRF token");
  return false;
});
router(app);

// Begin listening
app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Listening on port ${port}`);
});
