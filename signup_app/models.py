from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Verify_email_code(models.Model):
    user = models.ForeignKey(User , null= True , on_delete=models.CASCADE ,related_name='Verify_email_code_user')
    code = models.CharField(max_length=6 , null = True , blank=True)