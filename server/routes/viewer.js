// server/routes/viewer.js

const express = require('express');
const Conversation = require('../models/conversation');
const router = express.Router();

// GET route to retrieve the latest conversations
router.get('/latest', async (req, res) => {
    try {
        const conversations = await Conversation.find()
            .sort({ conversationId: -1 }) // Sort by most recent
            .limit(20); // Adjust the limit as needed

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations.' });
    }
});

module.exports = router;
