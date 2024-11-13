// server/models/Link.js
const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Link', linkSchema);
