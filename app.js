//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
mongoose

const app = express()
app.use('/static', express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

const User = mongoose.model("User",userSchema);


mongoose.connect("mongodb://localhost:27017/userDB")

app.get("/", (req, res)=> {
    res.render("home");
})

app.get("/:page", (req, res) => {
    res.render(req.params.page);
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},(err,foundUser)=>{
        if(!err){
            if(foundUser){
                if(foundUser.password===password)res.render("secrets");
                else res.send("wrong credentials!");
            }
        }
    })


})

app.post("/register",(req,res)=>{
    const user = new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save((err)=>{
        if(!err)res.render("secrets");
        else res.send("Error appeared while registering",err);
    })
})


app.listen("3000", () => {
    console.log("server running")
});