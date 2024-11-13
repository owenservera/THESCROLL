// server/routes/submissions.js

const express = require('express');
const Link = require('../models/Link');
const router = express.Router();

// POST route to capture and store the link in the database
router.post('/', async (req, res) => {
    const { link } = req.body;

    if (!link) {
        return res.status(400).json({ error: 'No link provided.' });
    }

    try {
        const newLink = new Link({ url: link });
        await newLink.save();
        res.json({ message: 'Link saved successfully!' });
    } catch (error) {
        console.error('Error saving link:', error);
        res.status(500).json({ error: 'Failed to save link.' });
    }
});

module.exports = router;
