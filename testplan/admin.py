# -*- coding: utf-8 -*-
from django.contrib import admin
from testplan.models import TestPlan_test,TeststepforTestplan,TestCaseforTestplan



class TestCaseforTestplanAdmin(admin.ModelAdmin):
    search_fields = ("testplan","name", "id","tag")
    list_display = ("id","testplan", "name","date_created")
    list_filter = ("id", "testplan","name", "tag","date_created")
class TeststepforTestplanAdmin(admin.ModelAdmin):
    search_fields = ("id","testcase", "number","description","status")
    list_display = ("id","testcase", "number","description","status")
    list_filter = ("id","testcase", "number","description","status")
class TestPlan_testAdmin(admin.ModelAdmin):
    search_fields = ("name", "assign","stage","create_date",'end_date')
    list_display = ("name", "assign","stage","create_date",'end_date')
    list_filter = ("name", "assign","stage","create_date",'end_date')

admin.site.register(TestPlan_test,TestPlan_testAdmin)
admin.site.register(TeststepforTestplan,TeststepforTestplanAdmin)
admin.site.register(TestCaseforTestplan,TestCaseforTestplanAdmin)

