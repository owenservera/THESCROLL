const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Conversation = require('../server/models/conversation');
const Link = require('../server/models/Link');

// MongoDB connection
const connectionString = 'mongodb+srv://owservera:oLj8L4ZFYDeSou96@conversations.ieptz.mongodb.net/';
mongoose.connect(connectionString)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Headers to mimic a real browser request
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

// Function to fetch and parse ChatGPT conversation data
async function fetchConversationData(url) {
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);

        // Check for ChatGPT structure in HTML
        const gptHtml = $('script#__NEXT_DATA__').html();
        if (!gptHtml) {
            console.error('No ChatGPT conversation data found');
            return null;
        }

        // Parse JSON data from ChatGPT's `__NEXT_DATA__` script
        const gptJson = JSON.parse(gptHtml).props.pageProps.serverResponse;
        const conversationId = Date.now(); // Use a timestamp as a unique ID
        const conversationEntries = [];

        // Extract conversation entries
        gptJson.data.linear_conversation.forEach((message, index) => {
            const sender = index % 2 === 0 ? 'human' : 'ai'; // Alternating roles based on index
            const content = message.message?.content.parts[0];

            if (content) {
                conversationEntries.push({
                    conversationId,
                    sender,
                    content,
                    link: url // Store original link for reference
                });
            }
        });

        return conversationEntries;
    } catch (error) {
        console.error('Error fetching conversation data:', error.message);
        return null;
    }
}

// Function to save parsed conversation to MongoDB
async function saveConversation(conversationData) {
    try {
        await Conversation.insertMany(conversationData);
        console.log(`Conversation saved successfully!`);
    } catch (error) {
        console.error('Error saving conversation:', error.message);
    }
}

// Main function to fetch and store conversation by link
async function processLink(link) {
    const conversationData = await fetchConversationData(link);
    if (conversationData && conversationData.length) {
        await saveConversation(conversationData);
    } else {
        console.log('No conversation data found or parsed.');
    }
}

// Execute the script for a test link
(async () => {
    const link = 'https://chatgpt.com/share/6734511c-4a6c-8006-aa6e-cfef67e69792'; // Replace with actual link
    await processLink(link);
})();
