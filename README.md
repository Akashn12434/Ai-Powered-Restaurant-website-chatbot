# Ai-Powered-Restaurant-website-chatbot
- This project is a full-stack AI-powered restaurant management system designed to modernize dining experiences while simplifying operations for restaurants. The platform features a responsive web interface with interactive sections for menu browsing, online ordering, reservations, and contact forms, ensuring a smooth and engaging customer journey.

- At its core, the system integrates an AI-powered chatbot built with LangChain’s ChatGroq and the open-source LLaMA 3.3-70B model, enabling customers to make real-time menu queries, receive instant responses to FAQs, and enjoy personalized assistance.

- The stack combines ReactJS (frontend), Django REST Framework (backend), MySQL (database), and Docker (deployment), delivering a scalable, efficient, and intelligent solution that empowers restaurants to operate seamlessly while offering guests a next-generation AI-assisted dining experience.

## 📽️ Demo Video

![Demo Video](videos/demo.gif)

👉 [Watch Full Demo](videos/demo.mp4)

## Features
🍽️ Menu Management – Categories & items with images, prices, and availability

🛒 Order Management – Customers can place and track food orders

📅 Table Reservations – Time-slot based booking system

🤖 AI Chatbot – Interactive assistant for quick queries, FAQs, and booking help

👨‍🍳 Chef Profiles – Showcase restaurant chefs with images and expertise

⭐ Customer Reviews – Collect and display ratings & feedback

🎁 Special Offers – Highlight promotions and discounts

📍 Location & Contact – Multi-location support and contact form

🛠️ Admin Panel – Manage menu, orders, bookings, offers, and more

## Implementation Features
🍽️ Menu Management

  - Dynamic menu browsing with categories (starters, main course, desserts, beverages).
  
  - Search & filter options (by cuisine, price, availability).
  
  - AI-powered recommendations based on user preferences.
  
  - Real-time updates – changes in backend reflect instantly on frontend.

🛒 Ordering System

   - Add to Cart with quantity selection.
   
   - Customizations (e.g., spice level, add/remove toppings).
   
   - Order summary & confirmation before checkout.
   
   - Payment integration (PayPal / Stripe ready).
   
   - Order tracking for customers.
   
   - AI Chatbot-assisted smart ordering (e.g., “Order 2 pizzas and a Coke”).

📅 Booking & Reservations

  - Table reservation system with date, time, and number of guests.
  
  - Availability check in real-time.
  
  - Instant confirmation & cancellation options.
  
  - AI Chatbot-enabled booking assistant (e.g., “Book a table for 4 at 8 PM tomorrow”).
  
  - Customer notifications via email/SMS for confirmations.

## Tech Stack
- **Backend:** Python, Django  with Django REST Framework
- **Database:** MYSQL
- **Frontend** Html,Css,Javascript,React.js
- **Generative AI:** LangChain, ChatGroq, LLaMA 3.3-70B
- **Containerization:** Docker & Docker Compose



## Technical Architecture

The system follows a modular full-stack architecture that seamlessly integrates frontend, backend, database, AI, and deployment layers:

- **Frontend (ReactJS):** → Provides a responsive web interface with dynamic sections for menu browsing, reservations, ordering, and customer interaction.

- **Backend (Django REST Framework):** → Exposes RESTful APIs for handling menu data, reservations, chat interactions, and order management.

- **Database (MySQL):** → Stores structured data including user details, reservations, order history, and chatbot interactions.

- **AI Layer (LangChain + ChatGroq + LLaMA 3.3-70B):** → Powers the intelligent chatbot, enabling natural language queries, real-time menu search, and FAQ handling.

- **Deployment (Docker):** → Ensures containerized, portable, and scalable deployment across environments.

## 🚀 API Endpoints

### 🍽️ Restaurant Management

| Method    | Endpoint             | Description                |
| --------- | -------------------- | -------------------------- |
| GET, POST | /menu-categories/    | Manage menu categories     |
| GET, POST | /menu-items/         | Manage food & drink items  |
| GET, POST | /locations/          | Restaurant locations       |
| GET, POST | /chefs/              | Chef profiles              |
| GET, POST | /reviews/            | Customer reviews           |
| GET, POST | /faqs/               | Frequently asked questions |
| GET, POST | /special-offers/     | Promotions & discounts     |
| GET, POST | /time-slots/         | Available booking slots    |
| GET, POST | /table-bookings      | Manage reservations        |
| GET, POST | /orders/             | Place & manage orders      |
| GET, POST | /contact-messages`   | Contact form submissions   |

###  🔍 AI Assistant Endpoints

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| GET    | /api/                    | All registered routes from router   |
| POST   | /api/ai/chat/            | Send a chat message to the AI       |
| GET    | /api/ai/quick-options/   | Retrieve predefined quick responses |
| GET    | /api/ai/history/         | Fetch user’s chat history           |
| GET    | /api/ai/test/            | Test API key / AI connection health |

---

## 🚀 Quick Start with Docker

## Setup and Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/Akashn12434/Ai-Powered-Restaurant-website-chatbot.git    
    cd Ai-Powered-Restaurant-website-chatbot
    ```

2. **Install dependencies**:
   - Install the required Python packages:   
    ```bash
    pip install -r requirements.txt
    ```
3. **Running the Application Using Docker Setup**:
   - Build, run with Docker Compose: 
    ```bash
    docker-compose up --build
    ```
  
1. **Run Migrations and create superuser**:
   - Open a new terminal window and run:
    ```bash
    docker-compose exec web python manage.py makemigrations
    docker-compose exec web python manage.py migrate
    docker-compose exec web python manage.py createsuperuser
    ```

4.**Access it On running**:
  
   - Admin Interface:
   ```bash
   http://localhost:8000/admin/
   ```
