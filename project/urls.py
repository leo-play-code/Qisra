from django.contrib import admin
from django.urls import path,include,re_path
from django.http import HttpResponse
from . import views


urlpatterns = [
    re_path(r"^CreateProject/$", views.Create_Project, name="CreateProject"),
    re_path(r"^(?P<pk>\d+)/project/", views.project_view, name="project_view"),
    re_path(r"^new_client/$", views.add_client, name="new_client"),
]
