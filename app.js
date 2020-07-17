var express = require('express');
var app = express();

var bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));






app.use('/',require('./routes/index'));
var bodyparser = require('body-parser');


app.use('/',require('./routes/index'));
app.set('view engine','ejs');



app.listen(3000,function(){
    console.log("Server running on port :3000")
});

module.exports = app;