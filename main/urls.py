from django.contrib import admin
from django.urls import path,include,re_path
from . import views
urlpatterns = [
    re_path(r"^base_navbar/$", views.base_navbar),
    path("", views.DashboardView.as_view(),name="Dashboard"),
]
