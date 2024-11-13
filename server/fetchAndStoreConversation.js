const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Conversation = require('./models/onversation');
const Link = require('./models/Link'); // Assuming Link model exists

// MongoDB Connection
const connectionString = 'mongodb+srv://owservera:oLj8L4ZFYDeSou96@conversations.ieptz.mongodb.net/';
mongoose.connect(connectionString)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to fetch conversation HTML and parse conversation text
async function fetchAndParseConversation(url) {
    try {
        // Make a request to the URL with headers to bypass bot detection
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://chatgpt.com',
            },
        });

        const $ = cheerio.load(data);

        // Extract conversations based on the data attributes in the HTML structure
        const conversationTurns = [];
        $('article').each((i, elem) => {
            const role = $(elem).find('h5, h6').text().includes('You') ? 'human' : 'ai';
            const content = $(elem).find('.text-message').text().trim();

            // Save each entry with its role and text content
            if (content) {
                conversationTurns.push({ sender: role, content });
            }
        });

        return conversationTurns;

    } catch (error) {
        console.error('Error fetching conversation data:', error.message);
    }
}

// Function to save parsed conversation to MongoDB
async function saveConversation(conversationData, linkId) {
    const conversationId = await Conversation.estimatedDocumentCount() + 1; // Simple count-based ID
    const conversationDocs = conversationData.map(entry => ({
        conversationId,
        sender: entry.sender,
        content: entry.content,
        linkId, // Retain link ID if we need to track it
    }));

    try {
        await Conversation.insertMany(conversationDocs);
        console.log(`Conversation ${conversationId} saved successfully!`);
    } catch (error) {
        console.error('Error saving conversation:', error.message);
    }
}

// Main function to fetch and store conversation by link
async function processLink(link) {
    const conversationData = await fetchAndParseConversation(link);
    if (conversationData && conversationData.length) {
        await saveConversation(conversationData, link); // Pass the link as reference
    } else {
        console.log('No conversation data found or parsed.');
    }
}

// Test function to fetch and process a sample link
(async () => {
    const link = 'https://chatgpt.com/sample/link-to-shared-conversation';
    await processLink(link);
})();
