const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = ["_id", "firstName", "lastName", "emailId", "age", "photoUrl", "about", "skills"];
//Get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try{
        const loggedIn = req.user;
        const connectionRequests = await ConnectionRequest.find({   
            toUserId: loggedIn._id,
            status : "interested",
        }).populate("fromUserId", USER_SAFE_DATA);   

        res.json({
            message: "Connection requests fetched successfully!",
            data: connectionRequests,
        });
    }catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {

    try{        
        const loggedIn = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedIn._id, status: "accepted"},
                {toUserId: loggedIn._id, status: "accepted"},
            ],
        }).populate("fromUserId toUserId", USER_SAFE_DATA);


        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedIn._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;                       
        });
        res.json({
            message: "Connections fetched successfully!",
            data,
        });
        }catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {

    try{    
        const loggedIn = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedIn._id},
                {toUserId: loggedIn._id},
            ],
        }).select("fromUserId toUserId");

        const excludedUserIds = new Set();
        connectionRequests.forEach((req) => {
            excludedUserIds.add(req.fromUserId.toString());
            excludedUserIds.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and : [
                {_id: { $nin: Array.from(excludedUserIds) }},
                {_id: {$ne : loggedIn._id}} 
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data : users});

    }catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
});

module.exports = userRouter;