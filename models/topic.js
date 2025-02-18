

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user.js');

const topicSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        value: mongoose.now
    }
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;