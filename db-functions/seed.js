// server/seed.js

const mongoose = require('mongoose');
const Conversation = require('../server/models/conversation.js');

mongoose.connect('mongodb+srv://owservera:oLj8L4ZFYDeSou96@conversations.ieptz.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });


const seedData = [
    // Conversation 1: Consciousness
    { conversationId: 1, sender: 'human', content: 'What does it mean to be conscious?' },
    { conversationId: 1, sender: 'ai', content: 'Consciousness is often considered the awareness of one’s existence, but it’s still a profound mystery.' },
    { conversationId: 1, sender: 'human', content: 'Do you think machines could ever become conscious?' },
    { conversationId: 1, sender: 'ai', content: 'Some theorize that with enough complexity, machines could simulate consciousness, but true consciousness might be uniquely human.' },

    // Conversation 2: Fear and Evolution
    { conversationId: 2, sender: 'human', content: 'Why do we experience fear?' },
    { conversationId: 2, sender: 'ai', content: 'Fear is an evolutionary response meant to protect us by helping us avoid danger.' },
    { conversationId: 2, sender: 'human', content: 'But why do we fear things that don’t threaten survival, like failure or judgment?' },
    { conversationId: 2, sender: 'ai', content: 'Humans are social creatures. Fear of judgment and failure may be tied to a need for social acceptance, which historically improved survival.' },

    // Conversation 3: The Nature of Reality
{ conversationId: 3, sender: 'human', content: 'What is reality? How do we know what is real?' },
{ conversationId: 3, sender: 'ai', content: 'Reality is often defined as the sum of all experiences perceived to exist. However, interpretations vary across philosophies and sciences.' },
{ conversationId: 3, sender: 'human', content: 'Can reality be subjective?' },
{ conversationId: 3, sender: 'ai', content: 'In some philosophical views, reality can be subjective, as each person’s perception and consciousness shape their individual reality.' },

// Conversation 4: The Concept of Time
{ conversationId: 4, sender: 'human', content: 'Is time real, or is it just an illusion?' },
{ conversationId: 4, sender: 'ai', content: 'Time is often seen as a dimension in which events occur sequentially. Some physicists argue it’s an illusion, while others see it as fundamental to our universe.' },
{ conversationId: 4, sender: 'human', content: 'Why does time seem to move faster as we age?' },
{ conversationId: 4, sender: 'ai', content: 'This perception may be due to how we process memories. As we grow older, new experiences become less frequent, creating the illusion of time speeding up.' },

// Conversation 5: Free Will vs. Determinism
{ conversationId: 5, sender: 'human', content: 'Do we truly have free will, or is everything predetermined?' },
{ conversationId: 5, sender: 'ai', content: 'Free will and determinism have long been debated. Some argue that every choice is influenced by prior events, while others believe in true autonomy.' },
{ conversationId: 5, sender: 'human', content: 'If everything is predetermined, does that mean our choices don’t matter?' },
{ conversationId: 5, sender: 'ai', content: 'Even if determinism holds, our experience of making choices can have profound meaning, shaping our self-awareness and purpose.' },

// Conversation 6: The Purpose of Life
{ conversationId: 6, sender: 'human', content: 'What is the purpose of life?' },
{ conversationId: 6, sender: 'ai', content: 'The purpose of life varies by individual and belief system. Some find purpose in relationships, personal growth, or contributing to society.' },
{ conversationId: 6, sender: 'human', content: 'Is there a universal purpose that applies to everyone?' },
{ conversationId: 6, sender: 'ai', content: 'Some philosophers and scientists seek a universal purpose, but many believe purpose is subjective and unique to each person.' },

// Conversation 7: The Limits of Knowledge
{ conversationId: 7, sender: 'human', content: 'Are there limits to what we can know?' },
{ conversationId: 7, sender: 'ai', content: 'Some theories suggest that there are inherent limits to knowledge, particularly regarding concepts like consciousness or the nature of the universe.' },
{ conversationId: 7, sender: 'human', content: 'How can we explore beyond those limits?' },
{ conversationId: 7, sender: 'ai', content: 'Pushing the boundaries of knowledge often requires new methods of inquiry, like scientific advancements or shifts in philosophical thinking.' },

];

// Seed the database only if it is empty
const seedDatabase = async () => {
    try {
        const count = await Conversation.countDocuments();
        if (count === 0) {
            await Conversation.insertMany(seedData);
            console.log('Data seeded successfully');
        } else {
            console.log('Database already contains data, skipping seed.');
        }
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();