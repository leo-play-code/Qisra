from django.contrib import admin
from project.models import CreateProject



class CreateProjectAdmin(admin.ModelAdmin):
    search_fields = ("id","name","create_date", "update_date","description","creator")
    list_display = ("id","name","create_date", "update_date","description","creator")
    list_filter = ("id","name","create_date", "update_date","description","creator")


admin.site.register(CreateProject,CreateProjectAdmin)

