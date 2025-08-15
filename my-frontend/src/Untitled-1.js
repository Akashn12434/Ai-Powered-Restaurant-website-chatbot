
import React, { useState, useEffect, useRef } from 'react';
 // Added User, Star, HelpCircle for potential future use
import { ChefHat, MapPin, Calendar, Utensils, Gift, ShoppingCart,  Phone, Mail, User, Star, HelpCircle } from 'lucide-react';

import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import {FaWhatsapp }from "react-icons/fa";

// Main App Component
const App = () => {
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

  // Dummy data for menu items
  const menuCategories = [
    {
      name: "Appetizers",
      items: [
        { name: "Caprese Skewers", description: "Fresh mozzarella, cherry tomatoes, basil, balsamic glaze.", price: "₹350", image: "https://placehold.co/400x300/F0F0F0/333333?text=Caprese" },
       
      ]
    },
    {
      name: "Main Courses",
      items: [
        { name: "Truffle Mushroom Risotto", description: "Creamy Arborio rice with wild mushrooms and truffle oil.", price: "₹850", image: "https://placehold.co/400x300/F0F0F0/333333?text=Risotto" },
        
      ]
    },
   
  ];

  // Dummy data for special offers
  const specialOffers = [
    {
      title: "Weekend Brunch Special",
      description: "Enjoy 20% off on our lavish brunch menu every Saturday and Sunday!",
      image: "https://placehold.co/600x400/F0F0F0/333333?text=Brunch+Offer"
    },
   
  ];

  // Dummy data for locations
  const locations = [
    {
      name: "Downtown Bistro",
      address: "123 Main Street, City Center, Anytown",
      phone: "+91 98765 43210",
      hours: "Mon-Sun: 11 AM - 11 PM",
      mapLink: "https://maps.google.com/?q=123+Main+Street"
    },
   
  ];

  // Dummy data for chefs
  const chefs = [
    { name: "Chef Isabella Rossi", title: "Head Chef", bio: "A master of Italian cuisine with 20+ years of experience, known for her innovative pasta dishes.", image: "https://placehold.co/400x400/F0F0F0/333333?text=Chef+Isabella" },
    
  ];

  // Dummy data for reviews
  const reviews = [
    { name: "Priya S.", rating: 5, comment: "Absolutely loved the Truffle Mushroom Risotto! The ambiance was perfect for a romantic dinner.", date: "July 10, 2025" },
   
  ];

  // Dummy data for FAQ
  const faqs = [
    { question: "Do you offer vegetarian options?", answer: "Yes, we have a wide range of vegetarian and vegan dishes available. Please check our menu for details." },
    { question: "Is reservation required?", answer: "Reservations are highly recommended, especially on weekends and for larger groups, to ensure you get a table." },
   
  ];

  // State for booking form
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
    message: ''
  });

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend
    console.log("Booking Submitted:", bookingDetails);
    alert("Table booking request sent! We will confirm shortly."); // Using alert for demo, replace with custom modal
    setBookingDetails({
      name: '', email: '', phone: '', date: '', time: '', guests: 1, message: ''
    });
  };

  // State for order online form (simplified)
  const [orderItems, setOrderItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const handleAddItemToOrder = (item) => {
    setOrderItems(prev => [...prev, item]);
  };

  const handleRemoveItemFromOrder = (index) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    console.log("Order Submitted:", { orderItems, customerInfo });
    alert("Your order has been placed! Thank you."); // Using alert for demo, replace with custom modal
    setOrderItems([]);
    setCustomerInfo({ name: '', address: '', phone: '' });
  };

  return (
    <div className="App">
      {/* Header (Navbar) */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top py-3">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => scrollToSection('home')}>
            <ChefHat className="text-red-600 me-2" size={32} />
            <span className="h3 fw-bold text-dark mb-0">The Gourmet Hub</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed ? true : false}
            aria-label="Toggle navigation"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse justify-content-end`} id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('home')}>Home</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('menu')}>Menu</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('offers')}>Offers</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('locations')}>Locations</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('book-table')}>Book a Table</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('order-online')}>Order Online</button>
              </li>
              {/* New Navigation Links */}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('our-chefs')}>Our Chefs</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('reviews')}>Reviews</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('faq')}>FAQ</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('about-us')}>About Us</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => scrollToSection('contact-us')}>Contact Us</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section ref={homeRef} className="hero-section" style={{ backgroundImage: "url('https://placehold.co/1920x1080/4A4A4A/FFFFFF?text=Delicious+Food')" }}>
          <div className="hero-overlay"></div>
          <div className="container text-center position-relative z-1">
            <h2 className="display-3 fw-bold mb-4 text-shadow">
              Experience Culinary Excellence
            </h2>
            <p className="lead mb-5 text-shadow">
              Savor exquisite flavors crafted with passion and the finest ingredients.
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
              At The Gourmet Hub, we believe dining is an art. Founded in 20XX, our restaurant is a celebration of global flavors blended with local traditions. Every dish tells a story, and every visit is an unforgettable journey for your taste buds. We pride ourselves on using fresh, locally sourced ingredients and providing an ambiance that's both elegant and welcoming. Our commitment to culinary excellence and warm hospitality defines who we are.
            </p>
          </div>
        </section>

        {/* Our Chefs Section - New Section */}
        <section ref={ourChefsRef} className="py-5 bg-light">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">Meet Our Talented Chefs</h2>
            <div className="row g-4 justify-content-center">
              {chefs.map((chef, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100 text-center shadow-lg border-light">
                    <img src={chef.image} alt={chef.name} className="card-img-top img-fluid rounded-top" style={{ height: '280px', objectFit: 'cover' }} onError={(e)=>{e.target.onerror = null; e.target.src="https://placehold.co/400x400/F0F0F0/333333?text=Chef+Image"}} />
                    <div className="card-body d-flex flex-column">
                      <h3 className="card-title h4 fw-semibold text-dark mb-1">{chef.name}</h3>
                      <p className="card-text text-danger fw-bold mb-3">{chef.title}</p>
                      <p className="card-text text-muted flex-grow-1">{chef.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section ref={menuRef} className="py-5 bg-light">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">Our Delicious Menu</h2>
            {menuCategories.map((category, index) => (
              <div key={index} className="card p-4 mb-5 shadow-lg border-0">
                <h3 className="h2 fw-semibold text-dark text-center mb-4 pb-3 border-bottom border-danger d-inline-block mx-auto">
                  {category.name}
                </h3>
                <div className="row g-4 mt-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="col-md-6 col-lg-4">
                      <div className="card h-100 text-center border-light shadow-sm">
                        <img src={item.image} alt={item.name} className="card-img-top img-fluid rounded-top" style={{ height: '200px', objectFit: 'cover' }} onError={(e)=>{e.target.onerror = null; e.target.src="https://placehold.co/400x300/F0F0F0/333333?text=Dish+Image"}} />
                        <div className="card-body d-flex flex-column">
                          <h4 className="card-title h5 fw-semibold text-dark mb-2">{item.name}</h4>
                          <p className="card-text text-muted flex-grow-1">{item.description}</p>
                          <span className="h4 fw-bold text-danger mt-auto">{item.price}</span>
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
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section ref={offersRef} className="py-5 bg-white">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">Special Offers</h2>
            <div className="row g-4">
              {specialOffers.map((offer, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-lg border-danger border-opacity-25">
                    <img src={offer.image} alt={offer.title} className="card-img-top img-fluid" style={{ height: '250px', objectFit: 'cover' }} onError={(e)=>{e.target.onerror = null; e.target.src="https://placehold.co/600x400/F0F0F0/333333?text=Offer+Image"}} />
                    <div className="card-body">
                      <h3 className="card-title h4 fw-semibold text-danger mb-3">{offer.title}</h3>
                      <p className="card-text text-muted mb-4">{offer.description}</p>
                      <button className="btn btn-primary">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section - New Section */}
        <section ref={reviewsRef} className="py-5 bg-light">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">What Our Guests Say</h2>
            <div className="row g-4 justify-content-center">
              {reviews.map((review, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-lg border-light">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} size={20} className="text-warning me-1" fill="currentColor" />
                        ))}
                        {Array.from({ length: 5 - review.rating }, (_, i) => (
                          <Star key={i + review.rating} size={20} className="text-secondary me-1" />
                        ))}
                      </div>
                      <p className="card-text text-dark flex-grow-1">"{review.comment}"</p>
                      <p className="card-text text-muted small mt-auto mb-0">
                        - {review.name}, <small>{review.date}</small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - New Section */}
        <section ref={faqRef} className="py-5 bg-white">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div key={index} className="accordion-item card shadow-sm mb-3">
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body text-muted">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section ref={locationsRef} className="py-5 bg-light">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-dark mb-5">Our Locations</h2>
            <div className="row g-4 justify-content-center">
              {locations.map((location, index) => (
                <div key={index} className="col-md-6">
                  <div className="card h-100 text-center shadow-lg border-light">
                    <div className="card-body d-flex flex-column align-items-center">
                      <MapPin className="text-red-600 mb-3" size={48} />
                      <h3 className="card-title h4 fw-semibold text-dark mb-2">{location.name}</h3>
                      <p className="card-text text-muted mb-1">{location.address}</p>
                      <p className="card-text text-muted mb-1">Phone: {location.phone}</p>
                      <p className="card-text text-muted mb-3">Hours: {location.hours}</p>
                      <a
                        href={location.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info mt-auto d-flex align-items-center justify-content-center"
                      >
                        <MapPin size={20} className="me-2" />
                        <span>View on Map</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book a Table Section */}
        <section ref={bookTableRef} className="py-5 bg-red-50">
          <div className="container">
            <h2 className="display-4 fw-bold text-center text-red-600 mb-5">Book a Table</h2>
            <div className="card p-5 shadow-lg mx-auto border-danger border-opacity-25" style={{ maxWidth: '700px' }}>
              <form onSubmit={handleBookingSubmit} className="row g-4">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-bold">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bookingDetails.name}
                    onChange={handleBookingChange}
                    className="form-control"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingDetails.email}
                    onChange={handleBookingChange}
                    className="form-control"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingDetails.phone}
                    onChange={handleBookingChange}
                    className="form-control"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="date" className="form-label fw-bold">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingDetails.date}
                    onChange={handleBookingChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="time" className="form-label fw-bold">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={bookingDetails.time}
                    onChange={handleBookingChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="guests" className="form-label fw-bold">Number of Guests</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={bookingDetails.guests}
                    onChange={handleBookingChange}
                    min="1"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="message" className="form-label fw-bold">Special Requests (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={bookingDetails.message}
                    onChange={handleBookingChange}
                    rows="4"
                    className="form-control"
                    placeholder="e.g., window seat, high chair needed"
                  ></textarea>
                </div>
                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg d-flex align-items-center justify-content-center mx-auto"
                  >
                    <Calendar size={24} className="me-2" />
                    <span>Confirm Booking</span>
                  </button>
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
                          <span className="h5 fw-bold text-danger me-3">{item.price}</span>
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
                    Total: ₹{orderItems.reduce((sum, item) => sum + parseFloat(item.price.replace('₹', '')), 0).toFixed(2)}
                  </h4>
                </div>
              </div>

              <h3 className="h4 fw-semibold text-dark mb-3">Delivery Information</h3>
              <form onSubmit={handleOrderSubmit} className="row g-4">
                <div className="col-12">
                  <label htmlFor="customerName" className="form-label fw-bold">Your Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    className="form-control"
                    placeholder="Your Full Name"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label fw-bold">Delivery Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleCustomerInfoChange}
                    rows="3"
                    className="form-control"
                    placeholder="Street, City, Pin Code"
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <label htmlFor="customerPhone" className="form-label fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className="form-control"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div className="col-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg d-flex align-items-center justify-content-center mx-auto"
                  >
                    <ShoppingCart size={24} className="me-2" />
                    <span>Place Order Now</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Us Section - New Section */}
        <section ref={contactUsRef} className="py-5 bg-white">
          <div className="container text-center">
            <h2 className="display-4 fw-bold text-dark mb-5">Contact Us</h2>
            <div className="row justify-content-center g-4">
              <div className="col-md-4">
                <div className="card h-100 shadow-lg border-light">
                  <div className="card-body d-flex flex-column align-items-center">
                    <MapPin className="text-red-600 mb-3" size={48} />
                    <h3 className="h5 fw-bold text-dark mb-2">Our Address</h3>
                    <p className="text-muted mb-0">123 Culinary Lane, Foodie City, 12345</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-lg border-light">
                  <div className="card-body d-flex flex-column align-items-center">
                    <Phone className="text-red-600 mb-3" size={48} />
                    <h3 className="h5 fw-bold text-dark mb-2">Call Us</h3>
                    <p className="text-muted mb-0">+91 12345 67890</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-lg border-light">
                  <div className="card-body d-flex flex-column align-items-center">
                    <Mail className="text-red-600 mb-3" size={48} />
                    <h3 className="h5 fw-bold text-dark mb-2">Email Us</h3>
                    <p className="text-muted mb-0">info@gourmethub.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h4 className="h4 fw-bold text-dark mb-3">Send us a Message</h4>
              <form className="mx-auto" style={{ maxWidth: '600px' }}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows="4" placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light py-5">
        <div className="container">
          <div className="row text-center text-md-start">
            {/* About */}
            <div className="col-md-4 mb-4 mb-md-0">
              <h3 className="h5 fw-bold text-white mb-3">The Gourmet Hub</h3>
              <p className="text-light small">
                Serving the finest culinary experiences since 20XX. Passion for food, dedication to quality.
              </p>
            </div>

            {/* Contact Info (simplified in footer as full section now exists) */}
            <div className="col-md-4 mb-4 mb-md-0">
              <h3 className="h5 fw-bold text-white mb-3">Quick Contact</h3>
              <ul className="list-unstyled text-light small">
                <li className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
                  <Phone size={18} className="text-red-600 me-2" />
                  <span>+91 12345 67890</span>
                </li>
                <li className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
                  <Mail size={18} className="text-red-600 me-2" />
                  <span>info@gourmethub.com</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-md-4">
              <h3 className="h5 fw-bold text-white mb-3">Follow Us</h3>
              <div className="d-flex justify-content-center justify-content-md-start">
                <a href="#" className="text-light me-3" aria-label="Instagram">
                  <FaInstagram size={28} />
                </a>
                <a href="#" className="text-light me-3" aria-label="Facebook">
                  <FaFacebookF size={28} />
                </a>
                <a href="#" className="text-light" aria-label="Twitter">
                  <FaWhatsapp size={28} />
                </a>
              </div>
            </div>
            
          </div>
          <div className="border-top border-secondary mt-4 pt-4 text-center small text-muted">
            &copy; {new Date().getFullYear()} The Gourmet Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;

