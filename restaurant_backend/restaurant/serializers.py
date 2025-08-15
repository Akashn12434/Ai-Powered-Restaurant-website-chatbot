from rest_framework import serializers
from django.utils import timezone
from .models import (
    MenuCategory, MenuItem, Location, Chef, Review, FAQ, 
    SpecialOffer, TableBooking, Order, OrderItem, ContactMessage,TimeSlot
)
from django.utils import timezone
from django.db.models import Sum

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'image', 
            'is_available', 'is_vegetarian', 'is_vegan', 
            'is_spicy', 'preparation_time'
        ]

class MenuCategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'description', 'items']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            'id', 'name', 'address', 'phone', 'email', 
            'hours', 'map_link', 'latitude', 'longitude'
        ]

class ChefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chef
        fields = [
            'id', 'name', 'title', 'bio', 'image', 
            'experience_years', 'specialty'
        ]

class ReviewSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = [
            'id', 'name', 'rating', 'comment', 'date', 'location'
        ]
        read_only_fields = ['date']
    def get_date(self, obj):
        return obj.date.strftime('%B %d, %Y') 

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'name', 'email', 'rating', 'comment', 'location'
        ]

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer']

class SpecialOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialOffer
        fields = [
            'id', 'title', 'description', 'image', 
            'discount_percentage', 'valid_from', 'valid_until'
        ]
# serializers.py
from django.utils import timezone
from django.db.models import Sum

class TimeSlotSerializer(serializers.ModelSerializer):
    available_seats = serializers.SerializerMethodField()
    location_name = serializers.CharField(source='location.name', read_only=True)
    time_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TimeSlot
        fields = ['id', 'time', 'time_display', 'max_capacity', 'available_seats', 'location', 'location_name']
    
    def get_time_display(self, obj):
        return obj.time.strftime('%I:%M %p')
    
    def get_available_seats(self, obj):
        # Get date from context (passed from view)
        date = self.context.get('date', timezone.now().date())
        return obj.get_available_seats(date)

class TableBookingSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    time_display = serializers.SerializerMethodField()
    
    class Meta:
        model = TableBooking
        fields = [
            'id', 'name', 'email', 'phone', 'date', 'time', 'time_display',
            'guests', 'message', 'status', 'location', 'location_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']
    
    def get_time_display(self, obj):
        return obj.time.strftime('%I:%M %p')

class TableBookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableBooking
        fields = [
            'name', 'email', 'phone', 'date', 'time', 
            'guests', 'message', 'location'
        ]
    
    def validate_date(self, value):
        """Ensure booking date is not in the past"""
        if value < timezone.now().date():
            raise serializers.ValidationError("Booking date cannot be in the past.")
        return value
    
    def validate_guests(self, value):
        """Ensure guest count is reasonable"""
        if value < 1:
            raise serializers.ValidationError("At least 1 guest is required.")
        if value > 20:
            raise serializers.ValidationError("Maximum 20 guests allowed per booking.")
        return value
    
    def validate(self, data):
        """Check availability for the requested slot"""
        date = data.get('date')
        time = data.get('time')
        guests = data.get('guests')
        location = data.get('location')
        
        try:
            time_slot = TimeSlot.objects.get(time=time, location=location)
        except TimeSlot.DoesNotExist:
            raise serializers.ValidationError("This time slot is not available.")
        
        if not time_slot.is_available(date, guests):
            available_seats = time_slot.get_available_seats(date)
            if available_seats == 0:
                raise serializers.ValidationError("Sorry, this time slot is fully booked.")
            else:
                raise serializers.ValidationError(f"Only {available_seats} seats available for this slot. Please reduce guest count or choose another time.")
        
        return data

# ORDER SERIALIZERS
class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    menu_item_price = serializers.DecimalField(source='menu_item.price', max_digits=10, decimal_places=2, read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.SerializerMethodField()  # ✅ Add total for this item line

    class Meta:
        model = OrderItem
        fields = [
            'id', 'menu_item', 'menu_item_name', 'menu_item_price',
            'quantity', 'price', 'total_price', 'special_instructions'  # ✅ Include total_price
        ]
    
    def get_total_price(self, obj):
        """Calculate total price for this order item (price * quantity)"""
        return obj.price * obj.quantity if obj.price and obj.quantity else 0


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)  # ✅ Human readable payment method
    status_display = serializers.CharField(source='get_status_display', read_only=True)  # ✅ Human readable status
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)  # ✅ Human readable payment status
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'total_amount', 'payment_method', 'payment_method_display',  # ✅ Include display fields
            'status', 'status_display', 'payment_status', 'payment_status_display',  # ✅ Include display fields
            'special_instructions', 'estimated_delivery_time', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'payment_status', 'estimated_delivery_time', 'total_amount']  # ✅ Make total_amount read_only


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_email', 'customer_phone', 'payment_method',
            'delivery_address', 'special_instructions', 'items'
        ]
    
    def validate_items(self, value):
        """Ensure at least one item is ordered"""
        if not value:
            raise serializers.ValidationError("At least one item must be ordered.")
        
        for item in value:
            if item.get('quantity', 0) < 1:
                raise serializers.ValidationError("Each item must have quantity of at least 1.")
        
        return value
    
    def validate_customer_name(self, value):
        """Ensure customer name is provided"""
        if not value or value.strip() == '':
            raise serializers.ValidationError("Customer name is required.")
        return value.strip()
    
    def validate_customer_phone(self, value):
        """Basic phone validation"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Please provide a valid phone number.")
        return value.strip()

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total amount
        total_amount = 0
        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = item_data['quantity']
            price = menu_item.price * quantity
            total_amount += price
        
        # Create order
        order = Order.objects.create(total_amount=total_amount, **validated_data)
        
        # Create order items
        for item_data in items_data:
            menu_item = item_data['menu_item']
            quantity = item_data['quantity']
            price = menu_item.price * quantity
            
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price=price,
                special_instructions=item_data.get('special_instructions', '')
            )
        
        return order

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 
            'message', 'created_at'
        ]
        read_only_fields = ['created_at']

class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'name', 'email', 'phone',  'message'
        ]