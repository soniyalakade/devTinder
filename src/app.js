const express = require("express");
const connectDB = require("./config/database");
const app=express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validations")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());


//signup user
app.post("/signup", async (req, res) => {

    //Validation of data

    try{

        validateSignUpData(req);

        //Encrypt the password

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password : passwordHash
        });

   
        await user.save();
        res.send("User added successfully!");
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

app.post("/login", async (req, res) =>{
    try{

        const {emailId, password} = req.body;

        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("Invalid credentials.");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            const token = await user.getJWT();

            res.cookie("token", token, {expires: new Date(Date.now() + 7*24*60*60*1000), httpOnly: true});
            res.send("Login Successfull!");
        }
        else{
            res.send("Invalid credentials");
        }

    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

app.get("/profile", userAuth, async(req, res) => {

  try {
    const user = req.user;
    res.send(user);
  }

  catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async(req, res) =>{

    const user = req.user;

    //Sending connection request
    console.log("Sending connection request");

    res.send(user.firstName + " sent the connection request!");
});

connectDB()
    .then(() => {
        console.log("Database connection establised...");
        app.listen(7777, () =>{
            console.log("Server is successfully listning on port 7777.");
        });
    })
    .catch((err)=>{
        console.error("Database cannot be connected!");
    });


