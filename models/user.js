const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // posts: [postSchema], // embedding the postSchema here
    // topics: [topicSchema], // embedding the topicSchema here
});

const User = mongoose.model('User', userSchema);

module.exports = User;