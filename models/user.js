const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;


const Forum = require('./forum.js')



const userSchema = Schema({
    displayname: {
        type: String,
        required: true,
    },
    linkedavatar: {
        type: String,
        reqired: false,
        default: '/default_inserts/default_pfp.png',
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // topics: [topicSchema], // embedding the topicSchema here
});


 

const User = Model('User', userSchema);

module.exports = User;