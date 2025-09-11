const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
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
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data is not valid.");
            }
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
});

module.exports = mongoose.model("User", userSchema);