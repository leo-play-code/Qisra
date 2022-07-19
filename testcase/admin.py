from django.contrib import admin
from testcase.models import (
    Teststep,
    TestCasetest,
    TagNewTestcase,
    save_excel,
)
# Register your models here.
class TestCasetestAdmin(admin.ModelAdmin):
    search_fields = ("name", "id","tag")
    list_display = ("id", "name","date_created")
    list_filter = ("id", "name", "tag","date_created")

class TagNewTestcaseAdmin(admin.ModelAdmin):
    search_fields = ("name", "id")
    list_display = ("id", "name", "description")
    list_filter = ("id", "name", "description")

class TeststepAdmin(admin.ModelAdmin):
    search_fields = ("id","testcase", "number","description")
    list_display = ("id","testcase", "number","description")
    list_filter = ("id","testcase", "number","description")



admin.site.register(save_excel)
admin.site.register(TestCasetest,TestCasetestAdmin)
admin.site.register(Teststep,TeststepAdmin)
admin.site.register(TagNewTestcase,TagNewTestcaseAdmin)