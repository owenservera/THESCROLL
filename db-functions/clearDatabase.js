// server/clearDatabase.js

const mongoose = require('mongoose');
const Conversation = require('../server/models/conversation.js');

// MongoDB connection
const connectionString = 'mongodb+srv://owservera:oLj8L4ZFYDeSou96@conversations.ieptz.mongodb.net/';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const clearDatabase = async () => {
    try {
        const result = await Conversation.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} documents from the 'conversations' collection.`);
    } catch (err) {
        console.error('Error deleting documents:', err);
    } finally {
        mongoose.connection.close();
    }
};

clearDatabase();
