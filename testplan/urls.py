# -*- coding: utf-8 -*-

from django.urls import re_path

from testplan import views

urlpatterns = [
    re_path(r"^CreateTestplan/",views.Create_testplan,name="CreateTestplan"),
    re_path(r"^Create_Testplan_group/",views.Create_testplan_group,name="Create_Testplan_Group"),

    re_path(r"^(?P<pk>\d+)/testplan_view/",views.Testplanview, name="testplan_view"),
    re_path(r"^(?P<pk>\d+)/testplan_group_view/",views.Testplan_Group_view, name="testplan_group_view"),
   
    re_path(r"^(?P<pk>\d+)/testrun/",views.Testrunview,name="testrun"),
]
