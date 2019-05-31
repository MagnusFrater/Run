'use strict';

require('dotenv').config()
const app = require('express')();
const exphbs  = require('express-handlebars');

const setAppLocals = require('./utils/setAppLocals');
const templateHelpers = require('./utils/templateHelpers');
 
// view/template engine
const hbs = exphbs.create({
  extname: 'hbs',
  helpers: templateHelpers,
});
app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');
setAppLocals(app);

// routes
const routes = require('./routes');
app.use('/', routes);

const port = (process.env.PORT)? process.env.PORT : 3000;
app.listen(port);
console.log('server listening on port ' + port)
