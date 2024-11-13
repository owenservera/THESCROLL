// server/app.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');  // Import the CORS package
const contentRoutes = require('./routes/content');
const submissionsRouter = require('./routes/submissions');  // Import the submissions route

const app = express();

// Enable CORS for all requests to avoid CORS errors
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
const connectionString = 'mongodb+srv://owservera:oLj8L4ZFYDeSou96@conversations.ieptz.mongodb.net/';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Serve API routes for conversations
app.use('/api/conversations', contentRoutes);

// New route to handle link submissions
app.use('/api/submit-link', submissionsRouter);

// Serve static assets (CSS, images, etc.)
app.use(express.static(path.join(__dirname, '..', 'assets')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
