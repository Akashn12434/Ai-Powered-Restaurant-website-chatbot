# Ai-Powered-Restaurant-website-chatbot
This project is developed using Django Rest Framework as an internship assignment. A Django REST Framework API for storing and searching paragraphs by words. Users can store multiple paragraphs of text and search for specific words to find the top 10 paragraphs containing those words.

## Features
- User authentication with token-based auth
- Store multiple paragraphs of text
- Word tokenization and indexing
- Search paragraphs by words
- Top 10 results ordered by word frequency
- PostgreSQL database with proper indexing
- Swagger/OpenAPI documentation
- Docker support
- Comprehensive test coverage

## Technical Implementation:

 - Custom User model with UUID primary keys
 - Paragraph and WordIndex models with relationships
 - RESTful API design with proper HTTP methods
 - Input validation and error handling
 - Swagger/OpenAPI documentation
 - Docker and Docker Compose setup
 - Comprehensive test coverage

## Tech Stack
- **Backend:** Django  with Django REST Framework
- **Database:** PostgreSQL 17
- **Authentication:** Token-based authentication
- **Documentation:** drf-spectacular (Swagger/OpenAPI)
- **Containerization:** Docker & Docker Compose

## Architecture
The API follows these design patterns:

- **Models:** Custom User, Paragraph, WordIndex with proper relationships
- **Views:** Function-based and class-based views with proper permissions
- **Serializers:** Comprehensive validation and data transformation
- **Utils:** Reusable text processing functions
- **Tests:** Unit tests for all major functionality

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
    git clone https://github.com/Akashn12434/Codemonk---Backend-Intern-Assignment-.git
    cd Codemonk---Backend-Intern-Assignment-
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
   - Swagger UI:
   ```bash
   http://localhost:8000/api/docs/
   ```
   - Admin Interface:
   ```bash
   http://localhost:8000/admin/
   ```
