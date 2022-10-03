from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from simple_history.models import HistoricalRecords


'''
teststep class models
'''


class Tag(models.Model):
    name = models.CharField(max_length=100, null=True)
    description = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    creator = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    history = HistoricalRecords(cascade_delete_history=True)
    def __str__(self):
        return self.name


class Testcase(models.Model):
    name = models.CharField(max_length=500, null=True, blank=True)
    description = RichTextField()
    tag = models.ManyToManyField(Tag)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    date_modify = models.DateTimeField(auto_now=True, null=True, blank=True)
    creator = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Testcase_creator')
    history = HistoricalRecords(cascade_delete_history=True)

    def __str__(self):
        return self.name


class Teststep(models.Model):
    testcase = models.ForeignKey(
        Testcase, null=True, on_delete=models.CASCADE)
    number = models.IntegerField()
    description = RichTextField()
    condition = RichTextField()
    remark = RichTextField()
    history = HistoricalRecords(cascade_delete_history=True)

    def __str__(self):
        name = self.testcase.name+'-('+str(self.number)+')'
        return name


class testcase_import_excel(models.Model):
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/excel/')
    def __str__(self):
        return self.filename

class testcase_file(models.Model):
    testcase = models.ForeignKey(
        Testcase, null=True, on_delete=models.CASCADE)
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/testcase_excel/')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    uploader = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='testcase_file_uploader')
    def __str__(self):
        return self.filename

        
class teststep_file(models.Model):
    teststep = models.ForeignKey(
        Teststep, null=True, on_delete=models.CASCADE)
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/teststep_excel/')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    uploader = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='teststep_file_uploader')
    def __str__(self):
        return self.filename