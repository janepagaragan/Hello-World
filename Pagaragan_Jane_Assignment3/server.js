//Coding below borrowed/based off Lab 13 &14, screencasts, and W3 Schools//

var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
var products_list = require('./static/products_data.js');
app.use(session({
    secret: "vroom",
    cookie: {maxAge: 36000},
}));


var user_data_file = './user_data.json';

if(fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`);
}

app.all('*',function(req,res,next){
    console.log(req.method, req.path);
    next();
});


//Process login
app.post('/process_login', function(request,response,next){
    console.log(request.body);
    let username_entered = request.body["username"];
    let password_entered = request.body["password"];
    if(typeof user_data[username_entered] != 'undefined') {
        //If user + password is good, send to invoice
        if(user_data[username_entered]['password']== password_entered){
             response.cookie('username', username_entered);
             response.redirect('/index.html?'); }
            else{
                response.send(`${username_entered} password wrong`);
            }}else{
                response.send(`${username_entered} not found`);
            }
            });
 
//Process Registration
app.post('/process_register', function(req,res,next){

//Add new user
username = req.body["username"]; 
/*not taken*/
if(typeof user_data[username] == 'undefined'){
}
else{res.send('Username is already taken.');
}
user_data[username] = {};
user_data[username]["password"] = req.body["password"];
user_data[username]["confirm"] = req.body["confirm"]
user_data[username]["full name"] = req.body["full name"];
user_data[username]["email"] = req.body["email"];

    
//Save updated user_data
fs.writeFileSync(user_data_file, JSON.stringify(user_data));

//Send to Invoice
res.cookie('username', username);
res.redirect('/index.html?' );
});

app.all('*', function (request, response, next) {
    console.log(`Got a ${request.method} to path ${request.path}`);
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } 
    next();
});

app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

//Add to cart
app.post("/addcart", function (request, response,next) {
    var brand = request.query['brand'];
    var quantities = request.query['quantities'].map(Number);
    request.session.cart = brand
    request.session.cart[brand] = quantities; 
});
app.post("/getcart", function(request, response){
    response.json(request.session.cart);
});

//Logout
app.post("/logout", function (request, response,next) {
    response.session.destroy()
    response.send("You are logged out")
});



app.use(express.static('./static'));
var listener = app.listen(8080, () => {console.log('listening on port' + listener.address().port)});