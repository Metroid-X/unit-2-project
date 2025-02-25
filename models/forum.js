

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const User = require('./user.js');





const commentSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    content: {
        type: String,
        required: true,
    },
    linked: {
        type: String,
        required: false,
    },
});

const topicSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    linked: {
        type: String,
        required: false,
    },
    comments: [commentSchema]
});

const forumSchema = Schema({
    forum_branch: {
        type: String,
        required: true,
    },
    topics: [topicSchema],
});

// const userSchema = new Schema({
//     displayname: {
//         type: String,
//         required: true,
//     },
//     linkedavatar: {
//         type: String,
//         reqired: false,
//     },
//     username: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     // topics: [topicSchema], // embedding the topicSchema here
// });

// const forumSchema = Schema({
//     branches: {
//         main: {
//             topics: [topicSchema],
//         },
//         art: {
//             topics: [topicSchema],
//         },
//         games: {
//             topics: [topicSchema],
//         },
//     },
//     users: [userSchema],
// })

const Forum = Model('Forum', forumSchema);

module.exports = Forum;