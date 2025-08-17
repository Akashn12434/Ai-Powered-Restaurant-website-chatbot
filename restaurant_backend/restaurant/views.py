from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import EmailMessage

from datetime import datetime
from rest_framework.decorators import api_view

import requests
import logging



from django.conf import settings
from .models import (
    MenuCategory, MenuItem, Location, Chef, Review, FAQ, 
    SpecialOffer, TableBooking, Order, OrderItem, ContactMessage
)
from .serializers import (
    MenuCategorySerializer, MenuItemSerializer, LocationSerializer, 
    ChefSerializer, ReviewSerializer, ReviewCreateSerializer, 
    FAQSerializer, SpecialOfferSerializer, TableBookingSerializer, 
    TableBookingCreateSerializer, OrderSerializer, OrderCreateSerializer,
    ContactMessageSerializer, ContactMessageCreateSerializer,TimeSlotSerializer,TimeSlot
)

from .models import ChatSession, ChatMessage 

from .services import RestaurantAIService



# Set up logging
logger = logging.getLogger(__name__)

# Initialize AI service
try:
    ai_service = RestaurantAIService()
    logger.info("AI service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize AI service: {e}")
    ai_service = None

@api_view(['POST'])
def chat_message(request):
    """Handle chat messages from frontend"""
    try:
        # Debug logging
        logger.info(f"Received chat request: {request.data}")
        
        user_message = request.data.get('message', '').strip()
        session_id = request.data.get('session_id')
        
        if not user_message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if AI service is available
        if not ai_service:
            return Response({
                'response': "I'm currently unavailable due to a configuration issue. Please contact our staff directly!",
                'session_id': session_id or 'error',
                'error': 'AI service not available'
            }, status=status.HTTP_200_OK)
        
        # Check API key
        if not settings.GROQ_API_KEY:
            logger.error("Groq API key not found in settings")
            return Response({
                'response': "I'm having trouble connecting to my AI service. Please contact our staff for assistance!",
                'session_id': session_id or 'error',
                'error': 'API key not configured'
            }, status=status.HTTP_200_OK)
        
        logger.info(f"Processing message: '{user_message}' for session: {session_id}")
        
        # Generate AI response
        result = ai_service.generate_response(user_message, session_id)
        
        logger.info(f"Generated response: {result.get('response', '')[:100]}...")
        
        return Response(result, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in chat_message view: {e}")
        return Response({
            'response': "I'm experiencing technical difficulties. Please contact our restaurant staff directly for assistance!",
            'session_id': request.data.get('session_id', 'error'),
            'error': str(e)
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
def quick_options(request):
    """Get quick response options"""
    try:
        if ai_service:
            options = ai_service.get_quick_options()
        else:
            options = [
                {'id': 'contact', 'text': '📞 Contact Us', 'message': 'How can I contact the restaurant?'}
            ]
        return Response({'options': options}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error getting quick options: {e}")
        return Response({'options': []}, status=status.HTTP_200_OK)

@api_view(['GET']) 
def test_api_key(request):
    """Test endpoint to verify API key configuration"""
    try:
        api_key = getattr(settings, 'GROQ_API_KEY', None)
        has_key = bool(api_key and len(api_key.strip()) > 0)
        
        return Response({
            'has_api_key': has_key,
            'api_key_length': len(api_key) if api_key else 0,
            'ai_service_available': ai_service is not None
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def chat_history(request):
    """Get chat history for a session"""
    session_id = request.GET.get('session_id')
    if not session_id:
        return Response(
            {'error': 'Session ID is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        session = ChatSession.objects.get(session_id=session_id, is_active=True)
        messages = session.messages.all()
        
        history = []
        for msg in messages:
            history.append({
                'type': msg.message_type,
                'content': msg.content,
                'timestamp': msg.timestamp.isoformat()
            })
        
        return Response({'history': history}, status=status.HTTP_200_OK)
        
    except ChatSession.DoesNotExist:
        return Response(
            {'error': 'Session not found'},
            status=status.HTTP_404_NOT_FOUND
        )

PAYPAL_CLIENT_ID = 'your paypal client id'
PAYPAL_SECRET = 'your paypal secret key'
PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com'  # Sandbox URL

def get_paypal_access_token():
    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    response = requests.post(
        f'{PAYPAL_BASE_URL}/v1/oauth2/token',
        headers={'Accept': 'application/json'},
        data={'grant_type': 'client_credentials'},
        auth=auth
    )
    return response.json()['access_token']


def capture_paypal_order(paypal_order_id):
    token = get_paypal_access_token()
    response = requests.post(
        f'{PAYPAL_BASE_URL}/v2/checkout/orders/{paypal_order_id}/capture',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
    )
    print("📦 PayPal Capture Response:", response.status_code, response.text)  # <--- Add this
    return response.json()

class MenuCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuCategory.objects.filter(is_active=True)
    serializer_class = MenuCategorySerializer
    filter_backends = [OrderingFilter]
    ordering = ['display_order', 'name']

class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_vegetarian', 'is_vegan', 'is_spicy']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'preparation_time']
    ordering = ['category', 'name']

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get menu items grouped by category"""
        categories = MenuCategory.objects.filter(is_active=True).prefetch_related('items')
        serializer = MenuCategorySerializer(categories, many=True)
        return Response(serializer.data)

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.filter(is_active=True)
    serializer_class = LocationSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name', 'address']

class ChefViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Chef.objects.filter(is_active=True)
    serializer_class = ChefSerializer
    filter_backends = [OrderingFilter]
    ordering = ['display_order', 'name']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['rating', 'location']
    ordering = ['-date']

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        # Reviews need approval before being visible
        serializer.save(is_approved=False)

    @action(detail=False, methods=['get'])
    def approved(self, request):
        """Get only approved reviews"""
        reviews = Review.objects.filter(is_approved=True)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    filter_backends = [OrderingFilter]
    ordering = ['display_order', 'question']

class SpecialOfferViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SpecialOffer.objects.all()
    serializer_class = SpecialOfferSerializer
    filter_backends = [OrderingFilter]
    ordering = ['-created_at']

    def get_queryset(self):
        """Get only active offers that are currently valid"""
        now = timezone.now()
        return SpecialOffer.objects.filter(
            is_active=True,
            valid_from__lte=now,
            valid_until__gte=now
        )

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming offers"""
        now = timezone.now()
        offers = SpecialOffer.objects.filter(
            is_active=True,
            valid_from__gt=now
        )
        serializer = self.get_serializer(offers, many=True)
        return Response(serializer.data)

# views.py
class TimeSlotViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    
    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available time slots for a specific date and location"""
        date_str = request.query_params.get('date')
        location_id = request.query_params.get('location')
        guests = int(request.query_params.get('guests', 1))
        
        if not date_str:
            return Response({'error': 'Date parameter required'}, status=400)
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=400)
        
        queryset = self.queryset
        if location_id:
            queryset = queryset.filter(location_id=location_id)
        
        # Filter slots that can accommodate the requested guests
        available_slots = []
        for slot in queryset:
            if slot.is_available(date, guests):
                serializer = self.get_serializer(slot, context={'date': date})
                slot_data = serializer.data
                slot_data['can_accommodate'] = True
                available_slots.append(slot_data)
            else:
                # Still show the slot but mark as unavailable
                serializer = self.get_serializer(slot, context={'date': date})
                slot_data = serializer.data
                slot_data['can_accommodate'] = False
                available_slots.append(slot_data)
        
        return Response(available_slots)

class TableBookingViewSet(viewsets.ModelViewSet):
    queryset = TableBooking.objects.all()
    serializer_class = TableBookingSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'location', 'date']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return TableBookingCreateSerializer
        return TableBookingSerializer

    def perform_create(self, serializer):
        # Save the booking (automatically confirmed)
        booking = serializer.save()

        # Send immediate confirmation email to customer
        confirmation_message = f"""
Dear {booking.name},

🎉 Your table booking is CONFIRMED!

📋 BOOKING DETAILS - #{booking.id}

📅 Date: {booking.date.strftime('%A, %B %d, %Y')}
🕐 Time: {booking.time.strftime('%I:%M %p')}
👥 Guests: {booking.guests} people
📍 Location: {booking.location.name if booking.location else "Main Dining Area"}

💬 Your Message: {booking.message or 'No special requests'}

📍 RESTAURANT ADDRESS:
[Add your restaurant address]
📞 CONTACT: [Add restaurant phone]

⚠️ IMPORTANT:
• Please arrive 10-15 minutes before your reservation
• We'll hold your table for 15 minutes past reservation time
• Contact us 24 hours in advance for cancellations

Thank you for choosing Rajamahal Restaurant!

Best regards,
Rajamahal Team
"""

        send_mail(
            subject=f"🎉 Table Booking CONFIRMED - #{booking.id} | {booking.date.strftime('%b %d')} at {booking.time.strftime('%I:%M %p')}",
            message=confirmation_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.email],
        )

        # Send notification to admin (for record keeping)
        admin_message = f"""
🍽️ NEW TABLE BOOKING - AUTO-CONFIRMED #{booking.id}

👤 Customer: {booking.name} ({booking.phone})
📧 Email: {booking.email}
📅 Date & Time: {booking.date.strftime('%A, %B %d, %Y')} at {booking.time.strftime('%I:%M %p')}
👥 Guests: {booking.guests}
📍 Location: {booking.location.name if booking.location else "Main Dining"}
💬 Message: {booking.message or 'No special requests'}

✅ STATUS: AUTOMATICALLY CONFIRMED
📧 Customer has been notified via email.

Booking placed at: {booking.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""

        send_mail(
            subject=f"📅 New Booking Auto-Confirmed #{booking.id} - {booking.name}",
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['hotelemailid'],
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking (customer or admin)"""
        booking = self.get_object()
        reason = request.data.get('reason', 'Customer requested cancellation')
        booking.status = 'cancelled'
        booking.save()

        # Email customer
        cancellation_message = f"""
Dear {booking.name},

Your table booking has been cancelled.

❌ CANCELLED BOOKING - #{booking.id}
📅 Originally scheduled: {booking.date.strftime('%A, %B %d, %Y')} at {booking.time.strftime('%I:%M %p')}
👥 Guests: {booking.guests}

📝 Reason: {reason}

🔄 REBOOK ANYTIME:
Visit our website to make a new reservation for available dates.

We hope to serve you soon!

Best regards,
Rajamahal Team
"""

        send_mail(
            subject=f"❌ Booking Cancelled - #{booking.id}",
            message=cancellation_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.email],
        )

        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's confirmed bookings"""
        today = timezone.now().date()
        bookings = TableBooking.objects.filter(date=today, status='confirmed')
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'payment_method']

    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        # Set estimated delivery time (60 minutes from now)
        estimated_time = timezone.now() + timezone.timedelta(minutes=60)
        serializer.save(estimated_delivery_time=estimated_time)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Create detailed email message for admin
        order_items_text = ""
        for item in order.items.all():
            order_items_text += f"• {item.menu_item.name} x {item.quantity} = ${item.price}\n"
            if item.special_instructions:
                order_items_text += f"  Special Instructions: {item.special_instructions}\n"
        
        # Format payment status
        payment_status = "✅ PAID" if order.payment_status == 'paid' else "⏳ PENDING"
        if order.payment_method == 'paypal':
            payment_info = f"PayPal - {payment_status}"
        else:
            payment_info = f"Cash on Delivery - {payment_status}"
        
        admin_message = f"""
    🍽️ NEW ORDER RECEIVED - #{order.id}

    👤 CUSTOMER DETAILS:
    Name: {order.customer_name}
    Email: {order.customer_email or 'Not provided'}
    Phone: {order.customer_phone}

    📍 DELIVERY ADDRESS:
    {order.delivery_address}

    🛒 ORDER ITEMS:
    {order_items_text}
    💰 TOTAL AMOUNT: ${order.total_amount}

    💳 PAYMENT INFO:
    {payment_info}

    📝 SPECIAL INSTRUCTIONS:
    {order.special_instructions or 'None'}

    ⏰ ESTIMATED DELIVERY:
    {order.estimated_delivery_time.strftime('%Y-%m-%d %H:%M') if order.estimated_delivery_time else 'Not set'}

    📅 ORDER PLACED:
    {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}

    ---
    Please confirm this order in the admin panel.
    """

        # Send detailed email to admin
        send_mail(
            subject=f'🍽️ New Order #{order.id} - ${order.total_amount} ({order.payment_method.upper()})',
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='paypal-capture')
    def paypal_capture(self, request, pk=None):
        order = self.get_object()
        paypal_order_id = request.data.get('paypal_order_id')

        if not paypal_order_id:
            return Response({"error": "Missing PayPal Order ID."}, status=400)

        result = capture_paypal_order(paypal_order_id)

        if result.get('status') == 'COMPLETED':
            order.payment_status = 'paid'
            order.status = 'confirmed'
            order.save()

            # Create detailed order items text
            order_items_text = ""
            for item in order.items.all():
                order_items_text += f"• {item.menu_item.name} x {item.quantity} = ${item.price}\n"
                if item.special_instructions:
                    order_items_text += f"  Special Instructions: {item.special_instructions}\n"

            # Email customer with order details
            if order.customer_email:
                customer_message = f"""
    Dear {order.customer_name},

    ✅ PAYMENT SUCCESSFUL & ORDER CONFIRMED!

    🧾 ORDER SUMMARY - #{order.id}
    {order_items_text}
    💰 Total Paid: ${order.total_amount}
    💳 Payment Method: PayPal

    📍 DELIVERY ADDRESS:
    {order.delivery_address}

    ⏰ ESTIMATED DELIVERY:
    {order.estimated_delivery_time.strftime('%Y-%m-%d %H:%M') if order.estimated_delivery_time else 'Within 60 minutes'}

    📝 SPECIAL INSTRUCTIONS:
    {order.special_instructions or 'None'}

    Thank you for your order! We'll prepare it with care.

    Best regards,
    Restaurant Team
    """
                
                send_mail(
                    subject=f'✅ Payment Successful - Order #{order.id} Confirmed!',
                    message=customer_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[order.customer_email],
                )

            # Send update to admin about payment completion
            admin_update_message = f"""
    💳 PAYMENT COMPLETED - Order #{order.id}

    Customer: {order.customer_name}
    Amount: ${order.total_amount}
    Payment: PayPal ✅ CONFIRMED
    Status: Order Confirmed & Ready for Preparation

    Delivery Address: {order.delivery_address}
    Phone: {order.customer_phone}
    """
            
            send_mail(
                subject=f'💳 Payment Confirmed - Order #{order.id}',
                message=admin_update_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
            )

            return Response({'success': True, 'message': 'Payment captured and order confirmed.'})
        else:
            order.payment_status = 'failed'
            order.save()
            return Response({'error': 'Payment failed.', 'paypal_response': result}, status=400)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an order"""
        order = self.get_object()
        order.status = 'confirmed'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def prepare(self, request, pk=None):
        """Mark order as being prepared"""
        order = self.get_object()
        order.status = 'preparing'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def ready(self, request, pk=None):
        """Mark order as ready for delivery"""
        order = self.get_object()
        order.status = 'ready'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def deliver(self, request, pk=None):
        """Mark order as delivered"""
        order = self.get_object()
        order.status = 'delivered'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        if order.status not in ['preparing', 'ready', 'delivered']:
            order.status = 'cancelled'
            order.save()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        else:
            return Response(
                {'error': 'Cannot cancel order in current status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending orders"""
        orders = Order.objects.filter(status='pending')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active orders (confirmed, preparing, ready)"""
        orders = Order.objects.filter(status__in=['confirmed', 'preparing', 'ready'])
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)




class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_read']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer

    def perform_create(self, serializer):
        instance = serializer.save()

        # Simple plain-text email
        send_mail(
            subject=f"New Contact Message from {instance.name}",
            message=f"""
You received a new contact message:

Name: {instance.name}
Email: {instance.email}
Phone: {instance.phone}
Message:
{instance.message}
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['hotelemailid'],  # Replace with hotel email
            fail_silently=False,
        )

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a contact message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        serializer = self.get_serializer(message)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread contact messages"""
        messages = ContactMessage.objects.filter(is_read=False)
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
