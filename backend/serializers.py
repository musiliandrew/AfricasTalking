from rest_framework import serializers
from .models import Clients, Projects, Receipts, AuthTokens

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clients
        fields = ['id', 'name', 'phone', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ['id', 'name', 'client', 'contractor', 'location', 'total_budget', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipts
        fields = ['id', 'project', 'budget', 'contractor', 'amount', 'item_description', 'supplier_name', 'photo_id', 'approved', 'created_at']
        read_only_fields = ['id', 'created_at', 'approved']

class AuthTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthTokens
        fields = ['phone', 'otp_code', 'is_used', 'expires_at', 'created_at']
        read_only_fields = ['otp_code', 'is_used', 'expires_at', 'created_at']