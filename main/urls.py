from django.contrib import admin
from django.urls import path,include,re_path
from django.contrib.auth.decorators import login_required
from . import views
urlpatterns = [
    re_path(r"^base_navbar/$", views.base_navbar),
    path("", login_required(views.DashboardView.as_view()),name="Dashboard"),
    path(r"profile_view/",views.profile_view ,name="profile_view"),
    path(r"div_table/",views.test_div ,name="div_table"),
]
