from django.contrib import admin
from django.urls import path,include,re_path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    re_path(r"^signup_url/", views.signup, name="signup_url"),
]
