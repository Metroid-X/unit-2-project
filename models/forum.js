

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const User = require('./user.js');





const commentSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
        required: true,
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

const Forum = Model('Forum', forumSchema);

module.exports = Forum;