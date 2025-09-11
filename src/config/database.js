const mongoose = require('mongoose');


const connectDB= async() => {
    await mongoose.connect(
        "mongodb+srv://soniya_lakade:Soniya%402004@namastenode.8entguk.mongodb.net/DevTinder"
    );
};

module.exports=connectDB;
