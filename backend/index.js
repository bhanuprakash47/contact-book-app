const express=require("express")
const cors=require("cors")
const sqlite3=require("sqlite3")

const app=express()

const db= new sqlite3.Database("./contacts.db",(error)=>{
    if (error){
        console.log("database connection failed:",error)
    }
    else{
        console.log("database connection successful")
    }
})


app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("sample")
})

app.listen(5000,()=>{
    console.log("server running at port 5000")
})


db.run("CREATE TABLE IF NOT EXISTS contacts( id INTEGER PRIMARY KEY, name TEXT,email TEXT,phone TEXT)")