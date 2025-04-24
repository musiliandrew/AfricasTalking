from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.views import ClientViewSet, ProjectViewSet, ReceiptViewSet, sms_callback

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'receipts', ReceiptViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/sms/callback/', sms_callback, name='sms-callback'),
]