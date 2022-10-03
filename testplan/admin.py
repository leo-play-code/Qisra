# -*- coding: utf-8 -*-
from django.contrib import admin
from testplan.models import (
    Testplan, Testrun_Teststep, Testrun,Testplan_Group,
    Testrun_file,Testrun_Teststep_file,
    Testrun_tester_upload_file,Teststep_tester_upload_file,
    Testplans)



class TestrunAdmin(admin.ModelAdmin):
    search_fields = ("testplan","name", "id","tag")
    list_display = ('__str__', "name","date_created","date_modify")
    list_filter = ("id", "testplan","name", "tag","date_created")
class Testrun_TeststepAdmin(admin.ModelAdmin):
    search_fields = ("id","testcase", "number","status")
    list_display = ("id","testcase", "number","status")
    list_filter = ("id","testcase", "number","status")
class TestPlanAdmin(admin.ModelAdmin):
    search_fields = ("name", "assign","stage","create_date",'end_date')
    list_display = ('__str__',"name", "assign","stage","create_date",'end_date')
    list_filter = ("name", "assign","stage","create_date",'end_date')
class Testplan_GroupAdmin(admin.ModelAdmin):
    search_fields = ("name", "assign","stage","create_date",'end_date')
    list_display = ('__str__',"name", "assign","stage","create_date",'end_date')
    list_filter = ("name", "assign","stage","create_date",'end_date')


admin.site.register(Testrun_file)
admin.site.register(Testrun_tester_upload_file)
admin.site.register(Teststep_tester_upload_file)
admin.site.register(Testrun_Teststep_file)
admin.site.register(Testplan,TestPlanAdmin)
admin.site.register(Testrun_Teststep,Testrun_TeststepAdmin)
admin.site.register(Testrun,TestrunAdmin)


admin.site.register(Testplan_Group,Testplan_GroupAdmin)
admin.site.register(Testplans)




