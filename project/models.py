from django.db import models
from django.contrib.auth.models import User
from testcase.models import Tag
from ckeditor.fields import RichTextField
from simple_history.models import HistoricalRecords

class Client(models.Model):
    name = models.CharField(max_length=500, null=True)
    description = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    history = HistoricalRecords(cascade_delete_history=True)
    def __str__(self):
        return self.name
    
class Project(models.Model):
    name = models.CharField(max_length=200 , null=True)
    create_date = models.DateTimeField(auto_now_add=True , null=True)
    client = models.ForeignKey(Client,null= True , on_delete=models.SET_NULL)
    start_date = models.DateField(null= True , blank= True)
    end_date = models.DateField(null = True , blank = True)
    update_date = models.DateTimeField(auto_now=True , null= True)
    tag = models.ManyToManyField(Tag)
    description = RichTextField()
    creator = models.ForeignKey(User , null= True , on_delete=models.SET_NULL,related_name='Project_creator')
    assign = models.ForeignKey(User , null= True , on_delete=models.SET_NULL,related_name='Project_assign')
    history = HistoricalRecords(cascade_delete_history=True)
    
    def __str__(self):
        return self.name
    
