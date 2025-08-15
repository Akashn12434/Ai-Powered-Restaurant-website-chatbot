// Updated ChatBot.js with Back to Main Menu functionality
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, ArrowLeft, RotateCcw } from 'lucide-react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Organized quick actions
  const quickActions = [
    {
      icon: '🍽️',
      title: 'Show me the menu',
      subtitle: 'Browse our delicious dishes',
      message: 'Show me your menu and popular dishes'
    },
    {
      icon: '📅',
      title: 'Book a table',
      subtitle: 'Reserve your dining experience',
      message: 'How can I book a table at your restaurant?'
    },
    {
      icon: '🕒',
      title: 'What are your hours?',
      subtitle: 'Opening times and locations',
      message: 'What are your restaurant hours and locations?'
    },
    {
      icon: '📞',
      title: 'Contact information',
      subtitle: 'Get in touch with us',
      message: 'How can I contact the restaurant?'
    },
    {
      icon: '🎉',
      title: "Today's specials",
      subtitle: 'Current offers and promotions',
      message: 'What special offers do you have today?'
    },
    {
      icon: '👨‍🍳',
      title: 'About our chefs',
      subtitle: 'Meet our culinary team',
      message: 'Tell me about your chefs and their specialties'
    },
    {
      icon: '🚚',
      title: 'Order Online',
      subtitle: 'Food delivery to your door',
      message: 'I want to order food online for delivery'
},
    
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: 'assistant',
        content: "Hello! Welcome to RAJAMAHAL Restaurant! 🍽️\n\nI'm your AI assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }]);
      setShowQuickOptions(true);
      setConversationStarted(false);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowQuickOptions(false);
    setConversationStarted(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (!sessionId && data.session_id) {
          setSessionId(data.session_id);
        }

        const assistantMessage = {
          type: 'assistant',
          content: data.response,
          timestamp: data.timestamp
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our restaurant directly.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action.message);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const resetToMainMenu = () => {
    setShowQuickOptions(true);
    setConversationStarted(false);
    setMessages([{
      type: 'assistant',
      content: "Hello! Welcome back to RAJAMAHAL Restaurant! 🍽️\n\nI'm your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    }]);
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setShowQuickOptions(true);
    setConversationStarted(false);
    setInputMessage('');
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="chat-toggle-container">
          <button
            className="chat-toggle-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
          >
            <MessageCircle size={24} />
          </button>
          <div className="chat-preview-badge">
            Rajamahal Assistant
            <div className="chat-preview-subtitle">Always here to help!</div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className={`chat-container ${isMinimized ? 'minimized' : ''}`}>
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div className="header-text">
                <h4>RAJAMAHAL AI Assistant</h4>
                <span className="chat-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <div className="chat-header-controls">
              {/* Back to Main Menu Button */}
              {conversationStarted && !showQuickOptions && (
                <button
                  className="chat-control-btn back-to-main-btn"
                  onClick={resetToMainMenu}
                  aria-label="Back to main menu"
                  title="Back to main menu"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              
              {/* New Chat Button */}
              {conversationStarted && (
                <button
                  className="chat-control-btn new-chat-btn"
                  onClick={startNewChat}
                  aria-label="Start new chat"
                  title="Start new chat"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              
              <button
                className="chat-control-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label="Minimize chat"
              >
                <Minimize2 size={16} />
              </button>
              <button
                className="chat-control-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        {formatMessage(message.content)}
                      </div>
                      <div className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="message assistant">
                    <div className="message-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions Grid */}
                {showQuickOptions && (
                  <div className="quick-actions-container">
                    <div className="quick-actions-header">
                      <h5>Quick Actions:</h5>
                    </div>
                    <div className="quick-actions-grid">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          className="quick-action-card"
                          onClick={() => handleQuickAction(action)}
                          disabled={isLoading}
                        >
                          <div className="action-icon">{action.icon}</div>
                          <div className="action-content">
                            <div className="action-title">{action.title}</div>
                            <div className="action-subtitle">{action.subtitle}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show quick actions button in conversation */}
                {conversationStarted && !showQuickOptions && !isLoading && (
                  <div className="back-to-options-container">
                    <button
                      className="back-to-options-btn"
                      onClick={resetToMainMenu}
                    >
                      <ArrowLeft size={16} />
                      Back to Quick Actions
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form className="chat-input-form" onSubmit={handleInputSubmit}>
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={isLoading || !inputMessage.trim()}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="chat-input-footer">
                  <small>Powered by AI • Ask me anything about RAJAMAHAL!</small>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;