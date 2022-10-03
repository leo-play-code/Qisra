from itertools import chain
import numbers
from django.contrib import messages
from django.http import HttpResponseRedirect,JsonResponse
from django.shortcuts import render,redirect
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
import pandas as pd
from project.models import Project,Client
from django.contrib.auth.models import User
from testcase.models import Tag
from datetime import datetime as dt2
from testcase.views import get_history
from testplan.models import (
    Testplan, Testplan_Group, Testrun_Teststep, Testrun,
    Testrun_file,Testrun_Teststep_file)
from django.contrib.auth.decorators import login_required
from simple_history.utils import update_change_reason
# clone method
from main.clone_method import Clone_Models
@login_required
def add_client(request):
    bool_exists = False
    new_client_name = request.GET['client_name']
    try:
        Client.objects.get(name=new_client_name)
        bool_exists = True
    except:
        new_client = Client.objects.create(name=new_client_name)
        return JsonResponse({'name':new_client_name,'id':str(new_client.id),'status':'pass'})
    if bool_exists == True:
        return JsonResponse({'name':new_client_name,'status':'fail'})

# get history dict
@login_required
def Create_Project(request):
    print(request.POST)
    name = request.POST['name']
    creator = request.user
    assign = request.POST['assign']
    description = request.POST['description']
    tag_list = request.POST.getlist('tag_list[]')
    start_time = request.POST['start_time']
    stop_time = request.POST['stop_time']
    client = request.POST['client'] 
    creator_object = User.objects.get(username = creator.username)
    if assign != 'None':
        assign_object = User.objects.get(username = assign)
        new_project =Project.objects.create(name=name,creator=creator_object,assign=assign_object,
                                    description= description)
    else:
        new_project =Project.objects.create(name=name,creator=creator_object,description= description)
    if client != 'None':
        new_project.client = Client.objects.get(name=client)
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
            tag= Tag.objects.get(id=int(item))
            print(tag.name)
            new_project.tag.add(tag.id)
        except Exception as e:
            print('error = ',e,item)   
    new_project.save()
    return JsonResponse({'id':str(new_project.id)})


@login_required
def project_view(request,pk):
    project = Project.objects.get(id=pk)
    tag_list = []
    for item in project.tag.all():
        tag_list.append(item.name)
    # testrun count of project 
    testplan_count = Testplan.objects.filter(project=project).count()
    testplan_list = Testplan.objects.filter(project=project).order_by('status')
    testplan_group_list = Testplan_Group.objects.filter(project=project).order_by('status')
    testplan_count+=Testplan_Group.objects.filter(project=project).count()

    
    # history dict
    project_history_model = project.history.all()
    history_dict = get_history(project_history_model)
    if 'save_info' in request.POST:
        # update data
        name = request.POST['name']
        assign = request.POST['assign']
        client = request.POST['client']
        if assign != 'None':
            assign_object = User.objects.get(username=assign)
            project.assign = assign_object
        else:
            project.assign = None
        if client != 'None':
            client_object = Client.objects.get(name=client)
            project.client = client_object
        else:
            project.client = None
        tag_list = request.POST.getlist('tag_list[]')
        project.name = name
        format_data = "%Y-%m-%d"
        try:
            start_time = dt2.strptime(request.POST['start_date'], format_data)
            project.start_date = start_time
        except:pass
        try:
            stop_time = dt2.strptime(request.POST['end_date'],format_data)
            project.end_date = stop_time
        except:pass
        '''
        tag edit
        '''
        orignal_tag_list = []
        for item in project.tag.all():
            orignal_tag_list.append(item.name)
        change_reason = ''
        tag_list_str = ''
        for item in tag_list:
            tag_list_str += (item+' ')
        orignal_tag_list_str = ''
        for item in orignal_tag_list:
            orignal_tag_list_str += (item+' ')
        s = set(orignal_tag_list)
        need_add= [x for x in tag_list if x not in s]
        s = set(tag_list)
        need_delete = [x for x in orignal_tag_list if x not in s]
        if len(need_delete) > 0 or len(need_add) > 0:
            title = '標籤'
            if orignal_tag_list_str.replace(' ', '') != tag_list_str.replace(' ', ''):
                change_reason += "編輯|| {}:|| {}||{}||".format(
                    title, orignal_tag_list_str, tag_list_str)
        for item in need_delete:
            project.tag.remove(Tag.objects.get(name=item))
        for item in need_add:
            try:
                project.tag.add(Tag.objects.get(name=item))
            except:
                pass
        # save update comment
        project.save()
        new_record, old_record, *_ = project.history.all()
        delta = new_record.diff_against(old_record)
        for change in delta.changes:
            if change.field == 'assign':
                title = '負責人'
            elif change.field == 'start_date':
                title = '開始日'
            elif change.field == 'end_date':
                title = '結束日'
            elif change.field == 'name':
                title = '名稱'
            if change.field != 'assign':
                change_reason += "編輯|| {}:\n|| {}|| {} ||".format(
                    title, change.old, change.new)
            else:
                try:
                    tempold = User.objects.get(id=int(change.old)).username
                except:
                    tempold = '未指派'
                try:
                    tempnew = User.objects.get(id=int(change.new)).username
                except:
                    tempnew = '未指派'
                change_reason += "編輯|| {}:\n|| {}|| {} ||".format(
                    title, tempold, tempnew)
        if change_reason != '':
            update_change_reason(project, change_reason)
    elif 'delete_verify' in request.POST:
        project.delete()
        return redirect('Dashboard')  
    elif 'save_context_data' in request.POST:
        project.description = request.POST['context']
        project.save()        
        new_record, old_record, *_ = project.history.all()
        delta = new_record.diff_against(old_record)
        change_reason = ''
        for change in delta.changes:
            if change.field == 'description':
                title = '描述'
            change_reason = "編輯|| {}:\n|| {}||{}||".format(
                title, change.old, change.new)
        if change_reason != '':
            update_change_reason(project, change_reason)
    elif 'clone' in request.POST:
        new_project = Clone_Models(request.user,'project',project)
        return HttpResponseRedirect(reverse("project_view", args=[new_project.pk]))

    context = {'project':project,'tag_list':tag_list,'testplan_count':testplan_count,'testplan_list':testplan_list,
               'history_dict': history_dict,'testplan_group_list':testplan_group_list}
    return render(request,'project/project_view.html',context)