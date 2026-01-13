const express = require("express"); 
const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        });

        await user.save();
        res.send("User added successfully!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // find user first
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid credentials.");
        }

        // call instance method on the found user
        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
        }

        // generate JWT
        const token = await user.getJWT();

        // set cookie
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true
        });

        // send back token too for Postman testing
        res.send({
            user, token
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.get("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.send("Logged out successfully!");
});



module.exports = authRouter;
