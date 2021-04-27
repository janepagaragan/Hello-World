//Coding below borrowed/based off Lab 13 &14, screencasts, and W3 Schools//

var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');
const { response } = require('express');

//user_data = require('./user_data.json');
var user_data_file = './user_data.json';
if(fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
var user_data = JSON.parse(fs.readFileSync(user_data_file, 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`);
}

//console.log(user_data);

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
             request.query["purchase"]="true";
             request.query["full name"]= request.body["full name"];
    request.query["username"]= request.body["username"];
    response.redirect('/invoice.html?' + qs.stringify(request.query));
        //Wrong Password
        } else{
            response.send(`${username_entered} password wrong`);
        }
        //User not found
    } else{
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
req.query["purchase"]="true";
    req.query["username"]= req.body["username"];
    req.query["full name"]= req.body["full name"];
res.redirect('/invoice.html?' + qs.stringify(req.query));
});

app.use(express.static('./static'));
var listener = app.listen(8080, () => {console.log('listening on port' + listener.address().port)});