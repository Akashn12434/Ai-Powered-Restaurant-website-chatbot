
import React, { useState, useEffect, useRef } from 'react';
 // Added User, Star, HelpCircle for potential future use
import { ChefHat, MapPin, Calendar,  ShoppingCart,  Phone, Mail,  Star } from 'lucide-react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Main App Component
const App = () => {
  const getFoodImage = (dishName) => {
  const name = dishName.toLowerCase();
  const foodImages = {
 'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  
    // Add more as needed
  };

};

const [availableSlots, setAvailableSlots] = useState([]);

  // Refs for scrolling - Added new refs for new sections
  const homeRef = useRef(null);
similarly for  menuRef, offersRef, locationsRef, bookTableRef, orderOnlineRef, ourChefsRef, reviewsRef, faqRef, aboutUsRef, contactUsRef

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    let ref;
    switch (sectionId) {
      case 'home': ref = homeRef; break;
      similary for menu, offers, locations, book-table, order-online, our-chefs, reviews, faq, about-us, contact-us   
      default: return;
    }
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsNavCollapsed(true); // Collapse navbar after clicking a link
  };

const [menuCategories, setMenuCategories] = useState([]);
similarly for menuItems, locations, chefs, reviews, faqs


useEffect(() => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Menu categories
  fetch(`${API_BASE_URL}/api/menu-items/by_category/`)
    .then(response => response.json())
    .then(data => setMenuCategories(data))
    .catch(error => console.error('Error loading menu:', error));
similary for the menu items, locations, chefs, reviews, faqs, and special offers
}, []);


const handleBookingSubmit = async (e) => {

};

  // State for order online form (simplified)

const handleAddItemToOrder = (item) => {
 
};

  
const handleOrderSubmit = async (e) => {
  e.preventDefault();


  const orderData = {
    customer_name: customerInfo.name,
    //and many more fields
    }))
  };

  try {
    console.log("📡 Sending order to backend...");
    const res = await fetch("http://localhost:8000/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });


    const data = await res.json();
    console.log("✅ Order created successfully:", data);
    setOrderId(data.id);

    if (paymentMethod === "cash") {
    
      alert("✅ Order placed with Cash on Delivery.");
      resetOrderForm();
    } else if (paymentMethod === "paypal") {
     
      const totalAmountUSD = parseFloat(data.total_amount).toFixed(2);
     
      alert("✅ Order placed! Please complete payment via PayPal.");
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        renderPayPalButton(data.id, totalAmountUSD);
      }, 100);
    }
  } 
};

const resetOrderForm = () => {
  
};
const renderPayPalButton = (backendOrderId, totalAmount) => {
 
  const loadPayPalScript = () => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        console.log("✅ PayPal SDK already loaded");
        resolve();
        return;
      }

      // Enhanced SDK URL with debug and disable-funding
     
    });
  };

  loadPayPalScript()
    .then(() => {
      console.log("🎯 Initializing PayPal Buttons...");

      window.paypal.Buttons({
      display color option
        }),

        createOrder: function (data, actions) {
  
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalAmount,
                currency_code: 'USD'
              },
              description: `Restaurant Order #${backendOrderId}`
            }],
            intent: 'CAPTURE'
          }).then(function(orderId) {
            console.log("✅ PayPal Order Created with ID:", orderId);
            return orderId;
          }).catch(function(error) {
            console.error("❌ Error creating PayPal order:", error);
            throw error;
          });
        },     
        onApprove: function (data, actions) {
 
};

  return (
      <>
      <Routes>
      {/* Shared layout route */}
      <Route path="/" element={<Layout scrollToSection={scrollToSection} />}>
        {/* Homepage */}
        <Route
          index
          element={
            <>
  

      <main>
       {/* Hero Section - IMPROVED */}

        {/* Menu Section */}
       <section ref={menuRef} className="py-5 bg-light">
  <div className="container">
    <h2 className="display-4 fw-bold text-center text-dark mb-5">Our Delicious Menu</h2>
    {menuCategories.map((category, index) => (
      <div key={index} className="card p-4 mb-5 shadow-lg border-0">
        <h3 className="h2 fw-semibold text-dark text-center mb-4 pb-3 border-bottom border-danger d-inline-block mx-auto">
          {category.name}
        </h3>

        <div className="scroll-wrapper">
          {/* Left arrow */}
          <div
            className="scroll-arrow scroll-left"
            onClick={() => scrollRefs.current[index]?.current.scrollBy({ left: -300, behavior: 'smooth' })}
          >
            ‹
          </div>

          {/* Scrollable cards */}
      

          {/* Right arrow */}
        
        </div>
      </div>
    ))}
  </div>
</section>

 
    {/* Book a Table Section */}
<section ref={bookTableRef} className="py-5 bg-red-50">
 name,email address, phone number,dinning aera, date, time,avaibale time slots,  no of guests, special requests
    { date restriction given from today onwards like previous cant disable}
        
        <div className="col-12">
  
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Checking availability...</p>
            </div>
          ) : (
            <div className="row g-2">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="col-md-6 col-lg-4">
                  <div 
                    className={`card p-3 cursor-pointer ${
                      bookingDetails.time === slot.time ? 'border-primary bg-primary bg-opacity-10' : 
                      slot.can_accommodate ? 'border-success' : 'border-danger bg-light'
                    }`}
                    onClick={() => {
                      if (slot.can_accommodate) {
                        setBookingDetails(prev => ({ ...prev, time: slot.time }));
                      }
                    }}
                    style={{ 
                      cursor: slot.can_accommodate ? 'pointer' : 'not-allowed',
                      opacity: slot.can_accommodate ? 1 : 0.6 
                    }}
                  >
                  
                    {bookingDetails.time === slot.time && (
                      <div className="text-center mt-1">
                        <small className="text-primary">✓ Selected</small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && availableSlots.length === 0 && bookingDetails.date && (
            <div className="alert alert-warning mt-2">
              No time slots available for the selected date and guest count.
            </div>
          )}
        </div>
  
        <div className="col-12 text-center">
          <button
            type="submit"
            className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mx-auto"
            disabled={loading || !bookingDetails.time}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Calendar size={24} className="me-2" />
                <span>Confirm Booking</span>
              </>
            )}
          </button>
          {!bookingDetails.time && bookingDetails.date && (
            <small className="text-muted mt-2 d-block">Please select an available time slot</small>
          )}
        </div>
      </form>
    </div>
  </div>
</section>

        {/* Order Online Section */}
        <section ref={orderOnlineRef} className="py-5 bg-light">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">Order Online</h2>
            <div className="card p-5 shadow-lg border-light">
              <div className="mb-4">
                <h3 className="h4 fw-semibold text-dark mb-3">Your Order</h3>
                {orderItems.length === 0 ? (
                  <p className="text-muted">Your cart is empty. Add some delicious items from the menu!</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {orderItems.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-3">
                        <span className="h5 mb-0 text-dark">{item.name}</span>
                        <div>
                          <span className="h5 fw-bold text-danger me-3">${parseFloat(item.price).toFixed(2)}</span>
                          <button
                            onClick={() => handleRemoveItemFromOrder(index)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="text-end mt-4">
                  <h4 className="h3 fw-bold text-dark">
          
                    Total: ${orderItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '').replace(',', '')), 0).toFixed(2)}
                  </h4>
                </div>
              </div>

              <h3 className="h4 fw-semibold text-dark mb-3">Delivery Information</h3>
              <form onSubmit={handleOrderSubmit} className="row g-4">
               
              <div className="col-12">
  <label className="form-label fw-bold">Payment Method</label>
  <select
    className="form-select"
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
  >
    <option value="cash">Cash on Delivery</option>
    <option value="paypal">Pay with PayPal</option>
  </select>
</div>


        {/* ALWAYS render PayPal container - don't make it conditional */}
<div className="col-12 text-center mt-3">
  <div id="paypal-button-container" style={{minHeight: '50px'}}></div>
</div>
              </form>
            </div>
          </div>
        </section>
similarly for About Us, Our Chefs, Reviews, FAQ, Contact Us sections
      </main>

     
    </>
          }
        />

        {/* About Us Full Page */}
        <Route path="about" element={<AboutUsPage />} />
      
      <Route path="/menu" element={<MenuPage menuCategories={menuCategories} />} />
      <Route path="/contact" element={<ContactUsPage />} />
      
      </Route>
      
    </Routes>
    <ChatBot />
      </>
  );
};

export default App;

2. components/ChatBot.js
// Updated ChatBot.js with Back to Main Menu functionality
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, ArrowLeft, RotateCcw } from 'lucide-react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  any many more. 

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Organized quick actions
  const quickActions = [
    {
      icon: '🍽️',
      title: 'Show me the menu',
      subtitle: 'Browse our delicious dishes',
      message: 'Show me your menu and popular dishes'
    },
   and many More . 
    
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
 
  };

  const startNewChat = () => {
   
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
           
              )}
              
              {/* New Chat Button */}
           
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
               
                ))}

                {/* Loading indicator */}
           

                {/* Quick Actions Grid */}
                {showQuickOptions && (
             
                )}

                {/* Show quick actions button in conversation */}
                {conversationStarted && !showQuickOptions && !isLoading && (
             
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form className="chat-input-form" onSubmit={handleInputSubmit}>
              
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;

3.services/AIServices.js
class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.sessionId = localStorage.getItem('ai_session_id');
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Store session ID for future requests
      if (data.session_id && !this.sessionId) {
        this.sessionId = data.session_id;
        localStorage.setItem('ai_session_id', data.session_id);
      }

      return data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async getQuickOptions() {
  
  }

  async getChatHistory() {
  
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('ai_session_id');
  }
}

export default new AIService();

4. pages/Layout.js

  const handleNavClick = (section) => {
  
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">

        <div className="container-fluid">
          <button
            className="navbar-brand d-flex align-items-center btn btn-link"
            onClick={() => handleNavClick('home')}
            style={{ textDecoration: 'none', color: 'inherit', padding: 0 }}
          >
            <ChefHat className="text-red-600 me-2" size={32} />
            <span className="h3 fw-bold text-dark mb-0">RAJAMAHAL</span>
          </button>


          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('home')}>Home</button>
              </li>
                 <li className="nav-item">
                <Link className="nav-link" to="/menu">Menu</Link>
              </li>
             and many more. 
      </nav>

      {/* Page Content */}
      <div style={{ paddingTop: '100px' }}>
        <Outlet />
      </div>

     {/* Footer */}
           <footer className="bg-dark text-light py-5">
          
     
             
     
                 {/* Social Media */}
               
           </footer>
    </div>
  );
};

export default Layout;
