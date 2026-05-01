// ===========================
// Chat App JavaScript Logic
// ===========================

class ChatApp {
    constructor() {
        this.messages = [];
        this.chatHistory = [];
        this.currentChatId = null;
        this.apiUrl = (window.location.origin && window.location.origin !== 'null') ? `${window.location.origin}/api/chat` : '/api/chat';
        this.isLoading = false;

        this.initElements();
        this.attachEventListeners();
        this.loadChatHistory();
    }

    // Initialize DOM elements
    initElements() {
        this.userInput = document.getElementById('userInput');
        this.messageForm = document.getElementById('messageForm');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.chatHistoryContainer = document.getElementById('chatHistory');
    }

    // Attach event listeners
    attachEventListeners() {
        this.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
    }

    // Handle sending a message
    async handleSendMessage(e) {
        e.preventDefault();
        const message = this.userInput.value.trim();

        if (!message || this.isLoading) return;

        // Clear input
        this.userInput.value = '';

        // Add user message to UI
        this.addMessageToUI(message, 'user');

        // Start new chat if needed
        if (!this.currentChatId) {
            this.currentChatId = this.generateChatId();
            this.chatHistory.push({
                id: this.currentChatId,
                title: message.substring(0, 30),
                messages: [],
                createdAt: new Date()
            });
            this.saveChatHistory();
            this.renderChatHistory();
        }

        // Add message to current chat
        const currentChat = this.chatHistory.find(c => c.id === this.currentChatId);
        if (currentChat) {
            currentChat.messages.push({ role: 'user', content: message });
            this.saveChatHistory();
        }

        // Show loading indicator
        this.addLoadingIndicator();

        // Send message to backend
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: this.currentChatId
                })
            });

            // Remove loading indicator
            this.removeLoadingIndicator();

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const message = errorData?.error || `API error: ${response.status}`;
                throw new Error(message);
            }

            const data = await response.json();
            if (data.warning) {
                console.warn(data.warning);
            }
            const aiResponse = data.response;

            // Add AI message to UI
            this.addMessageToUI(aiResponse, 'ai');

            // Add AI message to current chat
            if (currentChat) {
                currentChat.messages.push({ role: 'assistant', content: aiResponse });
                this.saveChatHistory();
            }
        } catch (error) {
            this.removeLoadingIndicator();
            console.error('Error:', error);
            const errorMessage = 'Sorry, there was an error processing your request. Please try again.';
            this.addMessageToUI(errorMessage, 'ai');
        }

        // Focus back to input
        this.userInput.focus();
    }

    // Add message to UI
    addMessageToUI(content, role) {
        // Remove welcome message if present
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        messageDiv.appendChild(contentDiv);

        // Add copy button for AI messages
        if (role === 'ai') {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => this.copyToClipboard(content));

            actionsDiv.appendChild(copyBtn);
            messageDiv.appendChild(actionsDiv);
        }

        this.messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        this.scrollToBottom();
    }

    // Add loading indicator
    addLoadingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        messageDiv.id = 'loadingIndicator';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content loading';

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }

        contentDiv.appendChild(typingDiv);
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);

        this.scrollToBottom();
    }

    // Remove loading indicator
    removeLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            // Optional: Show a toast notification
            console.log('Copied to clipboard');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    // Start a new chat
    startNewChat() {
        this.messages = [];
        this.currentChatId = null;
        this.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to ChatBot</h2>
                <p>Start a conversation by typing your message below</p>
            </div>
        `;
        this.userInput.value = '';
        this.userInput.focus();
    }

    // Scroll to bottom of messages
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 0);
    }

    // Generate unique chat ID
    generateChatId() {
        return Date.now().toString();
    }

    // Save chat history to localStorage
    saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    }

    // Load chat history from localStorage
    loadChatHistory() {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
            this.renderChatHistory();
        }
    }

    // Render chat history in sidebar
    renderChatHistory() {
        this.chatHistoryContainer.innerHTML = '';

        // Show latest chats first
        const sortedChats = [...this.chatHistory].reverse();

        sortedChats.forEach(chat => {
            const chatItem = document.createElement('button');
            chatItem.className = `chat-history-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            chatItem.textContent = chat.title;
            chatItem.addEventListener('click', () => this.loadChat(chat.id));

            this.chatHistoryContainer.appendChild(chatItem);
        });
    }

    // Load a chat from history
    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.messages = chat.messages;

        // Clear and render messages
        this.messagesContainer.innerHTML = '';

        if (chat.messages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h2>Welcome to ChatBot</h2>
                    <p>Start a conversation by typing your message below</p>
                </div>
            `;
        } else {
            chat.messages.forEach(msg => {
                this.addMessageToUI(msg.content, msg.role === 'assistant' ? 'ai' : 'user');
            });
        }

        // Update active state
        this.renderChatHistory();
        this.userInput.focus();
    }
}

// Initialize chat app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
