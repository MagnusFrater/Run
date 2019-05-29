const express = require('express');
const app = express();
 
app.get('/', function (req, res, next) {
  res.send('Hello World');
});
 
app.listen(3000);
console.log('server listening on port ' + '3000')
