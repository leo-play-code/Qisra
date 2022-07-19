from django.contrib import admin
from django.urls import path,include,re_path
from django.http import HttpResponse
from . import views


urlpatterns = [
    re_path(r"^CreateProject/$", views.Create_Project, name="CreateProject"),
]
