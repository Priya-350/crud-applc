const express = require('express');
const app=express()
const PORT=process.env.PORT|| 3500;

const cors=require("cors")

const mongoose =require("mongoose");

main().catch((err)=>console.log(err.message))
async function main(){
    await mongoose.connect("mongodb://localhost:27017/user")
    console.log("db connected")
}


const UserSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        age:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        }
    }
)

const usermodel=mongoose.model("crud",UserSchema);
app.use(cors(
    {
        origin:"http://localhost:3000",
        methods:["GET","POST","PATCH","DELETE"]
    }
))
app.use(express.json())
app.get("/users",async(req,res)=>{
    const users=await usermodel.find();
    return res.json(users);
})
app.delete("/users/:id",async(req,res)=>{
    let id=req.params.id;
    await usermodel.findByIdAndDelete(id)
    return res.status(200).send("deleted successfully")
})
app.post("/users",async (req,res)=>{
   let {name,age,city}=req.body;
    if(!name||!age||!city){
        return res.status(404).send("all fields are required!!")
    }
    
const user=await usermodel.create(
    {name:name,age:age,city:city}
);
console.log(user)
return res.json(user);
   
})

app.patch("/users/:id",async(req,res)=>{
    let id=req.params.id;
    let {name,age,city}=req.body;
    if(!name||!age||!city){
        return res.status(404).send("all fields are required!!")
    }
    await usermodel.findByIdAndUpdate(id,{name:name,age:age,city:city},{new:true})
     
     
})
app.listen(PORT,(err)=>{
    console.log(`server is running on port ${PORT}`);
})