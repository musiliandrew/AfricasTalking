from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Clients, Projects, Receipts, AuthTokens
from .serializers import ClientSerializer, ProjectSerializer, ReceiptSerializer, AuthTokenSerializer
from django.utils.crypto import get_random_string
from datetime import datetime, timedelta
from django.conf import settings
import africastalking

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Clients.objects.all()
    serializer_class = ClientSerializer

    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response({'error': 'Phone number required'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate 6-digit OTP
        otp_code = get_random_string(length=6, allowed_chars='0123456789')
        expires_at = datetime.now() + timedelta(minutes=10)

        # Save OTP
        auth_token, created = AuthTokens.objects.update_or_create(
            phone=phone,
            defaults={
                'otp_code': otp_code,
                'is_used': False,
                'expires_at': expires_at,
            }
        )

        # Send OTP via Africa's Talking SMS
        at = africastalking.AfricasTalking(
            username=settings.AFRICASTALKING_USERNAME,
            api_key=settings.AFRICASTALKING_API_KEY
        )
        try:
            response = at.sms.send(
                message=f"Your JengaTrust OTP is {otp_code}. Valid for 10 minutes.",
                recipients=[phone]
            )
            return Response({'status': 'OTP sent', 'phone': phone}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        phone = request.data.get('phone')
        otp_code = request.data.get('otp_code')
        if not (phone and otp_code):
            return Response({'error': 'Phone and OTP required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = AuthTokens.objects.get(phone=phone, otp_code=otp_code, is_used=False)
            if token.expires_at < datetime.now():
                return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
            token.is_used = True
            token.save()

            # Create or get client
            client, created = Clients.objects.get_or_create(phone=phone, defaults={'name': ''})
            return Response({'status': 'OTP verified', 'client_id': client.id}, status=status.HTTP_200_OK)
        except AuthTokens.DoesNotExist:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectSerializer

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipts.objects.all()
    serializer_class = ReceiptSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        receipt = self.get_object()
        receipt.approved = True
        receipt.save()

        # Notify client via SMS
        at = africastalking.AfricasTalking(
            username=settings.AFRICASTALKING_USERNAME,
            api_key=settings.AFRICASTALKING_API_KEY
        )
        try:
            at.sms.send(
                message=f"Receipt for KES {receipt.amount} approved for {receipt.project.name}.",
                recipients=[receipt.project.client.phone]
            )
        except Exception:
            pass  # Log error in production

        return Response({'status': 'Receipt approved'}, status=status.HTTP_200_OK)
    
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import AuthTokens, Clients, Notifications

@csrf_exempt
def sms_callback(request):
    if request.method == 'POST':
        # Parse Africa's Talking webhook payload
        phone = request.POST.get('from')
        message = request.POST.get('text')
        message_id = request.POST.get('id', 'unknown')
        link_id = request.POST.get('linkId', 'unknown')

        if not phone or not message:
            return HttpResponse('Missing phone or message', status=400)

        # Log incoming SMS for audit
        Notifications.objects.create(
            recipient_phone=phone,
            message_type='SMS',
            message_content=message,
            status='received',
            created_at=timezone.now()
        )

        # Handle OTP verification (expecting 6-digit code)
        if message.isdigit() and len(message) == 6:
            try:
                token = AuthTokens.objects.get(
                    phone=phone,
                    otp_code=message,
                    is_used=False,
                    expires_at__gt=timezone.now()
                )
                token.is_used = True
                token.save()

                # Create or update client
                client, created = Clients.objects.get_or_create(
                    phone=phone,
                    defaults={'name': 'Unknown', 'email': None}
                )

                # Log successful verification
                Notifications.objects.create(
                    recipient_phone=phone,
                    message_type='SMS',
                    message_content=f"OTP {message} verified for client ID {client.id}",
                    status='verified',
                    created_at=timezone.now()
                )

                return HttpResponse('OTP verified', status=200)
            except AuthTokens.DoesNotExist:
                # Log failed attempt
                Notifications.objects.create(
                    recipient_phone=phone,
                    message_type='SMS',
                    message_content=f"Invalid OTP {message}",
                    status='failed',
                    created_at=timezone.now()
                )
                return HttpResponse('Invalid or expired OTP', status=400)
        else:
            return HttpResponse('Invalid message format; expected 6-digit OTP', status=400)
    
    return HttpResponse('Method not allowed', status=405)