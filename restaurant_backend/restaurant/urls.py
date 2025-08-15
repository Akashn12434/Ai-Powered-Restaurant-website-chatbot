from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import (
    MenuCategoryViewSet, MenuItemViewSet, LocationViewSet, 
    ChefViewSet, ReviewViewSet, FAQViewSet, SpecialOfferViewSet,
    TableBookingViewSet, OrderViewSet, ContactMessageViewSet, TimeSlotViewSet
)

router = DefaultRouter()
router.register(r'menu-categories', MenuCategoryViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'chefs', ChefViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'faqs', FAQViewSet)
router.register(r'special-offers', SpecialOfferViewSet)
router.register(r'time-slots', TimeSlotViewSet)

router.register(r'table-bookings', TableBookingViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'contact-messages', ContactMessageViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/ai/chat/', views.chat_message, name='chat_message'),
    path('api/ai/quick-options/', views.quick_options, name='quick_options'),
    path('api/ai/history/', views.chat_history, name='chat_history'),
    path('api/ai/test/', views.test_api_key, name='test_api_key'),
]