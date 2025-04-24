from django.db import models
from django.contrib.postgres.fields import ArrayField

class Clients(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'clients'

class Contractors(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)
    license_number = models.CharField(max_length=50, blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contractors'

class Projects(models.Model):
    name = models.CharField(max_length=100)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    contractor = models.ForeignKey(Contractors, on_delete=models.SET_NULL, null=True)
    location = models.CharField(max_length=100)
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'projects'

class Budgets(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    milestone_name = models.CharField(max_length=100)
    allocated_amount = models.DecimalField(max_digits=10, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'budgets'

class Receipts(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    budget = models.ForeignKey(Budgets, on_delete=models.SET_NULL, null=True)
    contractor = models.ForeignKey(Contractors, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    item_description = models.TextField(blank=True, null=True)
    supplier_name = models.CharField(max_length=100, blank=True, null=True)
    photo_id = models.CharField(max_length=50, blank=True, null=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'receipts'

class ReceiptApprovals(models.Model):
    receipt = models.ForeignKey(Receipts, on_delete=models.CASCADE)
    approved_by = models.ForeignKey(Clients, on_delete=models.SET_NULL, null=True)
    method = models.CharField(max_length=10)  # e.g., SMS, Web
    approved = models.BooleanField(default=False)
    approved_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'receipt_approvals'

class Milestones(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    budget = models.ForeignKey(Budgets, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100)
    due_date = models.DateField()
    completed = models.BooleanField(default=False)
    photo_ids = ArrayField(models.CharField(max_length=50), blank=True, null=True)  # PostgreSQL array
    funds_released = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'milestones'

class ProjectContractors(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    contractor = models.ForeignKey(Contractors, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    added_by_client = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_contractors'

class Notifications(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    recipient_phone = models.CharField(max_length=15)
    message_type = models.CharField(max_length=20)  # e.g., SMS, USSD, Voice
    message_content = models.TextField()
    status = models.CharField(max_length=20, default='sent')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'

class VoiceLogs(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    recipient_phone = models.CharField(max_length=15)
    voice_action = models.CharField(max_length=50)
    call_status = models.CharField(max_length=20)
    duration_seconds = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'voice_logs'

class AuthTokens(models.Model):
    phone = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'auth_tokens'

class AuditLogs(models.Model):
    action_type = models.CharField(max_length=50)
    performed_by = models.CharField(max_length=100, blank=True, null=True)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, null=True)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_logs'