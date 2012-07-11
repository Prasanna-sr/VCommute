var express = require('express');

var app = express.createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});
 app.use(express.static('/Users/prasannasr/Documents/node.js/VCommute/V3/client'));
app.listen(3002);