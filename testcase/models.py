

# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import gettext_lazy as _
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from simple_history.models import HistoricalRecords



'''
teststep class models
'''
class TagNewTestcase(models.Model):
    name = models.CharField(max_length=100 , null = True)
    description = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True , null=True) 
    creator = models.ForeignKey(User , null= True , on_delete=models.SET_NULL)
    def __str__(self):
        return self.name
    
class TestCasetest(models.Model):
    name = models.CharField(max_length=500 , null = True , blank = True)
    description =  RichTextUploadingField(config_name="default",blank=True,null=True)
    tag = models.ManyToManyField(TagNewTestcase)
    date_created = models.DateTimeField(auto_now_add=True , null=True) 
    creator = models.ForeignKey(User , null= True , on_delete=models.SET_NULL ,related_name='creator_set')
    def __str__(self):
        return self.name
class Teststep(models.Model):
    testcase = models.ForeignKey(TestCasetest , null=True , on_delete= models.CASCADE)
    number = models.CharField(max_length=100 , null = True , blank = True)
    description = models.TextField(blank=True, null=True)
    condition = RichTextField()
    remark = RichTextField()
    modify_history = models.CharField(max_length=100 , null = True , blank = True)
    def __str__(self):
        print(self.testcase.name,type(self.testcase.name))
        name  = self.testcase.name+'-('+str(self.number)+')'
        return name
class save_excel(models.Model):
    filename = models.CharField(max_length=100, null= True , blank= True)
    file = models.FileField(upload_to='uploads/excel/')
    def __str__(self):
        return self.filename

    

