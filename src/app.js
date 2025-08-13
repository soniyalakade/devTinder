const express=require("express");

const app=express();

app.use("/hi", (req, res)=>{
    res.send("Hello from the dashboard.");
});

app.use("/hello", (req, res)=>{
    res.send("Hello from the server.");
});

app.listen(1000, () =>{
    console.log("Server is successfully listning on port 1000.")
});