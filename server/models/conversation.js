// server/models/Conversation.js

const mongoose = require('mongoose');

// Define the schema for a conversation entry
const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: Number,
        required: true,  // Unique ID for each distinct conversation group
    },
    sender: {
        type: String,
        required: true,
        enum: ['human', 'ai']  // Limits sender values to either 'human' or 'ai'
    },
    content: {
        type: String,
        required: true  // The message content of the entry
    },
    link: {
        type: String,
        required: true  // The URL of the original conversation link
    }
});

// Export the model to use in other files
module.exports = mongoose.model('Conversation', conversationSchema);
