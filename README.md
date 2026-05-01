# ChatGPT-like Chat Application

A beginner-friendly web application that mimics ChatGPT's interface and functionality. Chat with an AI powered by OpenAI's API in real-time with a modern, dark-themed UI.

## 📋 Features

### Core Features
- ✅ **Chat Interface**: Clean, modern design similar to ChatGPT
- ✅ **Real-time AI Responses**: Powered by OpenAI's GPT-3.5-turbo
- ✅ **Conversation History**: Messages stored locally in browser
- ✅ **Dark Mode UI**: Eye-friendly dark theme by default
- ✅ **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ✅ **Loading Animations**: Smooth typing indicator while waiting for responses

### Extra Features
- ✅ **New Chat Button**: Start fresh conversations anytime
- ✅ **Copy Response**: One-click copying of AI responses
- ✅ **Chat History Sidebar**: Quick access to previous conversations
- ✅ **Rate Limiting**: Built-in protection against API abuse
- ✅ **Error Handling**: Graceful error messages and recovery
- ✅ **Conversation Context**: AI remembers the last 20 messages in a chat

## 🚀 Quick Start

### Prerequisites
- **Node.js 14+** ([Download](https://nodejs.org/))
- **OpenAI API Key** ([Get Free Credits](https://platform.openai.com/account/api-keys))
- A modern web browser
- Basic command line knowledge

### Step 1: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Sign in or create a free account
3. Click "Create new secret key"
4. Copy the key (save it somewhere safe!)
5. Keep this key private - never share it publicly

### Step 2: Install Dependencies

```bash
cd "g:\my work\chat bot"
npm install
```

This installs:
- **Express**: Web server framework
- **CORS**: Enable cross-origin requests
- **dotenv**: Load environment variables
- **axios**: Make HTTP requests
- **express-rate-limit**: Prevent API abuse
- **nodemon**: Auto-reload during development

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

2. Open `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Application

**Option A: Development Mode (with auto-reload)**
```bash
npm run dev
```

**Option B: Production Mode**
```bash
npm start
```

### Step 5: Open in Browser

1. Open your browser
2. Navigate to: `http://localhost:5000`
3. Or open `index.html` directly (frontend-only, won't connect to backend)
4. Start chatting!

## 📁 Project Structure

```
chat bot/
├── index.html           # Main HTML file (chat interface)
├── style.css            # Styling (dark mode, responsive)
├── script.js            # Frontend JavaScript logic
├── server.js            # Express backend server
├── package.json         # Node.js dependencies
├── .env.example         # Environment variables template
├── .env                 # Your actual API keys (don't commit!)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🎨 Features Explained

### Frontend (HTML/CSS/JavaScript)
- **Responsive Grid Layout**: Sidebar + Main chat area
- **Dark Theme**: Easy on the eyes, modern aesthetic
- **Real-time Updates**: Messages appear instantly
- **Local Storage**: Conversation history saved in browser
- **Mobile Optimized**: Touch-friendly interface

### Backend (Node.js/Express)
- **API Endpoint**: `/api/chat` receives messages, returns AI responses
- **Conversation Context**: Maintains last 20 messages for better AI responses
- **Rate Limiting**: Max 10 requests per 15 minutes per IP
- **Error Handling**: Graceful error messages
- **Stateless Design**: Can scale horizontally

## 💰 Cost Management

### OpenAI API Pricing
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Current Config**: ~$0.001-0.005 per message (max 500 tokens)

### Ways to Save Money
1. **Monitor Usage**: Check your usage at [OpenAI Dashboard](https://platform.openai.com/account/usage)
2. **Set Rate Limits**: Currently limited to 10 requests/15 min
3. **Adjust Max Tokens**: Change `max_tokens: 500` in `server.js` (lower = cheaper)
4. **Use Cheaper Model**: `text-davinci-003` is cheaper than GPT-4

### Set a Budget Cap
1. Go to [OpenAI Billing Settings](https://platform.openai.com/account/billing/overview)
2. Set "Usage limits" to prevent overspending
3. Get email alerts before hitting limits

## 🌐 Deployment Options

### Free/Low-Cost Options

#### 1. **Railway.app** (Recommended for Beginners)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create and deploy
railway init
railway up
```
- Free tier: $5/month credits
- Easy GitHub integration
- Auto-deploys on git push

#### 2. **Heroku** (Free tier ended, but still affordable)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Deploy
git push heroku main
```

#### 3. **Render.com**
- Free tier available
- Simple deployment from GitHub
- Auto-deploys on push

#### 4. **Replit**
- Free tier with persistent project storage
- Real-time collaboration
- Simple file editing
- Limited execution time

#### 5. **Vercel** (For Frontend Only)
- Deploy frontend to Vercel (free)
- Keep backend on Railway/Render
- Zero-cost frontend hosting

### Recommended Setup for Beginners
```
Frontend (HTML/CSS/JS)
    ↓ Deploy to: Vercel (Free)
    
Backend (Node.js/Express)
    ↓ Deploy to: Railway.app ($5/month)
    
Database: None (in-memory, loses data on restart)
    → For production, add MongoDB or PostgreSQL
```

### Deployment Steps (Railway Example)

1. **Create Railway Account**
   - Visit [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your repository

3. **Add Environment Variables**
   - Go to project settings
   - Add `OPENAI_API_KEY`

4. **Deploy**
   - Railway auto-deploys!
   - Get your public URL
   - Share the URL

## 🐛 Troubleshooting

### "Cannot POST /api/chat"
- Backend server is not running
- Solution: Run `npm start` or `npm run dev`

### "Invalid API Key" Error
- API key in `.env` is wrong or expired
- Solution: Get a new key from OpenAI, update `.env`

### CORS Error
- Frontend and backend running on different domains
- Solution: Make sure backend is on `localhost:5000`

### Too Many Requests (429)
- Hit OpenAI rate limit
- Solution: Wait a moment, then retry. Check API usage.

### "Cannot find module" Error
- Dependencies not installed
- Solution: Run `npm install`

### Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
PORT=3001 npm start
```

## 📚 Learning Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Chat UI Best Practices](https://www.smashingmagazine.com/2017/09/building-chatbot-ui/)

## 🔒 Security Best Practices

1. **Never commit `.env` file** (already in `.gitignore`)
2. **Keep API key private** - regenerate if exposed
3. **Use HTTPS in production** - all deployments above provide this
4. **Validate user input** - backend filters empty messages
5. **Rate limit requests** - prevents abuse
6. **Monitor API usage** - stay within budget

## 🚀 Next Steps / Enhancements

### Easy Additions
- [ ] Dark/Light mode toggle
- [ ] Auto-save conversation titles
- [ ] Export chat as PDF/TXT
- [ ] Share conversations (generate link)

### Intermediate
- [ ] User authentication (sign up/login)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Multiple AI models (switch between GPT-3.5, GPT-4)
- [ ] Conversation search

### Advanced
- [ ] Image generation (DALL-E)
- [ ] Voice input/output
- [ ] Real-time collaboration
- [ ] Custom prompts/templates
- [ ] Usage analytics dashboard

## 📄 License

MIT License - Feel free to use and modify!

## 💬 Support

For issues:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review error messages in browser console (F12)
3. Check backend logs in terminal
4. Verify `.env` file has correct API key

---

**Happy Chatting! 🚀**

Built with ❤️ for beginners learning full-stack development.
