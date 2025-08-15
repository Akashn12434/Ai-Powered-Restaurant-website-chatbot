from django.contrib import admin
from .models import (
    MenuCategory, MenuItem, Location, Chef, Review, FAQ, 
    SpecialOffer, TableBooking, Order, OrderItem, ContactMessage,TimeSlot
)
from django.utils import timezone
from django.db.models import Sum
from django.core.exceptions import ValidationError

from django.core.mail import send_mail
from django.conf import settings
from django.db import models


from django.core.mail import send_mail
from django.conf import settings


from .models import ChatSession, ChatMessage

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'created_at', 'updated_at', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['session_id']
    readonly_fields = ['session_id', 'created_at', 'updated_at']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'message_type', 'content_preview', 'timestamp']
    list_filter = ['message_type', 'timestamp']
    search_fields = ['content']
    readonly_fields = ['timestamp']
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = "Content Preview"

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    ordering = ['display_order', 'name']
    list_editable = ['display_order', 'is_active']

class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 0
    fields = ['name', 'price', 'is_available', 'is_vegetarian', 'is_vegan', 'is_spicy']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'is_vegetarian', 'is_vegan', 'is_spicy']
    list_filter = ['category', 'is_available', 'is_vegetarian', 'is_vegan', 'is_spicy']
    search_fields = ['name', 'description']
    list_editable = ['is_available', 'is_vegetarian', 'is_vegan', 'is_spicy']
    ordering = ['category', 'name']

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'address']
    list_editable = ['is_active']

@admin.register(Chef)
class ChefAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'experience_years', 'is_active', 'display_order']
    list_filter = ['is_active', 'experience_years']
    search_fields = ['name', 'title', 'specialty']
    list_editable = ['is_active', 'display_order']
    ordering = ['display_order', 'name']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'is_approved', 'date', 'location']
    list_filter = ['rating', 'is_approved', 'date', 'location']
    search_fields = ['name', 'comment']
    list_editable = ['is_approved']
    ordering = ['-date']
    readonly_fields = ['date']

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'display_order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['question', 'answer']
    list_editable = ['display_order', 'is_active']
    ordering = ['display_order', 'question']

@admin.register(SpecialOffer)
class SpecialOfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'discount_percentage', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['is_active', 'valid_from', 'valid_until']
    search_fields = ['title', 'description']
    list_editable = ['is_active']
    ordering = ['-created_at']
    date_hierarchy = 'valid_from'

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['time', 'max_capacity', 'location', 'get_today_bookings', 'get_today_available']
    list_filter = ['location']
    search_fields = ['location__name']
    ordering = ['time', 'location']
    
    def get_today_bookings(self, obj):
        today = timezone.now().date()
        booked = TableBooking.objects.filter(
            date=today,
            time=obj.time,
            location=obj.location,
            status='confirmed'
        ).aggregate(total=models.Sum('guests'))['total'] or 0
        return f"{booked} guests"
    get_today_bookings.short_description = "Today's Bookings"
    
    def get_today_available(self, obj):
        today = timezone.now().date()
        available = obj.get_available_seats(today)
        return f"{available} seats"
    get_today_available.short_description = "Available Today"

@admin.register(TableBooking)
class TableBookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'date', 'time', 'guests', 'status', 'location', 'created_at']
    list_filter = ['status', 'date', 'location', 'created_at']
    search_fields = ['name', 'email', 'phone', 'id']
    list_editable = ['status']  # Keep this for manual status changes if needed
    ordering = ['-created_at']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at']
    
    # Add custom actions
    actions = ['mark_completed', 'send_reminder_email']
    
    def mark_completed(self, request, queryset):
        """Mark selected bookings as completed"""
        count = queryset.update(status='completed')
        self.message_user(request, f'{count} booking(s) marked as completed.')
    mark_completed.short_description = "Mark selected bookings as completed"
    
    def send_reminder_email(self, request, queryset):
        """Send reminder emails for upcoming bookings"""
        count = 0
        for booking in queryset:
            if booking.status == 'confirmed':
                try:
                    send_mail(
                        subject=f"📅 Reminder: Your Table Booking Tomorrow - #{booking.id}",
                        message=f"""
Dear {booking.name},

This is a friendly reminder about your table booking:

📅 Date: {booking.date.strftime('%A, %B %d, %Y')}
🕐 Time: {booking.time.strftime('%I:%M %p')}
👥 Guests: {booking.guests}
📍 Location: {booking.location.name if booking.location else "Main Dining"}

We look forward to serving you!

Best regards,
Rajamahal Team
                        """,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[booking.email],
                    )
                    count += 1
                except Exception as e:
                    self.message_user(request, f'Error sending email to {booking.name}: {str(e)}', level='ERROR')
        
        if count > 0:
            self.message_user(request, f'Reminder emails sent to {count} customer(s).')
    send_reminder_email.short_description = "Send reminder emails"

    def save_model(self, request, obj, form, change):
        # Only send emails for manual status changes in admin (not auto-confirmations)
        if change:  # Only for updates, not new bookings
            old_obj = TableBooking.objects.get(pk=obj.pk)
            old_status = old_obj.status
        else:
            old_status = None

        super().save_model(request, obj, form, change)

        # Send email only if admin manually changes status
        if change and old_status != obj.status:
            if obj.status == 'cancelled':
                send_mail(
                    subject=f"❌ Booking Cancelled - #{obj.id}",
                    message=f"""
Dear {obj.name},

Your table booking has been cancelled by our team.

❌ CANCELLED BOOKING - #{obj.id}
📅 Date: {obj.date.strftime('%A, %B %d, %Y')}
🕐 Time: {obj.time.strftime('%I:%M %p')}
👥 Guests: {obj.guests}

📝 If you have any questions, please contact us.

We apologize for any inconvenience and hope to serve you in the future.

Best regards,
Rajamahal Team
                    """,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[obj.email],
                )
            elif obj.status == 'completed':
                # Optional: Send thank you email when marked as completed
                send_mail(
                    subject=f"🙏 Thank You for Dining with Us! - #{obj.id}",
                    message=f"""
Dear {obj.name},

Thank you for dining with us at Rajamahal Restaurant!

We hope you enjoyed your experience on {obj.date.strftime('%A, %B %d, %Y')}.

Your feedback means a lot to us. Please consider leaving a review or letting us know how we can improve.

We look forward to serving you again soon!

Best regards,
Rajamahal Team
                    """,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[obj.email],
                )

# Optional: Add a custom admin view for booking statistics
class BookingStatsAdmin(admin.ModelAdmin):
    """Custom admin view to show booking statistics"""
    
    def changelist_view(self, request, extra_context=None):
        from django.db.models import Count, Sum
        from django.utils import timezone
        
        extra_context = extra_context or {}
        
        today = timezone.now().date()
        
        # Today's stats
        today_bookings = TableBooking.objects.filter(date=today, status='confirmed')
        extra_context['today_bookings_count'] = today_bookings.count()
        extra_context['today_guests_count'] = today_bookings.aggregate(Sum('guests'))['guests__sum'] or 0
        
        # This week's stats
        week_start = today - timezone.timedelta(days=today.weekday())
        week_bookings = TableBooking.objects.filter(
            date__gte=week_start,
            date__lt=week_start + timezone.timedelta(days=7),
            status='confirmed'
        )
        extra_context['week_bookings_count'] = week_bookings.count()
        extra_context['week_guests_count'] = week_bookings.aggregate(Sum('guests'))['guests__sum'] or 0
        
        return super().changelist_view(request, extra_context=extra_context)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'total_amount', 'payment_method', 'status', 'payment_status', 'created_at']
    list_filter = ['payment_method', 'status', 'payment_status', 'created_at']  # ✅ added 'payment_method'
    search_fields = ['customer_name', 'customer_email', 'customer_phone']
    list_editable = ['status', 'payment_status']
    ordering = ['-created_at']
    readonly_fields = ['total_amount', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'menu_item', 'quantity', 'price']
    list_filter = ['order__status', 'menu_item__category']
    search_fields = ['order__customer_name', 'menu_item__name']
    ordering = ['-order__created_at']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
# Custom admin site headers
admin.site.site_header = "The Gourmet Hub Administration"
admin.site.site_title = "Gourmet Hub Admin"
admin.site.index_title = "Welcome to The Gourmet Hub Administration"
