from django.contrib import admin
from django.urls import re_path,path
from . import views

urlpatterns = [
    re_path(r"^new_test1/$", views.TestcaseNew_test, name="testcases-create-test"),
    re_path(r"^new_tag/$", views.add_tag, name="new_tag"),
    re_path(r"^(?P<pk>\d+)/teststep/$", views.TestStepView, name="teststep"),
]
