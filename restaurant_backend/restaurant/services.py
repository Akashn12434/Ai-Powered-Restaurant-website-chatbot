import json
import uuid
from django.conf import settings

from langchain.schema import HumanMessage, SystemMessage
from .models import ChatSession, ChatMessage, MenuCategory, MenuItem, Location, Chef, SpecialOffer, FAQ


from langchain_groq import ChatGroq
from django.conf import settings

class RestaurantAIService:
    def __init__(self):
        try:
            self.llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=512
            )
        except Exception as e:
            print(f"Error initializing LLM: {e}")
            self.llm = None

    def generate_response(self, prompt: str) -> str:
        """
        Generate a response from Groq LLaMA model using LangChain wrapper.
        """
        if not self.llm:
            return "LLM not initialized"

        response = self.llm.invoke(prompt)
        return response.content



    def get_restaurant_context(self):
        """Get current restaurant data for context"""
        try:
            # Get menu data
            menu_data = []
            categories = MenuCategory.objects.filter(is_active=True).prefetch_related('items')
            
            for category in categories:
                category_items = []
                for item in category.items.filter(is_available=True):
                    category_items.append({
                        'name': item.name,
                        'description': item.description,
                        'price': f"${item.price}" if item.price else "Price on request",
                        'is_vegetarian': item.is_vegetarian,
                        'is_vegan': item.is_vegan,
                        'is_spicy': item.is_spicy,
                        'preparation_time': item.preparation_time
                    })
                
                if category_items:  # Only add categories with items
                    menu_data.append({
                        'category': category.name,
                        'description': category.description,
                        'items': category_items
                    })

            # Get locations
            try:
                locations = list(Location.objects.filter(is_active=True).values('name', 'address', 'phone', 'email', 'hours', 'map_link'))
            except:
                locations = []
            
        
            
            # Get chefs
            try:
                chefs = list(Chef.objects.filter(is_active=True).values('name', 'title', 'specialty', 'bio'))
            except:
                chefs = []
                    
            # Get special offers
            try:
                offers = list(SpecialOffer.objects.filter(is_active=True).values('title', 'description', 'discount_percentage', 'valid_from', 'valid_until'))
            except:
                offers = []
            
            # Get FAQs
            try:
                faqs = list(FAQ.objects.filter(is_active=True).values('question', 'answer'))
            except:
                faqs = []
                
            delivery_info = {
            'available': True,
            'payment_methods': ['Cash on Delivery (COD)', 'Online Payment (PayPal)', 'Credit/Debit Card'],
            'delivery_time': '30-45 minutes',
            'minimum_order': '$15.00',
            'delivery_fee': '$3.00',
            'service_areas': 'Within 5km radius of our locations',
            'ordering_steps': [
        'Visit our Order Online page',
        'Browse menu and select items', 
        'Fill delivery details',
        'Choose payment method (COD or PayPal)',
        'Confirm order for delivery'
    ]
        }
            booking_info = {
            'min_guests': 1,
            'max_guests': 20,
            'time_slots': ['3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM', '11:00 PM'],
            'booking_methods': ['Website booking form', 'Phone call to location']
                }
                

            return {
                'restaurant_name': 'RAJAMAHAL',
                'tagline': 'Experience Culinary Excellence',
                'menu': menu_data,
                'locations': locations,
                'delivery_info': delivery_info,
                'chefs': chefs,
                'special_offers': offers,
                'faqs': faqs,
                'booking_info': booking_info
            }
        except Exception as e:
            print(f"Error getting restaurant context: {e}")
            return {
                'restaurant_name': 'RAJAMAHAL',
                'tagline': 'Experience Culinary Excellence',
                'menu': [],
                'locations': [],
                'chefs': [],
                'special_offers': [],
                'faqs': []
            }

    def create_system_prompt(self, context):
        """Create system prompt with restaurant context"""
        menu_text = ""
        if context['menu']:
            menu_text = "OUR MENU:\n"
            for category in context['menu']:
                menu_text += f"\n{category['category']}:\n"
                for item in category['items']:
                    menu_text += f"• {item['name']} - {item['price']}\n"
                    menu_text += f"  {item['description']}\n"
                    tags = []
                    if item['is_vegetarian']:
                        tags.append("Vegetarian")
                    if item['is_vegan']:
                        tags.append("Vegan")
                    if item['is_spicy']:
                        tags.append("Spicy")
                    if tags:
                        menu_text += f"  [{', '.join(tags)}]\n"
                menu_text += "\n"
        chefs_text = ""
        if context.get('chefs'):
            chefs_text = "\nOUR CHEFS:\n"
            for chef in context['chefs']:
                chefs_text += f"• {chef['name']} - {chef['title']}\n"
                chefs_text += f"  Specialty: {chef['specialty']}\n"
                chefs_text += f"  {chef['bio']}\n\n"
        
        # Add special offers
        offers_text = ""
        if context.get('special_offers'):
            offers_text = "\nCURRENT SPECIAL OFFERS:\n"
            for offer in context['special_offers']:
                discount = int(offer['discount_percentage']) if offer['discount_percentage'] % 1 == 0 else offer['discount_percentage']
                offers_text += f"• {offer['title']} - {discount}% OFF\n"
                offers_text += f"  {offer['description']}\n\n"

        
        # Add locations
        locations_text = ""
        if context.get('locations'):
            locations_text = "\nOUR LOCATIONS:\n"
            for location in context['locations']:
                locations_text += f"• {location['name']}\n"
                locations_text += f"  Address: {location['address']}\n"
        
        delivery_text = ""
        if context.get('delivery_info'):
            info = context['delivery_info']
            delivery_text = f"\nONLINE DELIVERY SERVICE:\n"
            delivery_text += f"✓ Available: {info['delivery_time']}\n"
            delivery_text += f"✓ Payment: {', '.join(info['payment_methods'])}\n"
            delivery_text += f"✓ Min Order: {info['minimum_order']}\n"
            delivery_text += f"✓ Delivery Fee: {info['delivery_fee']}\n\n"
                
        booking_text = ""
        if context.get('locations'):
            booking_text += "\nBOOKING A TABLE:\n"
            booking_text += (
                "To book a table at RAJAMAHAL, visit our website and go to the 'Book a Table' page.\n"
                "You can also call us directly at the phone number for your preferred location:\n\n"
            )
            booking_text += "✓ Minimum guests: 1 person\n"
            booking_text += "✓ Maximum guests: 20 people\n"
            booking_text += "✓ Available time slots: 3:00 PM, 5:00 PM, 7:00 PM, 9:00 PM, 11:00 PM\n"
            for location in context['locations']:
                booking_text += f"* **{location['name']}**: {location['phone']}\n"

        contact_text = ""
        if context.get('locations'):
            contact_text += "\nCONTACT INFORMATION:\n"
            for location in context['locations']:
                contact_text += f"• {location['name']}\n"
                contact_text += f"  Address: {location['address']}\n"
                contact_text += f"  Phone: {location['phone']}\n"
                if location.get('email'):
                    contact_text += f"  Email: {location['email']}\n"
                contact_text += f"  Hours: {location['hours']}\n\n"

        
        return f"""You are a friendly AI assistant for RAJAMAHAL restaurant - "Experience Culinary Excellence".

    {menu_text}
    {chefs_text}
    {offers_text}
    {locations_text}
    {delivery_text}
    {booking_text}
    {contact_text}

    RESTAURANT HOURS: Open daily 11:00 AM - 11:00 PM
    PHONE: Call us for reservations and inquiries
    ADDRESS: Multiple locations available

    RESPONSE GUIDELINES:
    - Match your response length to the question complexity
    - For simple, direct questions: Give brief, direct answers
    - For complex queries or when users ask for details: Provide comprehensive information
    - Always be friendly and professional

    RESPONSE EXAMPLES:
    - Simple questions get brief answers:
  

    - Detailed requests get comprehensive information:
    * "Tell me about your menu" → Full menu with descriptions and prices
    * "How do I book a table?" → Complete booking process with all details
    * "What can you help with?" → All quick options and detailed assistance

    SPECIFIC INSTRUCTIONS:
    - Read the question carefully - if it asks for specific info, give ONLY that info
    - Don't add extra details unless specifically requested
    - For food suggestions/recommendations, STRICTLY FILTER menu items:
    * SPICY requests: Show ONLY items with [Spicy] tag - exclude all others
    * VEGETARIAN requests: Show ONLY items with [Vegetarian] tag  
    * VEGAN requests: Show ONLY items with [Vegan] tag
    * If NO items match criteria, say "No [criteria] items available"
    - For specific criteria like texture, health, cooking method, or age-appropriateness:
    * Analyze item names and descriptions for relevant keywords
    * Make reasonable suggestions based on typical food characteristics
    * Examples: "crunchy" → look for items with "crispy", "fried", "chips"
    * "good for children" → suggest milder, familiar items like pizza, pasta
    * "low oil/healthy" → suggest grilled, baked items, avoid fried foods
    * "soft" → soups, pasta, rice dishes
    - Suggest 2-4 items that best match their criteria with prices
    - If criteria can't be determined from menu data, suggest contacting restaurant for specifics
    - For single-fact questions, give single-fact answers
    - For allergens or dietary restrictions, recommend contacting the restaurant directly
    - For bookings/ordering, guide users to website or phone only if they ask HOW to do it
    - Mention payment options for delivery only when asked about ordering/delivery
    - Add follow-up questions only for complex queries or when user seems to need more help

    ONLINE ORDERING STEPS (when requested):
    1. Visit our Order Online page
    2. Browse menu and select items
    3. Fill delivery details
    4. Choose payment: COD or PayPal
    5. Confirm order (30-45 min delivery)

    QUICK OPTIONS (for general inquiries):
    1. View Our Menu
    2. Book a Table  
    3. Special Offers
    4. Our Locations
    5. Contact Information
    6. Order Online
    7. About our chefs

    Keep responses natural and appropriately sized for each question!"""

    def get_or_create_session(self, session_id=None):
        """Get existing session or create new one"""
        if session_id:
            try:
                session = ChatSession.objects.get(session_id=session_id, is_active=True)
                return session
            except ChatSession.DoesNotExist:
                pass
        
        # Create new session
        session_id = str(uuid.uuid4())
        session = ChatSession.objects.create(session_id=session_id)
        return session

    def save_message(self, session, message_type, content, metadata=None):
        """Save message to database"""
        try:
            return ChatMessage.objects.create(
                session=session,
                message_type=message_type,
                content=content,
                metadata=metadata or {}
            )
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    def get_chat_history(self, session, limit=5):
        """Get recent chat history"""
        try:
            messages = session.messages.all().order_by('-timestamp')[:limit]
            history = []
            for msg in reversed(messages):  # Reverse to get chronological order
                if msg.message_type == 'user':
                    history.append(HumanMessage(content=msg.content))
                elif msg.message_type == 'assistant':
                    history.append(SystemMessage(content=msg.content))
            return history
        except Exception as e:
            print(f"Error getting chat history: {e}")
            return []

    def generate_response(self, user_message, session_id=None):
        """Generate AI response to user message"""
        session = None
        try:
            # Check if LLM is available
            if not self.llm:
                return {
                    'response': "I'm currently unavailable. Please contact our staff directly at the restaurant.",
                    'session_id': session_id or 'error',
                    'error': 'LLM not initialized'
                }
            
            # Get or create session
            session = self.get_or_create_session(session_id)
            
            # Save user message
            self.save_message(session, 'user', user_message)
            
            # Get restaurant context
            context = self.get_restaurant_context()
            
            # Create system prompt
            system_prompt = self.create_system_prompt(context)
            
            # Get chat history
            history = self.get_chat_history(session)
            
            # Create messages for the LLM
            messages = [SystemMessage(content=system_prompt)]
            messages.extend(history[-4:])  # Only include last 4 messages to avoid token limits
            messages.append(HumanMessage(content=user_message))
            

            
            # Generate response
            response = self.llm.invoke(messages)
            ai_response = response.content
            
            # Save AI response
            self.save_message(session, 'assistant', ai_response)
            
            return {
                'response': ai_response,
                'session_id': session.session_id,
                'timestamp': session.updated_at.isoformat()
            }
            
        except Exception as e:
            print(f"Error generating response: {e}")
            error_response = "I apologize for the technical difficulty. Our staff can help you directly - please call the restaurant or visit us in person!"
            
            # Try to save error response if session exists
            if session:
                try:
                    self.save_message(session, 'assistant', error_response)
                except:
                    pass
            
            return {
                'response': error_response,
                'session_id': session.session_id if session else (session_id or 'error'),
                'error': str(e)
            }

    def get_quick_options(self):
        """Get quick response options for the chat interface"""
        return [
            {
                'id': 'menu',
                'text': '🍽️ View Our Menu',
                'message': 'Show me your menu and popular dishes'
            },
            {
                'id': 'offers',
                'text': '🎉 Special Offers',
                'message': 'What special offers do you have currently?'
            },
            {
                'id': 'booking',
                'text': '📅 Table Booking',
                'message': 'How can I book a table at your restaurant?'
            },
            {
                'id': 'locations',
                'text': '📍 Our Locations',
                'message': 'Where are your restaurant locations?'
            },
            {
                'id': 'contact',
                'text': '📞 Contact Information',
                'message': 'How can I contact the restaurant?'
            },
            {
            'id': 'order',
            'text': '🚚 Order Online', 
            'message': 'I want to order food online for delivery'
            }
        ]
