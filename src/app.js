const express = require("express");
const connectDB = require("./config/database");
const app=express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validations")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

//get user by email
app.get("/user", async (req, res) => {
    const userEmailId = req.body.emailId;

    try{
        const users = await User.find({emailId : userEmailId});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong!");
    }
});

//get all users
app.get("/feed", async (req, res) => {

    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong!");
    }
});

//delete user by id
app.delete("/user", async (req, res) =>{

    const userId= req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully.");
    }
    catch(err){
        res.status(400).send("Something went wrong!");
    }
})

//update data of user
app.patch("/user/:userId", async (req, res) =>{
    const userId = req.params?.userId;
    const data = req.body;

    try{
        const allowed_updates = ["skills","photoUrl", "about", "gender", "age"];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            allowed_updates.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("Update not allowed.");
        };

        if(data?.skills.length>10){
            throw new Error("Skills cannot be more than 10.");
        }

        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            runValidators: true,
        });

        res.send("User updated successfully.")
    }

    catch(err){
        res.status(400).send("User cannot be updated."+ err.message);
    }
    
});

app.get("/profile", async (req, res) =>{

    const cookies = req.cookies;

    const{token}=cookies;
    //Validate token

    console.log(cookies);
    res.send("Reading cookie.");
});

app.post("/login", async (req, res) =>{
    try{

        const {emailId, password} = req.body;

        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("Invalid credentials.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){

            token = await jwt.sign({_id: user._id}, "DEV@Tinder$798")
            console.log(token);

            res.cookie("token", token);
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




