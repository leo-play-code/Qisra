from django.db import models
from testcase.models import Tag, Testcase
from project.models import Project
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from simple_history.models import HistoricalRecords









# testplan group
class Testplan_Group(models.Model):
    '''
    紀錄現在testplan group 有多少個testrun
    '''
    class Status(models.TextChoices):
        Pending = "1", "pending"
        Ongoing = "2", "Ongoing"
        Not_start = "3", "Not_start"
        Closed = "4", "Closed"
    project = models.ForeignKey(
        Project, null=True, on_delete=models.CASCADE)
    number_issue = models.IntegerField(null=True, blank=True)
    issue_name = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=100, null=True)
    stage = models.CharField(max_length=100, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True, null=True)
    update_date = models.DateTimeField(auto_now=True, null=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    text = RichTextField()
    status = models.CharField(
        max_length=100,
        choices=Status.choices,
        default=Status.Not_start,
    )
    history = HistoricalRecords(cascade_delete_history=True)
    tag = models.ManyToManyField(Tag)
    creator = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Testplan_group_creator', blank=True)
    assign = models.ForeignKey(User, null=True, on_delete=models.SET_NULL,
                               related_name='Testplan_group_assign', blank=True)
    testcase_list = models.ManyToManyField(Testcase)
    def __str__(self):
        return self.name
    
    
class Testplans(models.Model):
    '''
    number_issue : 紀錄testplan的testrun數量
    '''
    testplan_group = models.ForeignKey(
        Testplan_Group, null=True, on_delete=models.CASCADE, blank=True)
    name = models.CharField(max_length=100, null=True)
    number_issue = models.IntegerField(null=True, blank=True)
    testcase_list = models.ManyToManyField(Testcase)
    def __str__(self):
        return self.testplan_group.name+'-'+self.name
    


class Testplan(models.Model):
    class Status(models.TextChoices):
        Pending = "1", "pending"
        Ongoing = "2", "Ongoing"
        Not_start = "3", "Not_start"
        Closed = "4", "Closed"
    project = models.ForeignKey(
        Project, null=True, on_delete=models.CASCADE)
    number_issue = models.IntegerField(null=True, blank=True)
    issue_name = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=100, null=True)
    stage = models.CharField(max_length=100, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True, null=True)
    update_date = models.DateTimeField(auto_now=True, null=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    text = RichTextField()
    status = models.CharField(
        max_length=100,
        choices=Status.choices,
        default=Status.Not_start,
    )
    history = HistoricalRecords(cascade_delete_history=True)
    tag = models.ManyToManyField(Tag)
    creator = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Testplan_creator', blank=True)
    assign = models.ForeignKey(User, null=True, on_delete=models.SET_NULL,
                               related_name='Testplan_assign', blank=True)
    def __str__(self):
        return self.issue_name

class Testrun(models.Model):
    class Status(models.TextChoices):
        Ongoing = "Ongoing", "Ongoing"
        Passed = "Passed", "Passed"
        Failed = "Failed", "Failed"
        Incomplete = 'Incomplete', 'Incomplete'
    number = models.CharField(max_length=100, null=True, blank=True)
    testcase = models.ForeignKey(
        Testcase, null=True, on_delete=models.SET_NULL, blank=True)
    testplan = models.ForeignKey(
        Testplan, null=True, on_delete=models.CASCADE ,blank=True)
    testplans = models.ForeignKey(
        Testplans, null=True, on_delete=models.CASCADE ,blank=True)
    name = models.CharField(max_length=500, null=True, blank=True)
    tag = models.ManyToManyField(Tag)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    date_modify = models.DateTimeField(auto_now=True, null=True, blank=True)
    description = RichTextField()
    status = models.CharField(
        max_length=100,
        choices=Status.choices,
        default=Status.Incomplete,
    )
    assign = models.ManyToManyField(User, related_name='Testrun_assign')
    history = HistoricalRecords(cascade_delete_history=True)
    def __str__(self):
        if self.testplan == None:
            return self.testplans.name+'-'+str(self.number)
        else:
            return self.testplan.name+'-'+str(self.number)


class Testrun_Teststep(models.Model):
    class Status(models.TextChoices):
        Incomplete = "Incomplete", "Incomplete"
        Passed = "Passed", "Passed"
        Failed = "Failed", "Failed"
        Blocked = "Blocked", "Blocked"
        Omitted = "Omitted", "Omitted"
    testcase = models.ForeignKey(
        Testrun, null=True, on_delete=models.CASCADE)
    number = models.IntegerField()
    description = RichTextField()
    condition = RichTextField()
    actual_outcome = RichTextField()
    status = models.CharField(
        max_length=100,
        choices=Status.choices,
        default=Status.Incomplete,
    )
    remark = RichTextField()
    history = HistoricalRecords(cascade_delete_history=True)

    def __str__(self):
        name = self.testcase.name+'-('+str(self.number)+')'
        return name

class Testrun_file(models.Model):
    testrun = models.ForeignKey(
        Testrun, null=True, on_delete=models.CASCADE, blank=True)
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/testrun_excel/')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    uploader = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Testrun_file_uploader')
    def __str__(self):
        return self.filename
    


class Testrun_Teststep_file(models.Model):
    teststep = models.ForeignKey(
        Testrun_Teststep, null=True, on_delete=models.CASCADE, blank=True)
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/testrun_teststep/')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    uploader = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Testrun_Teststep_file_uploader')
    def __str__(self):
        return self.filename


class Testrun_tester_upload_file(models.Model):
    testrun = models.ForeignKey(
        Testrun, null=True, on_delete=models.CASCADE, blank=True)
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/testrun_excel/')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    uploader = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Testrun_tester_upload_file_uploader')
    def __str__(self):
        return self.filename



class Teststep_tester_upload_file(models.Model):
    teststep = models.ForeignKey(
        Testrun_Teststep, null=True, on_delete=models.CASCADE, blank=True)
    filename = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(upload_to='uploads/testrun_teststep_excel/')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    uploader = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name='Teststep_tester_upload_file_uploader')
    def __str__(self):
        return self.filename
    


    
    
# class Testruns(models.Model):
#     '''
#     number : 紀錄testplan group 第幾個testrun
#     '''
#     class Status(models.TextChoices):
#         Ongoing = "Ongoing", "Ongoing"
#         Passed = "Passed", "Passed"
#         Failed = "Failed", "Failed"
#         Incomplete = 'Incomplete', 'Incomplete'
#     number = models.IntegerField(null=True, blank=True)
#     testcase = models.ForeignKey(
#         Testcase, null=True, on_delete=models.SET_NULL, blank=True)
#     testplan = models.ForeignKey(
#         Testplans, null=True, on_delete=models.CASCADE, blank=True)
#     name = models.CharField(max_length=500, null=True, blank=True)
#     date_created = models.DateTimeField(auto_now_add=True, null=True)
#     date_modify = models.DateTimeField(auto_now=True, null=True, blank=True)
#     description = RichTextField()
#     status = models.CharField(
#         max_length=100,
#         choices=Status.choices,
#         default=Status.Incomplete,
#     )
#     assign = models.ManyToManyField(User, related_name='Testruns_assign')
#     history = HistoricalRecords(cascade_delete_history=True)
#     def __str__(self):
#         if self.testplan == None:
#             return str(self.id)
#         else:
#             return self.testplan.name+'-'+str(self.number)
       
        
    
# class Testruns_Teststep(models.Model):
#     class Status(models.TextChoices):
#         Incomplete = "Incomplete", "Incomplete"
#         Passed = "Passed", "Passed"
#         Failed = "Failed", "Failed"
#         Blocked = "Blocked", "Blocked"
#         Omitted = "Omitted", "Omitted"
#     testrun = models.ForeignKey(
#         Testruns, null=True, on_delete=models.CASCADE)
#     number = models.IntegerField()
#     description = RichTextField()
#     condition = RichTextField()
#     actual_outcome = RichTextField()
#     status = models.CharField(
#         max_length=100,
#         choices=Status.choices,
#         default=Status.Incomplete,
#     )
#     remark = RichTextField()
#     history = HistoricalRecords(cascade_delete_history=True)
#     def __str__(self):
#         name = self.testrun.name+'-('+str(self.number)+')'
#         return name
    
    

# class Testruns_file(models.Model):
#     testrun = models.ForeignKey(
#         Testruns, null=True, on_delete=models.CASCADE, blank=True)
#     filename = models.CharField(max_length=100, null=True, blank=True)
#     file = models.FileField(upload_to='uploads/testrun_excel/')
#     date_created = models.DateTimeField(auto_now_add=True, null=True)
#     uploader = models.ForeignKey(
#         User, null=True, on_delete=models.SET_NULL, related_name='Testruns_file_uploader')
#     def __str__(self):
#         return self.filename
    
# class Testruns_Teststep_file(models.Model):
#     teststep = models.ForeignKey(
#         Testruns_Teststep, null=True, on_delete=models.CASCADE, blank=True)
#     filename = models.CharField(max_length=100, null=True, blank=True)
#     file = models.FileField(upload_to='uploads/testrun_teststep/')
#     date_created = models.DateTimeField(auto_now_add=True, null=True)
#     uploader = models.ForeignKey(
#         User, null=True, on_delete=models.SET_NULL, related_name='Testruns_Teststep_file_uploader')
#     def __str__(self):
#         return self.filename
    
    
# class Testruns_tester_upload_file(models.Model):
#     testrun = models.ForeignKey(
#         Testruns, null=True, on_delete=models.CASCADE, blank=True)
#     filename = models.CharField(max_length=100, null=True, blank=True)
#     file = models.FileField(upload_to='uploads/testrun_excel/')
#     date_created = models.DateTimeField(auto_now_add=True, null=True)
#     uploader = models.ForeignKey(
#         User, null=True, on_delete=models.SET_NULL, related_name='Testruns_tester_upload_file_uploader')
#     def __str__(self):
#         return self.filename
    
# class Testruns_Teststep_tester_upload_file(models.Model):
#     teststep = models.ForeignKey(
#         Testruns_Teststep, null=True, on_delete=models.CASCADE, blank=True)
#     filename = models.CharField(max_length=100, null=True, blank=True)
#     file = models.FileField(upload_to='uploads/testrun_teststep_excel/')
#     date_created = models.DateTimeField(auto_now_add=True, null=True)
#     uploader = models.ForeignKey(
#         User, null=True, on_delete=models.SET_NULL, related_name='Testruns_Teststep_tester_upload_file_uploader')
#     def __str__(self):
#         return self.filename
    