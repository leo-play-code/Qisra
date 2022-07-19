from django.db import models
from testcase.models import TagNewTestcase
from ckeditor_uploader.fields import RichTextUploadingField
from project.models import CreateProject
from django.contrib.auth.models import User


class TestPlan_test(models.Model):
    project = models.ForeignKey(CreateProject , null=True , on_delete=models.SET_NULL)
    name = models.CharField(max_length=100, null=True)
    stage = models.CharField(max_length=100, null= True , blank = True)
    create_date = models.DateTimeField(auto_now_add=True , null=True)
    start_date = models.DateField(null= True , blank= True)
    end_date = models.DateField(null = True , blank = True)
    text = RichTextUploadingField(config_name="default",blank=True,null=True)
    is_activate = models.BooleanField(default=False)
    tag = models.ManyToManyField(TagNewTestcase)
    creator = models.ForeignKey(User , null= True , on_delete=models.SET_NULL,related_name='create_set_testplan' ,blank=True)
    assign = models.ForeignKey(User , null= True , on_delete=models.SET_NULL,related_name='assign_set_testplan',blank=True)
    def __str__(self):
        return self.name
    
class TestCaseforTestplan(models.Model):
    testplan  = models.ForeignKey(TestPlan_test , null=True , on_delete= models.CASCADE)
    name = models.CharField(max_length=500 , null = True , blank = True)
    tag = models.ManyToManyField(TagNewTestcase)
    date_created = models.DateTimeField(auto_now_add=True , null=True) 
    complete = models.BooleanField(default=False)
    def __str__(self):
        return self.name
    
class TeststepforTestplan(models.Model):
    testcase = models.ForeignKey(TestCaseforTestplan , null=True , on_delete= models.CASCADE)
    number = models.CharField(max_length=100 , null = True , blank = True)
    description = models.TextField(blank=True, null=True)
    condition = RichTextUploadingField(config_name="default",blank=True,null=True)
    actual_outcome = RichTextUploadingField(config_name="default",blank=True,null=True)
    status = models.CharField(max_length=100,default="Incomplete" )
    comment = RichTextUploadingField(config_name="default",blank=True,null=True)
    remark = RichTextUploadingField(config_name="default",blank=True,null=True)
    modify_history = models.TextField(blank=True, null=True)
    def __str__(self):
        name  = self.testcase.name+'-('+str(self.number)+')'
        return name