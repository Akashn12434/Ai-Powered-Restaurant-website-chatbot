// src/Layout.js
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { Phone, Mail} from 'lucide-react';
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import {FaWhatsapp }from "react-icons/fa";

const Layout = ({ scrollToSection }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (section) => {
    if (location.pathname === '/') {
      scrollToSection?.(section);
    } else {
      // Navigate to home first, then scroll after slight delay
      navigate('/');
      setTimeout(() => scrollToSection?.(section), 50);
    }
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

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={false}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('home')}>Home</button>
              </li>
                 <li className="nav-item">
                <Link className="nav-link" to="/menu">Menu</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('offers')}>Offers</button>
              </li>
                <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
                <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('book-table')}>Book a Table</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('order-online')}>Order Online</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('locations')}>Locations</button>
              </li>
            
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('our-chefs')}>Our Chefs</button>
              </li>
            
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('reviews')}>Reviews</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => handleNavClick('faq')}>FAQ</button>
              </li>
                  <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
          
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div style={{ paddingTop: '100px' }}>
        <Outlet />
      </div>

     {/* Footer */}
           <footer className="bg-dark text-light py-5">
             <div className="container">
               <div className="row text-center text-md-start">
                 {/* About */}
                 <div className="col-md-4 mb-4 mb-md-0">
                   <h3 className="h5 fw-bold text-white mb-3">RAJAMAHAL</h3>
                   <p className="text-light small">
                     Serving the finest culinary experiences since 2020. Passion for food, dedication to quality.
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
                       <span>akashananya2002@gmail.com</span>
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
                 &copy; {new Date().getFullYear()} RAJAMAHAL. All rights reserved.
               </div>
             </div>
           </footer>
    </div>
  );
};

export default Layout;
