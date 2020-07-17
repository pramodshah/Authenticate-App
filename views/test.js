var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var cookieparser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
require('dotenv/config');

var app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(cookieparser());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(function(req, res, next) {
   req.session.cookie.maxAge = 180 * 60 * 1000; // 3 hours
    next();
});
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use((req, res, next)=> {
    res.locals.login = req.isAuthenticated();
    next();
});
app.use((req, res, next)=> {
    res.locals.session = req.session;
    next();
});



// Database connection method 1 on mongoDB Atlas

const uri = "mongodb+srv://pramodshah:Prime123$5@bookstore-k6wkq.mongodb.net/test?retryWrites=true&w=majority";
var db = mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(!err){
        console.log("MongoDB Connected...");
    }else{
        console.log(err);
    }
});


// Database connection method 2 on mongoDB Atlas

// var  uri = require('./config/keys').MongoURI;

// mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true
//  }).then((err)=>{
//     if(!err){
//         console.log("MongoDB Connected...");
//     }else{
//         console.log(err);
//     }
// });

//  Database connection method 3 on mongoDB Atlas

// var  uri = require('./config/keys').MongoURI;
// mongoose.connect(uri, { useNewUrlParser: true,useUnifiedTopology:true});
// const db = mongoose.connection;

// db.once('open', () => console.log('Successfully connected to MongoDB'));
// db.on('error', (e) => console.log(e));


// Database connection method 4 on local computer

// var uri = 'mongodb://localhost:27017/bookstore';
// var db = mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
//     if(!err){
//         console.log("Successfully connected to MongoDB.");
//     }else{
//         console.log(err);
//     }
// });





// view engine
app.use(expressLayouts);
app.set("view engine","ejs");

// app.set('view options', { layout: 'dashboardLayout' });


// static file
app.use(express.static('public'));
app.use(express.static('views')); 






app.set('views',path.join(__dirname,'views'));
 
// routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
app.use('/',require('./routes/admin'));
app.use('/',require('./routes/about'));
app.use('/',require('./routes/contact'));
app.use('/',require('./routes/features'));
app.use('/',require('./routes/bookshelf'));
app.use('/',require('./routes/gallery'));
app.use('/',require('./routes/viewCategory'));






// server port
const PORT = process.env.PORT || 3000;
app.listen(PORT,function(req,res){
    console.log("Server running on port: 3000");
});

// module.exports = db;