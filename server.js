// ===========================
// Express Backend Server
// ===========================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const API_KEY = process.env.OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const publicPath = path.join(__dirname, '.');

// ===========================
// Middleware
// ===========================

app.use(cors());
app.options('*', cors());
app.use(express.json());

// ===========================
// Conversation Storage (In-Memory)
// In production, use a database like MongoDB or PostgreSQL
// ===========================

const conversations = {};

const simpleResponses = {
    greeting: [
        'Hello! How can I help you today?',
        'Hi there! What would you like to learn or talk about?',
        'Hey! I can answer questions about AI, programming, or learning.'
    ],
    help: [
        'I can answer questions, explain ideas, or help you practice coding concepts.',
        'Try asking me about AI, chatbots, programming, or study tips.'
    ],
    ai: [
        'I am an AI learning assistant built to help you practice chatbots.',
        'AI is about teaching machines to understand and respond to information.'
    ],
    coding: [
        'If you want to learn coding, start with small programs and build step by step.',
        'Programming is about solving problems; pick one problem and break it into smaller pieces.'
    ],
    thanks: [
        'You are welcome! Feel free to ask another question.',
        'Glad I could help! Ask me anything else.'
    ],
    goodbye: [
        'Goodbye! Feel free to ask again anytime.',
        'See you later! Come back when you want to practice more.'
    ],
    fallback: [
        'That sounds interesting! Tell me more.',
        'Can you share a bit more about what you want to learn?',
        'I can help explain concepts, give examples, or answer questions about AI.'
    ]
};

function randomResponse(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function getSimpleResponse(message) {
    const normalized = message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();

    if (!normalized) {
        return 'Please type a question or topic and I will try to answer it.';
    }

    if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(normalized)) {
        return randomResponse(simpleResponses.greeting);
    }

    if (/\b(help|how do i|what can you|what should i|i need)\b/.test(normalized)) {
        return randomResponse(simpleResponses.help);
    }

    if (/\b(ai|artificial intelligence|machine learning|deep learning)\b/.test(normalized)) {
        return randomResponse(simpleResponses.ai);
    }

    if (/\b(code|program|javascript|python|react|node|chatbot)\b/.test(normalized)) {
        return randomResponse(simpleResponses.coding);
    }

    if (/\b(thanks|thank you|thx)\b/.test(normalized)) {
        return randomResponse(simpleResponses.thanks);
    }

    if (/\b(bye|goodbye|see you|later|talk to you)\b/.test(normalized)) {
        return randomResponse(simpleResponses.goodbye);
    }

    if (/\b(what is|explain|define|how does|why)\b/.test(normalized)) {
        return 'That is a great question. Try asking it again with one specific topic, like "What is AI?" or "How do I build a chatbot?"';
    }

    return randomResponse(simpleResponses.fallback);
}

// ===========================
// Routes
// ===========================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    let message = '';
    let conversationId = '';

    try {
        ({ message, conversationId } = req.body);

        // Validate input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Invalid message format' });
        }

        if (!conversationId) {
            conversationId = Date.now().toString();
        }

        // Initialize or get conversation history
        if (!conversations[conversationId]) {
            conversations[conversationId] = [];
        }

        const conversationHistory = conversations[conversationId];

        if (!API_KEY) {
            const aiResponse = getSimpleResponse(message);

            conversationHistory.push({
                role: 'user',
                content: message
            });
            conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });

            if (conversationHistory.length > 20) {
                conversationHistory.splice(0, conversationHistory.length - 20);
            }

            return res.json({
                response: aiResponse,
                conversationId: conversationId
            });
        }

        // Build messages array with conversation history
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful and friendly AI assistant. Provide clear, concise, and helpful responses.'
            },
            ...conversationHistory,
            {
                role: 'user',
                content: message
            }
        ];

        // Call OpenAI API
        const response = await axios.post(API_ENDPOINT, {
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract AI response
        const aiResponse = response.data.choices[0].message.content;

        // Store conversation history
        conversationHistory.push({
            role: 'user',
            content: message
        });
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        // Keep conversation history under control (last 20 messages)
        if (conversationHistory.length > 20) {
            conversationHistory.splice(0, conversationHistory.length - 20);
        }

        // Send response
        res.json({
            response: aiResponse,
            conversationId: conversationId
        });

    } catch (error) {
        console.error('Error:', error.message);

        // Handle specific errors
        if (error.response?.status === 401) {
            return res.status(401).json({
                error: 'Invalid API key. Check your OPENAI_API_KEY in .env'
            });
        }

        if (error.response?.status === 429) {
            const fallbackResponse = getSimpleResponse(message);

            conversationHistory.push({
                role: 'user',
                content: message
            });
            conversationHistory.push({
                role: 'assistant',
                content: fallbackResponse
            });

            if (conversationHistory.length > 20) {
                conversationHistory.splice(0, conversationHistory.length - 20);
            }

            return res.json({
                response: fallbackResponse,
                conversationId: conversationId,
                warning: 'OpenAI is rate limited. Serving fallback response.'
            });
        }

        res.status(500).json({
            error: 'Failed to process request. Please try again later.'
        });
    }
});

// Clear conversation endpoint
app.post('/api/clear-conversation', (req, res) => {
    const { conversationId } = req.body;
    if (conversationId && conversations[conversationId]) {
        delete conversations[conversationId];
    }
    res.json({ message: 'Conversation cleared' });
});

// Serve the chat UI from the backend server
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Serve static files (CSS, JS, images, etc.) after API routes
app.use(express.static(publicPath));

// ===========================
// Error Handling Middleware
// ===========================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// ===========================
// Start Server
// ===========================

let activePort = PORT;

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`
    ╔════════════════════════════════════════╗
    ║   ChatGPT-like Chat App - Backend      ║
    ║   Server running on port ${port}       ║
    ║   http://localhost:${port}             ║
    ╚════════════════════════════════════════╗
    
    📝 API Endpoints:
    - GET  /api/health              : Health check
    - POST /api/chat                : Send message & get response
    - POST /api/clear-conversation  : Clear conversation history
    `);

        if (API_KEY && API_KEY !== 'your_openai_api_key_here') {
            console.log('✅ OpenAI API key loaded. AI responses are enabled.');
        } else {
            console.log('⚠️  OPENAI_API_KEY is not set or invalid. The app will use simple fallback responses.');
        }
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
            process.exit(1);
        }
    });
};

startServer(activePort);

module.exports = app;
