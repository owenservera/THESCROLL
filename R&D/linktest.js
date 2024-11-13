const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Conversation = require('../server/models/conversation'); // Adjust path if necessary
const Link = require('../server/models/Link'); // Model for the links collection

// MongoDB connection string
const connectionString = 'mongodb+srv://owservera:oLj8L4ZFYDeSou96@conversations.ieptz.mongodb.net/';

// Connect to MongoDB
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Function to fetch, parse, and store conversation data
async function fetchAndStoreConversation(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Define a unique conversationId
        const conversationId = Date.now(); // Unique timestamp-based ID for this conversation

        // Extract conversation content
        const conversation = await page.evaluate((url, conversationId) => {
            const messages = [];
            const conversationElements = document.querySelectorAll('article');

            conversationElements.forEach((element) => {
                const roleElement = element.querySelector('h5, h6'); // Use h5 for user, h6 for assistant
                const textElement = element.querySelector('.text-message div');

                if (roleElement && textElement) {
                    const role = roleElement.innerText.includes('You said') ? 'human' : 'ai';
                    const content = textElement.innerText.trim();
                    messages.push({
                        conversationId,   // Add conversationId to each message
                        sender: role,
                        content,
                        link: url         // Add link to each message
                    });
                }
            });

            return messages;
        }, url, conversationId);

        if (conversation.length === 0) {
            console.log('No conversation data found.');
        } else {
            // Save conversation to MongoDB
            await Conversation.insertMany(conversation);
            console.log(`Conversation saved to MongoDB with ID: ${conversationId}`);

            // Optionally save to a JSON file for verification
            const filePath = path.join(__dirname, 'conversation_data.json');
            fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
            console.log(`Conversation data also saved to ${filePath}`);
        }
    } catch (error) {
        console.error('Error capturing conversation:', error);
    } finally {
        await browser.close();
    }
}

// Set up Change Stream on the Link collection to listen for new documents
const linkChangeStream = Link.watch();

linkChangeStream.on('change', async (change) => {
    // Listen for insert operations only
    if (change.operationType === 'insert') {
        const newLink = change.fullDocument;
        console.log(`New link detected: ${newLink.url}`);

        // Trigger the fetch and store process
        try {
            await fetchAndStoreConversation(newLink.url);
            console.log(`Data fetched and stored successfully for link: ${newLink.url}`);
        } catch (error) {
            console.error(`Failed to fetch and store data for link ${newLink.url}:`, error);
        }
    }
});

// Keep the process running and listen for changes indefinitely
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await linkChangeStream.close();
    await mongoose.connection.close();
    process.exit();
});
