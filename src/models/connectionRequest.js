const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUE} is incorrect status type '
        }
    }
},
{
    timestamps: true,
}
);

connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()){
        throw new Error(": You cannot send request to yourself!");
    }
    next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;