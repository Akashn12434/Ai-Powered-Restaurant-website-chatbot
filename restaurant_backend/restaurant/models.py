from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class MenuCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = "Menu Categories"

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True)
    is_available = models.BooleanField(default=True)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_spicy = models.BooleanField(default=False)
    preparation_time = models.IntegerField(help_text="Time in minutes", default=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} - {self.category.name}"

class Location(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    hours = models.CharField(max_length=200)
    map_link = models.URLField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Chef(models.Model):
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    image = models.URLField(blank=True)
    experience_years = models.IntegerField(default=0)
    specialty = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} - {self.title}"

class Review(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    is_approved = models.BooleanField(default=False)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.name} - {self.rating} stars"

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'question']

    def __str__(self):
        return self.question[:50]

class SpecialOffer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField(blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

# models.py - Add this new model
class TimeSlot(models.Model):
    time = models.TimeField()
    max_capacity = models.IntegerField(default=50)  # Total seats available per slot
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True)
    
    class Meta:
        unique_together = ['time', 'location']
    
    def __str__(self):
        location_name = self.location.name if self.location else "Main"
        return f"{self.time.strftime('%I:%M %p')} - {location_name} (Capacity: {self.max_capacity})"
    
    def get_available_seats(self, date):
        """Get available seats for this time slot on a specific date"""
        booked_seats = TableBooking.objects.filter(
            date=date,
            time=self.time,
            location=self.location,
            status__in=['confirmed', 'pending']  # Count both confirmed and pending
        ).aggregate(total_guests=models.Sum('guests'))['total_guests'] or 0
        
        return max(0, self.max_capacity - booked_seats)
    
    def is_available(self, date, guests):
        """Check if this slot can accommodate the requested number of guests"""
        return self.get_available_seats(date) >= guests

# Update TableBooking model
class TableBooking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),  # Remove pending, auto-confirm
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    guests = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')  # Auto-confirm
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.date} {self.time} ({self.guests} guests)"
    
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('paypal', 'PayPal'),
        ('cod', 'Cash on Delivery'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField(blank=True)
    customer_phone = models.CharField(max_length=20)
    delivery_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='cod'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    special_instructions = models.TextField(blank=True)
    estimated_delivery_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    special_instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"
    


class ChatSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Chat Session {self.session_id}"

class ChatMessage(models.Model):
    MESSAGE_TYPES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.message_type}: {self.content[:50]}..."