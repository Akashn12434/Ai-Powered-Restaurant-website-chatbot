
import React, { useState, useEffect, useRef } from 'react';
 // Added User, Star, HelpCircle for potential future use
import { ChefHat, MapPin, Calendar,  ShoppingCart,  Phone, Mail,  Star } from 'lucide-react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AboutUsPage from './pages/AboutUsPage'; // Import the About Us page
import Layout  from './pages/Layout'; 
import MenuPage from './pages/MenuPage';
import ContactUsPage from './pages/ContactUsPage';
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import {FaWhatsapp }from "react-icons/fa";
import ChatBot from './components/AIAssistant/ChatBot';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Main App Component
const App = () => {
  const getFoodImage = (dishName) => {
  const name = dishName.toLowerCase();
  const foodImages = {
 'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'margherita': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
  'pepperoni': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
  
  // Main Courses - Meat & Poultry
  'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
  'grilled chicken': 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&h=300&fit=crop',
 
   'roti curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'paneer tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
  'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  'chow mein': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  'hot pot': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',

  
  // Appetizers & Sides
  'nachos': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop',
  'wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
  'fries': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop',
  
    // Add more as needed
  };
  
  for (let key in foodImages) {
    if (name.includes(key)) {
      return foodImages[key];
    }
  }
  
};





const [availableSlots, setAvailableSlots] = useState([]);

const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // For Bootstrap's responsive navbar

  // Refs for scrolling - Added new refs for new sections
  const homeRef = useRef(null);
  const menuRef = useRef(null);
  const offersRef = useRef(null);
  const locationsRef = useRef(null);
  const bookTableRef = useRef(null);
  const orderOnlineRef = useRef(null);
  const ourChefsRef = useRef(null); // New ref
  const reviewsRef = useRef(null); // New ref
  const faqRef = useRef(null); // New ref
  const aboutUsRef = useRef(null); // Ref for renamed "Our Story" section
  const contactUsRef = useRef(null); // New ref

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    let ref;
    switch (sectionId) {
      case 'home': ref = homeRef; break;
      case 'menu': ref = menuRef; break;
      case 'offers': ref = offersRef; break;
      case 'locations': ref = locationsRef; break;
      case 'book-table': ref = bookTableRef; break;
      case 'order-online': ref = orderOnlineRef; break;
      case 'our-chefs': ref = ourChefsRef; break; // New case
      case 'reviews': ref = reviewsRef; break;     // New case
      case 'faq': ref = faqRef; break;             // New case
      case 'about-us': ref = aboutUsRef; break;   // New case (for renamed section)
      case 'contact-us': ref = contactUsRef; break; // New case
      default: return;
    }
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsNavCollapsed(true); // Collapse navbar after clicking a link
  };

const [menuCategories, setMenuCategories] = useState([]);
const [menuItems, setMenuItems] = useState([]);
const [locations, setLocations] = useState([]);
const [chefs, setChefs] = useState([]);
const [reviews, setReviews] = useState([]);
const [faqs, setFaqs] = useState([]);

const [specialOffers, setSpecialOffers] = useState([]);

  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    message: '',
    location: '' 
  });



useEffect(() => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Menu categories
  fetch(`${API_BASE_URL}/api/menu-items/by_category/`)
    .then(response => response.json())
    .then(data => setMenuCategories(data))
    .catch(error => console.error('Error loading menu:', error));

  // Locations
  fetch(`${API_BASE_URL}/api/locations/`)
    .then(response => {
      console.log('Locations API response status:', response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log("/api/locations returned:", data);
      if (data && Array.isArray(data.results)) {
        setLocations(data.results);
      } else if (Array.isArray(data)) {
        setLocations(data);
      } else {
        setLocations([]);
      }
    })
    .catch(error => {
      console.error('Error loading locations:', error);
      setLocations([]);
    });

  // Chefs
  fetch(`${API_BASE_URL}/api/chefs/`)
    .then(response => response.json())
    .then(data => {
      console.log("CHEF API RESPONSE:", data);
      if (data && Array.isArray(data.results)) {
        setChefs(data.results);
      } else if (Array.isArray(data)) {
        setChefs(data);
      } else {
        setChefs([]);
      }
    })
    .catch(error => {
      console.error('Error loading chefs:', error);
      setChefs([]);
    });

  // FAQs
  fetch(`${API_BASE_URL}/api/faqs/`)
    .then(response => response.json())
    .then(data => {

      console.log("/api/faqs returned:", data);
      if (data && Array.isArray(data.results)) {
        setFaqs(data.results);
      } else if (Array.isArray(data)) {
        setFaqs(data);
      } else {
        setFaqs([]);
      }
    })
    .catch(error => {
      console.error('Error loading faqs:', error);
      setFaqs([]);
    });

    

  // Reviews
  fetch(`${API_BASE_URL}/api/reviews/`)
    .then(response => response.json())
    .then(data => {
      console.log("/api/reviews returned:", data);
      if (data && Array.isArray(data.results)) {
        setReviews(data.results);
      } else if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    })
    .catch(error => {
      console.error('Error loading reviews:', error);
      setReviews([]);
    });

  


  // Special Offers
  fetch(`${API_BASE_URL}/api/special-offers/`)
    .then(response => response.json())
    .then(data => {
      console.log("/api/special-offers returned:", data);
      if (data && Array.isArray(data.results)) {
 
       setSpecialOffers(data.results);
      } else if (Array.isArray(data)) {
        setSpecialOffers(data);
      } else {
        setSpecialOffers([]);
      }
    })
    .catch(error => {
      console.error('Error loading offers:', error);
      setSpecialOffers([]);
    });

  

}, []);
useEffect(() => {
  if (bookingDetails.date && bookingDetails.guests && bookingDetails.location) {
    fetchAvailableSlots();
  }
}, [bookingDetails.date, bookingDetails.guests, bookingDetails.location]);


const fetchAvailableSlots = async () => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:8000/api/time-slots/available_slots/?date=${bookingDetails.date}&location=${bookingDetails.location}&guests=${bookingDetails.guests}`
    );
    const data = await response.json();
    setAvailableSlots(data);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    setAvailableSlots([]);
  } finally {
    setLoading(false);
  }
};

  const handleBookingChange = (e) => {
  const { name, value } = e.target;
  setBookingDetails(prev => ({ ...prev, [name]: value }));
  
  // Reset time when date/guests/location changes
  if (['date', 'guests', 'location'].includes(name)) {
    setBookingDetails(prev => ({ ...prev, time: '' }));
  }
};

const handleBookingSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('http://localhost:8000/api/table-bookings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert(`🎉 Booking Confirmed! 
      
Booking ID: #${data.id}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}
Guests: ${bookingDetails.guests}

Check your email for confirmation details!`);
      
      // Reset form
      setBookingDetails({
        name: '', email: '', phone: '', date: '', time: '', guests: 1, message: '', location: 1
      });
      setAvailableSlots([]);
    } else {
      // Show specific error message
      const errorMessage = data.non_field_errors?.[0] || data.detail || "Error submitting booking. Please try again.";
      alert(errorMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error submitting booking. Please try again.");
  } finally {
    setLoading(false);
  }
};
 

  // State for order online form (simplified)
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // default
  const [orderId, setOrderId] = useState(null); // for PayPal capture

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const checkPayPalContainer = () => {
  const container = document.getElementById("paypal-button-container");
  console.log("🔍 PayPal Container Check:");
  console.log("- Container exists:", !!container);
  console.log("- Container innerHTML:", container?.innerHTML);
  console.log("- Container visible:", container?.offsetParent !== null);
  return container;
};


const handleAddItemToOrder = (item) => {
   console.log("🔍 Adding item to order:", item); 
  const orderItem = {
    // For backend submission:
    menu_item: item.id, // integer menu item ID
    quantity: 1,
    special_instructions: '',
    
    // For UI display (your cart shows these):
    name: item.name,        // ✅ ADD THIS - needed for UI display
    price: item.price       // ✅ ADD THIS - needed for UI display
  };
  setOrderItems(prev => [...prev, orderItem]);
};

  const handleRemoveItemFromOrder = (index) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

const handleOrderSubmit = async (e) => {
  e.preventDefault();
  console.log("📝 Order submission started...");
  console.log("🛒 Order Items:", orderItems);
  console.log("💳 Payment Method:", paymentMethod);

  const orderData = {
    customer_name: customerInfo.name,
    customer_email: customerInfo.email,
    customer_phone: customerInfo.phone,
    delivery_address: customerInfo.address,
    special_instructions: "",
     payment_method: paymentMethod === "cash" ? "cod" : "paypal",
    items: orderItems.map(item => ({
      menu_item: item.menu_item,
      quantity: item.quantity || 1,
      special_instructions: item.special_instructions || ''
    }))
  };

  console.log("📦 Order Data being sent:", orderData);

  try {
    console.log("📡 Sending order to backend...");
    const res = await fetch("http://localhost:8000/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    console.log("📥 Backend response status:", res.status);
    console.log("📥 Backend response ok:", res.ok);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Backend error response:", errorData);
      throw new Error(`Order creation failed: ${JSON.stringify(errorData)}`);
    }

    const data = await res.json();
    console.log("✅ Order created successfully:", data);
    setOrderId(data.id);

    if (paymentMethod === "cash") {
      console.log("💵 Cash on Delivery selected");
      alert("✅ Order placed with Cash on Delivery.");
      resetOrderForm();
    } else if (paymentMethod === "paypal") {
      console.log("💳 PayPal payment selected");
      const totalAmountUSD = parseFloat(data.total_amount).toFixed(2);
      
      console.log("💰 Total Amount USD:", totalAmountUSD);
      
      alert("✅ Order placed! Please complete payment via PayPal.");
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        renderPayPalButton(data.id, totalAmountUSD);
      }, 100);
    }
  } catch (err) {
    console.error("❌ Order submission error:", err);
    alert(`Error placing order: ${err.message}`);
  }
};


const resetOrderForm = () => {
  setOrderItems([]);
  setCustomerInfo({ name: "", email: "", address: "", phone: "" });
  setPaymentMethod("cash");
  setOrderId(null);
};
const renderPayPalButton = (backendOrderId, totalAmount) => {
  console.log("🚀 renderPayPalButton called with:", { backendOrderId, totalAmount });
  
  const loadPayPalScript = () => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        console.log("✅ PayPal SDK already loaded");
        resolve();
        return;
      }

      console.log("📦 Loading PayPal SDK...");
      const script = document.createElement("script");
      // Enhanced SDK URL with debug and disable-funding
      script.src = "https://www.paypal.com/sdk/js?client-id=Ab2MKwQQORsWLMBa91T1EIl9B1iYhwvgBpDrV94Vvevr1t1jh_r3v7XdkembdRvAXNkKRhjlltet1FIr&currency=USD&intent=capture&debug=true&disable-funding=credit,card";
      script.onload = () => {
        console.log("✅ PayPal SDK loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.error("❌ PayPal SDK failed to load");
        reject(new Error("PayPal SDK failed to load"));
      };
      document.body.appendChild(script);
    });
  };

  loadPayPalScript()
    .then(() => {
      console.log("🎯 Initializing PayPal Buttons...");
      
      // Clear any existing PayPal buttons first
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = '';
        console.log("🧹 Cleared existing PayPal container");
      }

      window.paypal.Buttons({
        style: {
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          layout: 'vertical'
        },

        createOrder: function (data, actions) {
          console.log("🔨 PayPal createOrder called with amount:", totalAmount);
          console.log("🔨 CreateOrder data:", data);
          
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
          console.log("🎉 PayPal onApprove triggered!");
          console.log("📋 Approval data:", data);
          console.log("🧾 PayPal Order ID:", data.orderID);
          console.log("📤 Backend Order ID to capture:", backendOrderId);

          if (!data.orderID) {
            console.error("❌ No PayPal Order ID received!");
            alert("❌ Payment approval failed - no order ID");
            return;
          }

          return actions.order.capture()
            .then(async function (details) {
              console.log("✅ PayPal Capture Successful!");
              console.log("📊 Captured Details:", details);
              console.log("💰 Payment Status:", details.status);
              console.log("👤 Payer Info:", details.payer);

              try {
                console.log("📡 Sending capture request to backend...");
                console.log("🎯 URL:", `http://localhost:8000/api/orders/${backendOrderId}/paypal-capture/`);
                console.log("📦 Payload:", { paypal_order_id: data.orderID });

                const response = await fetch(`http://localhost:8000/api/orders/${backendOrderId}/paypal-capture/`, {
                  method: "POST",
                  headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                  body: JSON.stringify({ paypal_order_id: data.orderID })
                });

                console.log("📥 Backend Response Status:", response.status);
                console.log("📥 Backend Response OK:", response.ok);

                const captureResult = await response.json();
                console.log("🎯 Backend Response Data:", captureResult);

                if (response.ok) {
                  console.log("🎊 PAYMENT FULLY SUCCESSFUL!");
                  alert("✅ Payment successful! Order confirmed.");
                  resetOrderForm();
                } else {
                  console.error("❌ Backend capture failed:", captureResult);
                  alert(`⚠️ Payment capture failed: ${captureResult.error || 'Unknown error'}`);
                }
              } catch (networkError) {
                console.error("🌐 Network error during backend capture:", networkError);
                alert("⚠️ Network error during payment processing. Please contact support.");
              }
            })
            .catch(function (captureError) {
              console.error("❌ PayPal capture failed:", captureError);
              alert("❌ Payment capture failed. Please try again.");
            });
        },

        onError: function (err) {
          console.error("❌ PayPal Button Error:", err);
          console.error("❌ Error details:", JSON.stringify(err, null, 2));
          alert("❌ PayPal payment error. Please try again or contact support.");
        },

        onCancel: function (data) {
          console.log("❌ PayPal payment cancelled by user:", data);
          alert("Payment was cancelled. You can try again anytime.");
        },

        onInit: function(data, actions) {
          console.log("🎬 PayPal button initialized");
        },

        onClick: function(data, actions) {
          console.log("👆 PayPal button clicked!");
          console.log("👆 Click data:", data);
        }

      }).render("#paypal-button-container")
        .then(function() {
          console.log("✅ PayPal buttons rendered successfully");
        })
        .catch(function(error) {
          console.error("❌ Error rendering PayPal buttons:", error);
          console.error("❌ Render error details:", JSON.stringify(error, null, 2));
          alert("⚠️ Failed to load PayPal buttons. Please refresh and try again.");
        });
    })
    .catch((err) => {
      console.error("❌ PayPal script load error:", err);
      alert("⚠️ Failed to load PayPal. Try again later.");
    });
};


const scrollRefs = useRef([]);
const chefsScrollRef = useRef(null);
const offersScrollRef = useRef(null);
const reviewsScrollRef = useRef(null);
// Initialize scrollRefs with empty refs for each menu category
if (scrollRefs.current.length !== menuCategories.length) {
  scrollRefs.current = menuCategories.map((_, i) => scrollRefs.current[i] ?? React.createRef());
}
  return (
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
<section ref={homeRef} className="hero-section">
  <div className="hero-overlay"></div>
  <div className="container text-center position-relative z-1">
    <h2 className="display-3 fw-bold mb-4">
      Experience Culinary Excellence
    </h2>
    <p className="lead mb-5">
      Savor exquisite flavors crafted with passion and the finest ingredients . 
    </p>
    <button
      onClick={() => scrollToSection('book-table')}
      className="btn btn-primary btn-lg"
    >
      Book Your Table Now
    </button>
  </div>
</section>

        {/* About Us Section (Renamed from Our Story) */}
        <section ref={aboutUsRef} className="py-5 bg-white">
          <div className="container text-center">
            <h2 className="display-4 fw-bold text-dark mb-4">About Us</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
              At RAJAMAHAL, we believe dining is an art. Founded in 20XX, our restaurant is a celebration of global flavors blended with local traditions. Every dish tells a story, and every visit is an unforgettable journey for your taste buds. We pride ourselves on using fresh, locally sourced ingredients and providing an ambiance that's both elegant and welcoming. Our commitment to culinary excellence and warm hospitality defines who we are.
            </p>
          </div>
        </section>

        {/* Our Chefs Section - New Section */}
 
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
          <div ref={scrollRefs.current[index]} className="scroll-container">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} style={{ minWidth: '280px' }}>
                <div className="card h-100 text-center border-light shadow-sm">
                  <img
                    src={item.image || getFoodImage(item.name)}
                    alt={item.name}
                    className="card-img-top img-fluid rounded-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFoodImage(item.name);
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h4 className="card-title h5 fw-semibold text-dark mb-2">{item.name}</h4>
                    <p className="card-text text-muted flex-grow-1">{item.description}</p>
                    <span className="h4 fw-bold text-danger mt-auto">${parseFloat(item.price).toFixed(2)}</span>
                    <button
                      onClick={() => handleAddItemToOrder(item)}
                      className="btn btn-primary mt-3 d-flex align-items-center justify-content-center mx-auto"
                    >
                      <ShoppingCart size={20} className="me-2" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <div
            className="scroll-arrow scroll-right"
            onClick={() => scrollRefs.current[index]?.current.scrollBy({ left: 300, behavior: 'smooth' })}
          >
            ›
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* Special Offers Section */}





        {/* FAQ Section - New Section */}
  
        {/* Locations Section */}
  {/* Locations Section */}


    {/* Book a Table Section */}


        {/* Order Online Section */}
    

        {/* Contact Us Section - New Section */}
  
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
  );
};

export default App;
