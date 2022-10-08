//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const staticPath = path.join(__dirname,"/public");


const app = express();

// app.use(favicon(staticPath,"favicon.ico"));

app.use(express.static(staticPath));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('trust proxy',1)
app.use(session({
  secret:"F#cking diabolical it is",
  resave:false,
  saveUninitialized:false
  
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets");
  }
  else{
    res.redirect("/login")
  }
});

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/")
});

app.post("/register", function (req, res) {

    User.register({username:req.body.username, active: false}, req.body.password, function(err,user){
      if(err){
        console.log(err);
        res.redirect("/register");
      }else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets")
        })
      }
    })
 
});

app.post("/login", function (req, res) {
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err)
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("http://localhost:3000/")
      });
    }
  })
  


})


app.listen("8080",()=>{
  console.log("server running")
})