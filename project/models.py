from django.db import models
from django.contrib.auth.models import User
from testcase.models import TagNewTestcase


class CreateProject(models.Model):
    name = models.CharField(max_length=200 , null=True)
    create_date = models.DateTimeField(auto_now_add=True , null=True)
    start_date = models.DateField(null= True , blank= True)
    end_date = models.DateField(null = True , blank = True)
    update_date = models.DateTimeField(auto_now=True , null= True)
    tag = models.ManyToManyField(TagNewTestcase)
    description = models.CharField(max_length=200 , blank= True , null=True)
    creator = models.ForeignKey(User , null= True , on_delete=models.SET_NULL,related_name='create_set')
    assign = models.ForeignKey(User , null= True , on_delete=models.SET_NULL,related_name='assign_set')
    def __str__(self):
        return self.name
    