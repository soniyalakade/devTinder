const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong!");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: '{VALUE} is not a valid gender type' 
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.webert.it%2Fprod-dummy-image-1-2%2F%3Flang%3Den&psig=AOvVaw28H6KEdsuHKExDEL247hEy&ust=1756058719484000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCqk9nCoY8DFQAAAAAdAAAAABAE",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL.");
            }
        }
    },
    about: {
        type: String,
        default: "This is default feild."
    },
    skills: {
        type: [String]
    }
},
{
    timestamps:true
}
);


userSchema.methods.getJWT = async function() {

    const user = this; 

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$798", {expiresIn: "7D"});

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    return await bcrypt.compare(passwordInputByUser, passwordHash);
} 

module.exports = mongoose.model("User", userSchema);