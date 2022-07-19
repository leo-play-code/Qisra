# -*- coding: utf-8 -*-

from django.urls import re_path

from testplan import views

urlpatterns = [
    re_path(r"^CreateTestplan/",views.Create_testplan,name="CreateTestplan"),
    re_path(r"^(?P<pk>\d+)/testplan_view/",views.TestPlanView_test,name="testplan_view"),
    re_path(r"^(?P<pk>\d+)/teststepfortestplanview/",views.TeststepforTestplanView,name="teststepfortestplanview"),
    re_path(r"^search_test/$", views.TestPlanSearchView_template.as_view(), name="plans_search_test"),
    
]
