from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render,redirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
import pandas as pd
from project.models import CreateProject
from django.contrib.auth.models import User
from testcase.models import TagNewTestcase
from datetime import datetime as dt2
def Create_Project(request):
    print(request.POST)
    name = request.POST['name']
    creator = request.POST['creator']
    assign = request.POST['assign']
    description = request.POST['description']
    tag_list = request.POST.getlist('tag_list[]')
    start_time = request.POST['start_time']
    stop_time = request.POST['stop_time']
    creator_object = User.objects.get(username = creator)
    
    if assign != 'None':
        assign_object = User.objects.get(username = assign)
        new_project =CreateProject.objects.create(name=name,creator=creator_object,assign=assign_object,
                                    description= description)
    else:
        new_project =CreateProject.objects.create(name=name,creator=creator_object,description= description)
    format_data = "%Y-%m-%d"
    print(start_time,stop_time)
    if start_time != '':
        start_time = dt2.strptime(start_time, format_data)
        new_project.start_date = start_time
    if stop_time != '':
        stop_time = dt2.strptime(stop_time,format_data)
        new_project.end_date = stop_time
    for item in tag_list:
        print(item)
        try:
            tag= TagNewTestcase.objects.get(id=int(item))
            print(tag.name)
            new_project.tag.add(tag.id)
        except Exception as e:
            print('error = ',e,item)   
    new_project.save()
    return redirect('Dashboard')  