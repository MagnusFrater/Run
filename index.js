'use strict';

const app = require('express')();
var exphbs  = require('express-handlebars');

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
 
app.listen(3000);
console.log('server listening on port ' + '3000')
