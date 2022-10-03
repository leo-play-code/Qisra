from django.contrib import admin
from testcase.models import (
    Teststep,
    Testcase,
    Tag,
    testcase_import_excel,
    testcase_file,teststep_file
)
# Register your models here.
class TestcaseAdmin(admin.ModelAdmin):
    search_fields = ("name", "id","tag")
    list_display = ("id", "name","date_created")
    list_filter = ("id", "name", "tag","date_created")

class TagAdmin(admin.ModelAdmin):
    search_fields = ("name", "id")
    list_display = ("id", "name", "description")
    list_filter = ("id", "name", "description")

class TeststepAdmin(admin.ModelAdmin):
    search_fields = ("id","testcase", "number")
    list_display = ("id","testcase", "number")
    list_filter = ("id","testcase", "number")

admin.site.register(teststep_file)
admin.site.register(testcase_file)
admin.site.register(testcase_import_excel)
admin.site.register(Testcase,TestcaseAdmin)
admin.site.register(Teststep,TeststepAdmin)
admin.site.register(Tag,TagAdmin)