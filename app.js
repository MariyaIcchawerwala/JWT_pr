const express=require("express")
const path=require("path")
const fs=require("fs");
const app=express();
const bcrypt=require("bcryptjs");
var mongoose=require('mongoose');
const multer=require("multer")
const cookieparser= require("cookie-parser")
const bodyparser=require("body-parser")
mongoose.connect('mongodb://localhost/LoginUser',{useNewUrlParser:true})
const port=80;
const{CreateTokens}=require('./jwt')

app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(express.urlencoded())
app.use(express.json)
app.use(cookieparser())

const storage=multer.diskStorage({
    destination: function(re,file,cb){
       cb(null,'./images')
    },
    filename: function(req,file,cb){
         cb(null,file.filename)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||
    file.mimetype==='image/jpg')
    {
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const upload= multer({storage:storage,fileFilter:fileFilter})
var userSchema=new mongoose.Schema({
    username:
    {
        type:String,
        require:true
    },
    password: {
        type:String,
        require:true
    }
})

var login=mongoose.model('login', userSchema)


//Post request to login

app.post('/login',async(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    const user= await login.find({username:username})
    if(!user)res.status(400).json({error:"user dosnt exist"})
    const dbpassword= await login.find({password:password})
    bcrypt.compare(password,dbpassword).then((match)=>{
        if(!match){
            res.status(400).json({error:"wrong username and password combination"})
        } else{
             const accessToken=createToken(user)

             res.cookie("access-token",accessToken,{
                max:60*60*24*30*1000
             })
            res.json("logged in");
        }
    })
    
})
//upload image
app.post('/upload',upload.single('file'),(req,res)=>{
    console.log(req.file)
    if(!image){
       res.status(400).send("item not saved");
        
    }
})
//post request to register
app.post('/register',(req,res)=>{
    const username=req.body.username;

    const spas=bcrypt.hash(req.body.password,10);
     
    var mydata=new login({
        username:username,
        password:spas

    })
    
    mydata.save().then(()=>{
        res.send("sucessfully registered")
    }).catch(()=>{
        res.status(404).send("item not saved")
    })
})

//listning to the port

app.listen(port,()=>{
    console.log(`port started sucessfully on ${port}`)
})