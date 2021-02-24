require("dotenv").config()
const express=require("express");
const bodyParser=require("body-parser")
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const secret=process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const User=mongoose.model("User",userSchema);


app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.post("/register",async(req,res)=>{
    try{
    let user=new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save();
    res.render("secrets.ejs");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.post("/login",async(req,res)=>{
    try{
        let user=await User.findOne({email:req.body.username});
        if (user){
            if (user.password==req.body.password)return res.render("secrets.ejs");
            
        }
    }
    catch(err){
        console.log(err);
    }
})


app.listen(3000,()=>{
    console.log("Listening on port 3000");
})