from django.contrib import admin
from project.models import Project
from simple_history.admin import SimpleHistoryAdmin


class ProjectAdmin(SimpleHistoryAdmin):
    search_fields = ("id", "name", "create_date",
                     "update_date", "description", "creator")
    history_list_display = ( "name",
                            "update_date")
    list_filter = ("id","name","create_date", "update_date","description","creator")


admin.site.register(Project, ProjectAdmin)

