var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var User = require("./models/user");
const { get } = require("mongoose");
var passport = require("passport");
var passportLocal = require("passport-local");

var app = express();
// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
  var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/home");
    } else {
      next();
    }
  };
  app.set('view engine','ejs');
  app.use(express.static('public'));

app.get('/',(req,res) =>{
    res.render('login');
});
app.get('/home',(req,res) =>{
    res.render('home');
});
app.get('/module',(req,res) =>{
    res.render('module');
});
app.get('/login',sessionChecker,(req,res) =>{

    res.render('login')
    res.sendFile(__dirname + "/login");

}).post(async (req, res) => {
    var username = req.body.username,
      password = req.body.password;
      try {
        var user = await User.findOne({ username: username }).exec();
        if(!user) {
            res.redirect("/login");
        }
        user.comparePassword(password, (error, match) => {
            if(!match) {
              res.redirect("/login");
            }
        });
        req.session.user = user;
        res.redirect("/home");
    } catch (error) {
      console.log(error)
    }
  });

  app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), function (req, res) {

});
app.get('/profile',(req,res) =>{
    res.render('profile');
});
app.get('/logout',(req,res) =>{
res.render('logout');
});
app.get('/forgot',(req,res) =>{
    res.render('forgot');
});
app.get('/register',sessionChecker,(req,res) =>{
    res.render('register');
    res.sendFile(__dirname + "/register");
})

app.post('/register',(req,res)=>{
  console.log(req.body);
    var user=new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword,
        mob_number:req.body.phone,
        alter_mobnumber:req.body.phonenumber,
        address:req.body.address,
        gender:req.body.gender
    })
    user.save((err,docs) => {
        if(err){
            res.redirect('/register');
            console.log(err);
        }
        else{
            // console.log(docs)
            req.session.user = docs;
            res.redirect('/login');
        }
    })
  //    passport.authenticate("local")(
  //      req, res, function () {
  //     res.render("/home");
  // });
});
app.listen(3030,() => {
  console.log("App is listening on Port 3030")
});
