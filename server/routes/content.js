// server/routes/content.js

const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');  // Ensure the path is correct

// GET route to fetch all conversations
router.get('/', async (req, res) => {
    try {
        // Fetch all conversation entries from the database, sorted by conversationId and entry order
        const conversations = await Conversation.find().sort({ conversationId: 1, _id: 1 });

        // Group conversations by conversationId
        const groupedConversations = {};
        conversations.forEach(entry => {
            const { conversationId } = entry;

            // Initialize the group if it doesn't exist yet
            if (!groupedConversations[conversationId]) {
                groupedConversations[conversationId] = [];
            }

            // Push each entry into the appropriate conversation group
            groupedConversations[conversationId].push(entry);
        });

        // Return the grouped conversations as JSON
        res.json(groupedConversations);
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
