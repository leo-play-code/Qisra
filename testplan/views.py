# -*- coding: utf-8 -*-


from binascii import Incomplete
from calendar import c
from cgi import test
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect,JsonResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic.base import TemplateView
from django.forms import inlineformset_factory
from django.shortcuts import render,redirect

from django.conf import settings
from testcase.decorators import allowed_user
from testcase.models import Teststep,Testcase,Tag,testcase_file,teststep_file
from testplan.models import (
    Testplan, Testrun_Teststep, Testrun,Testplan_Group,
    Testrun_file,Testrun_Teststep_file,
    Testrun_tester_upload_file,Teststep_tester_upload_file,
    Testplans,Testplan_count)

import json
import ast
from project.models import Project
from datetime import datetime as dt2
import datetime as dt
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from signup_app.decorators import allowed_user
from simple_history.utils import update_change_reason

# email send import 
from email.mime.multipart import MIMEMultipart
import smtplib
from email.mime.text import MIMEText
from matplotlib.style import context
from validate_email import validate_email

import os
# clone method
from main.clone_method import Clone_Models
# get histroy_dict
from testcase.views import get_history,get_file_data
# get process data
from main.views import get_progress_data_testplan,get_progress_data_testrun

def issue_name_transfor(num):
    orignal_num = num
    max_count_0 = 6
    while num>=1:
        num/=10
        max_count_0-=1
    new_num = ''
    i=0
    while i<max_count_0:
        new_num+='0'
        i+=1
    new_num+=str(orignal_num)
    return new_num

def django_time_transform(django_time):
    '''
    django_time = django time from models
    '''
    format_data = "%Y-%m-%d %H:%M:%S"
    temp_time = str(django_time)
    temp_time = temp_time.split(' ')
    temp_date = temp_time[0]
    try:
        temp_time = (temp_time[1].split('.'))[0]
        temp_time = temp_date+' '+temp_time
        temp_time = dt2.strptime(temp_time, format_data)
        temp_time = temp_time + dt.timedelta(hours=8)
        temp_time = str(temp_time)
        # only need date
        temp_time = (temp_time.split(' '))[0]
    except:
        pass
    # need time
    return temp_time

def send_email_method(msg_list):
    '''
    email : 收件者 Email
    title : Email 標題
    context : Email 內部訊息 , 可是用 HTML 顯示方式
    '''
    content_list = []
    for item in msg_list:
        data = msg_list[item]
        email = item
        print('email=',email)
        title = data['title']
        context = data['context']
        content = MIMEMultipart()  #建立MIMEMultipart物件
        content["subject"] = title #郵件標題
        content["from"] = "ddmtestanswer@gmail.com"  #寄件者
        content["to"] = email #收件者
        content.attach(MIMEText(context, 'html'))  #郵件內容
        content_list.append(content)
    with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # 設定SMTP伺服器
        try:
            smtp.ehlo()  # 驗證SMTP伺服器
            smtp.starttls()  # 建立加密傳輸
            smtp.login("ddmtestanswer@gmail.com", "ougzpuamzcstjjqn")  # 登入寄件者gmail
            for content in content_list:
                try:
                    smtp.send_message(content)  # 寄送郵件
                    print("Complete!")
                except Exception as e:
                    print('error=',e)
            
        except Exception as e:
            print("Error message: ", e)


    


@login_required
@allowed_user(allowed_roles = ['creator'])
def Create_testplan(request):
    name = request.POST['name']
    project = request.POST['project']
    creator = request.POST['creator']
    tag_list = request.POST.getlist('tag_list[]')
    add_testcase_list = request.POST.getlist('testcase_has_checked[]')
    assign = request.POST['assign']
    stage = request.POST['stage']
    start_time = request.POST['start_time']
    stop_time = request.POST['stop_time']
    context = request.POST['contect']
    project_object = Project.objects.get(id = int(project))
    creator_object = User.objects.get(username = creator)
    format_data = "%Y-%m-%d"
    start_time = dt2.strptime(start_time, format_data)
    stop_time = dt2.strptime(stop_time,format_data)
    if assign != 'None':
        assing_object = User.objects.get(username = assign)
        new_testplan = Testplan.objects.create(name=name,project=project_object,creator=creator_object,
                                stage = stage , start_date = start_time,end_date=stop_time,
                                assign=assing_object,text=context,number_issue=0)
    else:
        new_testplan = Testplan.objects.create(name=name,project=project_object,creator=creator_object,
                                stage = stage , start_date = start_time,end_date=stop_time,
                                text=context,number_issue=0)
    for item in tag_list:
        print(item)
        try:
            tag= Tag.objects.get(id=int(item))
            print(tag.name)
            new_testplan.tag.add(tag.id)
        except Exception as e:
            print('error = ',e,item)   
    new_testplan.save()
    testplan_count_obj = Testplan_count.objects.create(testplan=new_testplan)
    testplan_count_obj.save()
    new_testplan.issue_name = 'TP'+issue_name_transfor(testplan_count_obj.id)
    new_testplan.save()
    '''
    create teststep for tester
    '''
    count_number = new_testplan.number_issue
    for item in add_testcase_list:
        '''
        獲取要複製的資料
        '''
        orignal_testcase = Testcase.objects.get(name=item)
        orignal_teststep = Teststep.objects.filter(
            testcase=orignal_testcase).order_by('number')
        orignal_testcase_tag = orignal_testcase.tag.all()
        
        '''
        建立clone檔案
        '''  
        testcasefortestplan = Testrun.objects.create(name=orignal_testcase.name,testplan=new_testplan,description=orignal_testcase.description,
                                                                number=str(count_number+1),testcase=orignal_testcase)
        for item2 in orignal_testcase_tag:
            testcasefortestplan.tag.add(Tag.objects.get(name=item2.name))
        testcasefortestplan.save()
        '''
        file from testcase
        '''
        testcase_file_list = testcase_file.objects.filter(testcase = orignal_testcase)
        for testcase_file_item in testcase_file_list:
            Testrun_file.objects.create(testrun = testcasefortestplan,file=testcase_file_item.file,filename=testcase_file_item.filename,uploader=request.user)
        count_teststep = 0
        for teststep_data in orignal_teststep:
            temp_teststep = Testrun_Teststep.objects.create(testcase=testcasefortestplan,
                                    number=int(teststep_data.number),
                                    description=teststep_data.description,
                                               condition=teststep_data.condition,
                                    actual_outcome='',
                                    remark = teststep_data.remark,) 
            teststep_file_list = teststep_file.objects.filter(teststep = teststep_data)
            for teststep_file_item in teststep_file_list:
                Testrun_Teststep_file.objects.create(teststep = temp_teststep,file=teststep_file_item.file,filename=teststep_file_item.filename,uploader=request.user)
            count_teststep+=1
        count_number+=1
    new_testplan.number_issue = count_number
    new_testplan.save()
    return JsonResponse({'id':str(new_testplan.id)})
@login_required
@allowed_user(allowed_roles = ['creator'])
def Create_testplan_group(request):
    name = request.POST['name']
    project = request.POST['project']
    creator = request.POST['creator']
    tag_list = request.POST.getlist('tag_list[]')
    add_testcase_list = request.POST.getlist('testcase_has_checked[]')
    assign = request.POST['assign']
    stage = request.POST['stage']
    start_time = request.POST['start_time']
    stop_time = request.POST['stop_time']
    context = request.POST['contect']
    project_object = Project.objects.get(id = int(project))
    creator_object = User.objects.get(username = creator)
    format_data = "%Y-%m-%d"
    start_time = dt2.strptime(start_time, format_data)
    stop_time = dt2.strptime(stop_time,format_data)
    if assign != 'None':
        assing_object = User.objects.get(username = assign)
        new_testplan = Testplan_Group.objects.create(name=name,project=project_object,creator=creator_object,
                                stage = stage , start_date = start_time,end_date=stop_time,
                                assign=assing_object,text=context,number_issue=0)
    else:
        new_testplan = Testplan_Group.objects.create(name=name,project=project_object,creator=creator_object,
                                stage = stage , start_date = start_time,end_date=stop_time,
                                text=context,number_issue=0)
    for item in tag_list:
        try:
            tag= Tag.objects.get(id=int(item))
            new_testplan.tag.add(tag.id)
        except Exception as e:
            print('error = ',e,item)   
    
    '''
    create teststep for tester
    '''

    for item in add_testcase_list:
        '''
        獲取要複製的資料
        '''
        new_testplan.testcase_list.add(Testcase.objects.get(name=item).id)
    new_testplan.save()
    testplan_count_obj = Testplan_count.objects.create(testplan_group=new_testplan)
    testplan_count_obj.save()
    new_testplan.issue_name = 'TP'+issue_name_transfor(testplan_count_obj.id)
    new_testplan.save()
    return JsonResponse({'id':str(new_testplan.id)})

@login_required
def Testplan_Group_view(request,pk):
    testplan_group = Testplan_Group.objects.get(id=pk)
    testplan_progress_list = get_progress_data_testplan(testplan_group)
    # Tag from testplan has
    tag_list = []
    for tag in testplan_group.tag.all():
        tag_list.append(tag.name)
    # testcase_list
    testcase_list = []
    testcase_dict = {}
    for testcase in testplan_group.testcase_list.all():
        testcase_list.append(testcase)
        testcase_dict[testcase] = []
    # testplan_list
    testplan_list = []
    testplan_list_object = Testplans.objects.filter(testplan_group=testplan_group)
    for testplan_item in testplan_list_object:
        testplan_list.append(testplan_item)
        temp_testcase_list = Testrun.objects.filter(testplans=testplan_item)
        for testcase_item in testcase_list:
            try:
                testcase_dict[testcase_item].append([testplan_item,Testrun.objects.get(testplans=testplan_item,testcase=testcase_item)])
            except:
                testcase_dict[testcase_item].append([testplan_item,'None'])
     # history dict
    testplan_history_model = testplan_group.history.all()
    history_dict = get_history(testplan_history_model)
    if 'save_info' in request.POST:
        name = request.POST['name']
        assign = request.POST['assign']
        try:
            old_assign = testplan_group.assign.username
            old_assign_obj = testplan_group.assign
        except:
            old_assign = 'None'
        if assign != 'None':
            assign_object = User.objects.get(username=assign)
            testplan_group.assign = assign_object
        else:
            testplan_group.assign = None
        tag_list = request.POST.getlist('tag_list[]')
        testplan_group.name = name
        testplan_group.stage = request.POST['stage']
        format_data = "%Y-%m-%d"
        start_time = dt2.strptime(request.POST['start_date'], format_data)
        stop_time = dt2.strptime(request.POST['end_date'],format_data)
        testplan_group.start_date = start_time
        testplan_group.end_date = stop_time
        '''
        tag edit
        '''
        orignal_tag_list = []
        for item in testplan_group.tag.all():
            orignal_tag_list.append(item.name)
        tag_list_str = ''
        for item in tag_list:
            tag_list_str += (item+' ')
        orignal_tag_list_str = ''
        for item in orignal_tag_list:
            orignal_tag_list_str += (item+' ')
        change_reason = ''
        s = set(orignal_tag_list)
        need_add = [x for x in tag_list if x not in s]
        s = set(tag_list)
        need_delete = [x for x in orignal_tag_list if x not in s]
        if len(need_delete) > 0 or len(need_add) > 0:
            title = '標籤'
            if orignal_tag_list_str.replace(' ', '') != tag_list_str.replace(' ', ''):
                change_reason += "編輯|| {}:|| {}||{}||".format(
                    title, orignal_tag_list_str, tag_list_str)
        for item in need_delete:
            testplan_group.tag.remove(Tag.objects.get(name=item))
        for item in need_add:
            try:
                testplan_group.tag.add(Tag.objects.get(name=item))
            except:
                pass
        #  send email with testplan
        old_status = testplan_group.status
        testplan_group.status = request.POST['status']
        testplan_group.save()
        testplan_list_object = Testplans.objects.filter(testplan_group=testplan_group)
        for testplan_item in testplan_list_object:
            testrun_list = Testrun.objects.filter(testplans=testplan_item)
            for testrun_item in testrun_list:
                testrun_item.assign.remove(testplan_group.assign)
        '''
        # send email
        send_mail_bool = False
        if request.POST['status'] == '2':
            if old_status != request.POST['status']:
                send_mail_bool = True
            elif old_assign != assign and assign!='None':
                send_mail_bool = True
        msg_list = {}
        if send_mail_bool == True:
            try:
                testplan_assign_email = testplan_group.assign.email
                email_title = "[Qisra] Testplan 已開啟" 
                email_context = '<h1><font color="blue">議題詳情</font></h1><hr>\
                                <h3><font>Project 名稱:</font><font color="#FF5733">{testplan_project_name}</font></h3>\
                                <h3><font>Testplan 名稱:</font><font color="#FF5733">{testplan_name}</font></h3>\
                                <h3><font>Testplan 鏈值:</font><font color="#FF5733">{testplan_issue_name}</font></h3>\
                                <h3><font>Testplan 創建人:</font><font color="#FF5733">{testplan_creator}</font></h3>\
                                <h3><font>Testplan 負責人:</font><font color="#FF5733">{testplan_assign}</font></h3>\
                                <h3><font>Testplan Stage:</font><font color="#FF5733">{testplan_stage}</font></h3>\
                                <h3><font>Testplan 開始日期:</font><font color="#FF5733">{testplan_start_date}</font></h3>\
                                <h3><font>Testplan 結束日期:</font><font color="#FF5733">{testplan_end_date}</font></h3>\
                                <h3><font>Testplan 網址:</font><a href="{website_url}"><font color="blue">前往</font></a></h3>\
                                    '.format(testplan_name=testplan_group.name,
                                            testplan_project_name=testplan_group.project.name,
                                            testplan_issue_name = testplan_group.issue_name,
                                            testplan_creator = testplan_group.creator.email,
                                            testplan_assign = testplan_group.assign.username,
                                            testplan_stage = testplan_group.stage,
                                            testplan_start_date = django_time_transform(testplan_group.start_date),
                                            testplan_end_date = django_time_transform(testplan_group.end_date),
                                            website_url = request.build_absolute_uri()
                                            )
                msg_list[testplan_assign_email]={'title':email_title,'context':email_context}
            except Exception as e:
                print('testplan msg_list error =',e)
        if msg_list != {}:
            send_email_method(msg_list)
        msg_list = {}
        #  send email with testrun
        send_mail_bool = False
        if request.POST['status'] == '2' and old_status != request.POST['status']:
            send_mail_bool = True
        if send_mail_bool == True:
            # get all testplan
            temp_testplan_list = Testplans.objects.filter(testplan_group=testplan_group)
            temp_testrun_list = []
            for testplan_item in temp_testplan_list:            
                for testrun_item in Testrun.objects.filter(testplans = testplan_item):
                    temp_testrun_list.append(testrun_item)
            for testrun_item in temp_testrun_list:
                for assign_item in testrun_item.assign.all():
                    try:
                        testrun_assign_email = assign_item.email
                        email_title = "[Qisra] Testrun 已開啟" 
                        email_context = '<h1><font color="blue">議題詳情</font></h1><hr>\
                                        <h3><font>Testplan 名稱:</font><font color="#FF5733">{testplan_name}</font></h3>\
                                        <h3><font>Testrun 名稱:</font><font color="#FF5733">{testrun_name}</font></h3>\
                                        <h3><font>Testrun 鏈值:</font><font color="#FF5733">{testrun_issue_name}</font></h3>\
                                        <h3><font>Testrun 負責人:</font><font color="#FF5733">{testrun_assign}</font></h3>\
                                        <h3><font>Testrun 開始日期:</font><font color="#FF5733">{testrun_start_date}</font></h3>\
                                        <h3><font>Testrun 結束日期:</font><font color="#FF5733">{testrun_end_date}</font></h3>\
                                        <h3><font>Testrun 網址:</font><a href="{website_url}"><font color="blue">前往</font></a></h3>\
                                            '.format(testplan_name = testplan_group.name,
                                                    testrun_name = testrun_item.name,
                                                    testrun_issue_name = testrun_item,
                                                    testrun_assign = assign_item,
                                                    testrun_start_date = django_time_transform(testplan_group.start_date),
                                                    testrun_end_date = django_time_transform(testplan_group.end_date),
                                                    website_url = settings.ROOT_URL+reverse("testrun", args=[testrun_item.pk])
                                                    )
                        try:
                            msg_list[testrun_assign_email]
                            msg_list[testrun_assign_email]['context']+=email_context
                        except:
                            msg_list[testrun_assign_email]={'title':email_title,'context':email_context}
                    except Exception as e:
                        print('testrun msg_list error =',e)
        if msg_list != {}:
            send_email_method(msg_list)
        '''
        # history
        new_record, old_record, *_ = testplan_group.history.all()
        delta = new_record.diff_against(old_record)
        for change in delta.changes:
            if change.field == 'project':
                title = 'project'
            elif change.field == 'name':
                title = '名稱'
            elif change.field == 'stage':
                title = 'Stage'
            elif change.field == 'start_date':
                title = '開始日'
            elif change.field == 'end_date':
                title = '結束日'
            elif change.field == 'assign':
                title = '負責人'
            elif change.field == 'status':
                title = '狀態'
            if change.field != 'assign':
                print('change.old',change.old,'change.new',change.new)
                if change.field == 'status':
                    if change.old == '1':
                        changeold = 'pending'
                    elif change.old == '2':
                        changeold = '進行中'
                    elif change.old == '3':
                        changeold = '未開始'
                    else:
                        changeold = '關閉'
                    
                    if change.new == '1':
                        changenew = 'pending'
                    elif change.new == '2':
                        changenew = '進行中'
                    elif change.new == '3':
                        changenew = '未開始'
                    else:
                        changenew = '關閉'
                    change_reason += "編輯|| {}:\n|| {}|| {} ||".format(
                        title, changeold, changenew)
                else:
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
            update_change_reason(testplan_group, change_reason)
    elif 'save_context_data' in request.POST:
        testplan_group.text = request.POST['context']
        testplan_group.save()
        new_record, old_record, *_ = testplan_group.history.all()
        delta = new_record.diff_against(old_record)
        change_reason = ''
        for change in delta.changes:
            if change.field == 'text':
                title = '描述'
            change_reason = "編輯|| {}:\n|| {}|| {} ||".format(
                title, change.old, change.new)
        if change_reason != '':
            update_change_reason(testplan_group, change_reason)
    elif 'save_testcase' in request.POST:
        add_testcase_list = request.POST.getlist('testcase_list[]')
        testcase_list_name = ''
        for item in add_testcase_list:
            testplan_group.testcase_list.add(Testcase.objects.get(id=int(item)))
            testcase_list_name += (Testcase.objects.get(id=int(item)).name+'\n')
        testplan_group.save()
        # history
        change_reason = ''
        
        change_reason = "添加|| {}:\n|| {}|| {} ||".format(
            'Testcase','',testcase_list_name)
        if change_reason != '':
            update_change_reason(testplan_group, change_reason)

        
    elif 'save_testplan' in request.POST:
        name = request.POST['name']
        new_testplan = Testplans.objects.create(testplan_group=testplan_group,name=name,number_issue=0)
        new_testplan.save()
        testplan_group.save()
        # history
        change_reason = ''
        change_reason = "添加|| {}:\n|| {}|| {} ||".format(
            'Testplan','',name)
        if change_reason != '':
            update_change_reason(testplan_group, change_reason)
        return JsonResponse({'id':new_testplan.id,'name':new_testplan.name})
    elif 'create_testrun' in request.POST:
        testrun_list = request.POST.getlist('testrun[]')
        print(testrun_list)
        for testrun_item in testrun_list:
            testrun_item_list = testrun_item.split('-')
            temp_testplan_id = testrun_item_list[1]
            temp_testcase_id = testrun_item_list[3]
            temp_testplan = Testplans.objects.get(id=int(temp_testplan_id))
            temp_testplan.testcase_list.add(int(temp_testcase_id))
            temp_testplan.save()
            Testcase_to_Testrun(temp_testplan,temp_testcase_id)
    elif 'upload_testplan' in request.POST:
        testplan_group.status = '1'
        testplan_group.save()
    elif 'delete_verify' in request.POST:
        testplan_group.delete()
        return redirect('Dashboard')  
    elif 'clone' in request.POST:
        loc_dt = dt2.today() 
        loc_dt_format = loc_dt.strftime("%Y-%m-%d %H:%M:%S")
        temp_clone_list = str(testplan_group.name).split('-clone')
        clonename = temp_clone_list[0]+'-clone-'+str(loc_dt_format)
        name = clonename
        tag_list = testplan_group.tag.all()
        add_testcase_list = testplan_group.testcase_list.all()
        assign = testplan_group.assign
        stage = testplan_group.stage
        start_time = testplan_group.start_date
        stop_time = testplan_group.end_date
        context = testplan_group.text
        project_object =  testplan_group.project
        creator_object = request.user
        if assign != None:
            assing_object = User.objects.get(username = assign)
            new_testplan = Testplan_Group.objects.create(name=name,project=project_object,creator=creator_object,
                                    stage = stage , start_date = start_time,end_date=stop_time,
                                    assign=assing_object,text=context,number_issue=0)
        else:
            new_testplan = Testplan_Group.objects.create(name=name,project=project_object,creator=creator_object,
                                    stage = stage , start_date = start_time,end_date=stop_time,
                                    text=context,number_issue=0)
        for item in tag_list:
            try:
                new_testplan.tag.add(item)
            except Exception as e:
                print('error = ',e)
        '''
        create teststep for tester
        '''

        for item in add_testcase_list:
            '''
            獲取要複製的資料
            '''
            new_testplan.testcase_list.add(item)
        new_testplan.save()
        testplan_count_obj = Testplan_count.objects.create(testplan_group=new_testplan)
        testplan_count_obj.save()
        new_testplan.issue_name = 'TP'+issue_name_transfor(testplan_count_obj.id)
        new_testplan.save()
        return HttpResponseRedirect(reverse("testplan_group_view", args=[new_testplan.pk]))
    
    context = {'testplan_group':testplan_group,'history_dict':history_dict,'tag_list':tag_list,'testcase_list':testcase_list,
               'testplan_list':testplan_list,'testcase_dict':testcase_dict,'testplan_progress_list':testplan_progress_list}
    return render(request,'testplan/Testplan_group_view.html',context)

def Testcase_to_Testrun(temp_testplan,temp_testcase_id):
    orignal_testcase = Testcase.objects.get(id=int(temp_testcase_id))
    orignal_teststep = Teststep.objects.filter(
        testcase=orignal_testcase).order_by('number')
    orignal_testcase_tag = orignal_testcase.tag.all()
    count_number = temp_testplan.testplan_group.number_issue
    assign = temp_testplan.testplan_group.assign
    testcasefortestplan = Testrun.objects.create(name=orignal_testcase.name,testplans=temp_testplan,description=orignal_testcase.description,
                                                                number=count_number+1,testcase=orignal_testcase)
    temp_testplan.testplan_group.number_issue = count_number+1
    temp_testplan.number_issue = len(Testrun.objects.filter(testplans=temp_testplan))
    temp_testplan.testplan_group.save()
    temp_testplan.save()

    for item2 in orignal_testcase_tag:
        testcasefortestplan.tag.add(Tag.objects.get(name=item2.name))
    testcasefortestplan.save()
    '''
    file from testcase
    '''
    testcase_file_list = testcase_file.objects.filter(testcase = orignal_testcase)
    for testcase_file_item in testcase_file_list:
        Testrun_file.objects.create(testrun = testcasefortestplan,file=testcase_file_item.file,filename=testcase_file_item.filename,uploader=testcase_file_item.uploader)
    count_teststep = 0
    for teststep_data in orignal_teststep:
        temp_teststep = Testrun_Teststep.objects.create(testcase=testcasefortestplan,
                                number=int(teststep_data.number),
                                description=teststep_data.description,
                                condition=teststep_data.condition,
                                actual_outcome='',
                                remark = teststep_data.remark,) 
        teststep_file_list = teststep_file.objects.filter(teststep = teststep_data)
        for teststep_file_item in teststep_file_list:
            Testrun_Teststep_file.objects.create(teststep = temp_teststep,file=teststep_file_item.file,filename=teststep_file_item.filename,uploader=teststep_file_item.uploader)
        count_teststep+=1
@login_required
def Testplanview(request,pk):
    testplan = Testplan.objects.get(id=pk)
    testrun = Testrun.objects.filter(testplan=testplan).order_by('id')
    current_user = request.user
    temp_blank = ''
    # get progress of testplan
    testplan_progress_list = get_progress_data_testplan(testplan)
    # get progress of testcase
    testrun_list  = []
    testrun_dict = {}
    testrun = Testrun.objects.filter(testplan=testplan).order_by('id')
    for item in testrun:
        testrun_list.append(item.name)
        testrun_dict[item] = get_progress_data_testrun(item)
    # Tag from testplan has
    tag_list = []
    for tag in testplan.tag.all():
        tag_list.append(tag.name)
    # count teststep
    count_step = 0
    for item in testrun:
        count_step+=Testrun_Teststep.objects.filter(testcase=item).count()
    # history dict
    testplan_history_model = testplan.history.all()
    history_dict = get_history(testplan_history_model)
    
    if 'save_info' in request.POST:
        name = request.POST['name']
        assign = request.POST['assign']
        try:
            old_assign = testplan.assign.username
        except:
            old_assign = 'None'
        for item in testrun:
            try:
                assing_object = testplan.assign
                item.assign.remove(assing_object)
            except Exception as e:
                print('error = ', e)
        if assign != 'None':
            assign_object = User.objects.get(username=assign)
            testplan.assign = assign_object
        else:
            testplan.assign = None
        tag_list = request.POST.getlist('tag_list[]')
        testplan.name = name
        testplan.stage = request.POST['stage']
        format_data = "%Y-%m-%d"
        start_time = dt2.strptime(request.POST['start_date'], format_data)
        stop_time = dt2.strptime(request.POST['end_date'],format_data)
        testplan.start_date = start_time
        testplan.end_date = stop_time
        '''
        tag edit
        '''
        orignal_tag_list = []
        for item in testplan.tag.all():
            orignal_tag_list.append(item.name)
        tag_list_str = ''
        for item in tag_list:
            tag_list_str += (item+' ')
        orignal_tag_list_str = ''
        for item in orignal_tag_list:
            orignal_tag_list_str += (item+' ')
        change_reason = ''
        s = set(orignal_tag_list)
        need_add = [x for x in tag_list if x not in s]
        s = set(tag_list)
        need_delete = [x for x in orignal_tag_list if x not in s]
        if len(need_delete) > 0 or len(need_add) > 0:
            title = '標籤'
            if orignal_tag_list_str.replace(' ', '') != tag_list_str.replace(' ', ''):
                change_reason += "編輯|| {}:|| {}||{}||".format(
                    title, orignal_tag_list_str, tag_list_str)
        for item in need_delete:
            testplan.tag.remove(Tag.objects.get(name=item))
        for item in need_add:
            try:
                testplan.tag.add(Tag.objects.get(name=item))
            except:
                pass
        #  send email with testplan
        old_status = testplan.status
        testplan.status = request.POST['status']
        testplan.save()
        testrun = Testrun.objects.filter(testplan=testplan).order_by('id')
        for testrun_item in testrun:
            testrun_item.assign.remove(testplan.assign)
        '''
        send_mail_bool = False
        if request.POST['status'] == '2':
            if old_status != request.POST['status']:
                send_mail_bool = True
            elif old_assign != assign and assign!='None':
                send_mail_bool = True
        msg_list = {}
        if send_mail_bool == True:
            try:
                testplan_assign_email = testplan.assign.email
                email_title = "[Qisra] Testplan 已開啟" 
                email_context = '<h1><font color="blue">議題詳情</font></h1><hr>\
                                <h3><font>Project 名稱:</font><font color="#FF5733">{testplan_project_name}</font></h3>\
                                <h3><font>Testplan 名稱:</font><font color="#FF5733">{testplan_name}</font></h3>\
                                <h3><font>Testplan 鏈值:</font><font color="#FF5733">{testplan_issue_name}</font></h3>\
                                <h3><font>Testplan 創建人:</font><font color="#FF5733">{testplan_creator}</font></h3>\
                                <h3><font>Testplan 負責人:</font><font color="#FF5733">{testplan_assign}</font></h3>\
                                <h3><font>Testplan Stage:</font><font color="#FF5733">{testplan_stage}</font></h3>\
                                <h3><font>Testplan 開始日期:</font><font color="#FF5733">{testplan_start_date}</font></h3>\
                                <h3><font>Testplan 結束日期:</font><font color="#FF5733">{testplan_end_date}</font></h3>\
                                <h3><font>Testplan 網址:</font><a href="{website_url}"><font color="blue">前往</font></a></h3>\
                                    '.format(testplan_name=testplan.name,
                                            testplan_project_name=testplan.project.name,
                                            testplan_issue_name = testplan.issue_name,
                                            testplan_creator = testplan.creator.email,
                                            testplan_assign = testplan.assign.username,
                                            testplan_stage = testplan.stage,
                                            testplan_start_date = django_time_transform(testplan.start_date),
                                            testplan_end_date = django_time_transform(testplan.end_date),
                                            website_url = request.build_absolute_uri()
                                            )
                msg_list[testplan_assign_email]={'title':email_title,'context':email_context}
            except:
                pass
        if msg_list != {}:
            send_email_method(msg_list)
        msg_list = {}
        #  send email with testrun
        send_mail_bool = False
        if request.POST['status'] == '2' and old_status != request.POST['status']:
            send_mail_bool = True
        if send_mail_bool == True:
            for testrun_item in testrun:
                for assign_item in testrun_item.assign.all():
                    try:
                        testrun_assign_email = assign_item.email
                        email_title = "[Qisra] Testrun 已開啟" 
                        email_context = '<h1><font color="blue">議題詳情</font></h1><hr>\
                                        <h3><font>Testplan 名稱:</font><font color="#FF5733">{testplan_name}</font></h3>\
                                        <h3><font>Testrun 名稱:</font><font color="#FF5733">{testrun_name}</font></h3>\
                                        <h3><font>Testrun 鏈值:</font><font color="#FF5733">{testrun_issue_name}</font></h3>\
                                        <h3><font>Testrun 負責人:</font><font color="#FF5733">{testrun_assign}</font></h3>\
                                        <h3><font>Testrun 開始日期:</font><font color="#FF5733">{testrun_start_date}</font></h3>\
                                        <h3><font>Testrun 結束日期:</font><font color="#FF5733">{testrun_end_date}</font></h3>\
                                        <h3><font>Testrun 網址:</font><a href="{website_url}"><font color="blue">前往</font></a></h3>\
                                            '.format(testplan_name = testplan.name,
                                                    testrun_name = testrun_item.name,
                                                    testrun_issue_name = testrun_item,
                                                    testrun_assign = assign_item,
                                                    testrun_start_date = django_time_transform(testplan.start_date),
                                                    testrun_end_date = django_time_transform(testplan.end_date),
                                                    website_url = settings.ROOT_URL+reverse("testrun", args=[testrun_item.pk])
                                                    )
                        msg_list[testrun_assign_email]={'title':email_title,'context':email_context}
                    except:pass
        if msg_list != {}:
            send_email_method(msg_list)
        '''
        new_record, old_record, *_ = testplan.history.all()
        delta = new_record.diff_against(old_record)
        for change in delta.changes:
            if change.field == 'project':
                title = 'project'
            elif change.field == 'name':
                title = '名稱'
            elif change.field == 'stage':
                title = 'Stage'
            elif change.field == 'start_date':
                title = '開始日'
            elif change.field == 'end_date':
                title = '結束日'
            elif change.field == 'assign':
                title = '負責人'
            elif change.field == 'status':
                title = '狀態'
            if change.field != 'assign':
                if change.field == 'status':
                    if change.old == '1':
                        changeold = 'pending'
                    elif change.old == '2':
                        changeold = '進行中'
                    elif change.old == '3':
                        changeold = '未開始'
                    else:
                        changeold = '關閉'
                    
                    if change.new == '1':
                        changenew = 'pending'
                    elif change.new == '2':
                        changenew = '進行中'
                    elif change.new == '3':
                        changenew = '未開始'
                    else:
                        changenew = '關閉'
                    change_reason += "編輯|| {}:\n|| {}|| {} ||".format(
                        title, changeold, changenew)
                else:
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
            update_change_reason(testplan, change_reason)
    elif 'save_context_data' in request.POST:
        testplan.text = request.POST['context']
        testplan.save()
        new_record, old_record, *_ = testplan.history.all()
        delta = new_record.diff_against(old_record)
        change_reason = ''
        for change in delta.changes:
            if change.field == 'text':
                title = '描述'
            change_reason = "編輯|| {}:\n|| {}|| {} ||".format(
                title, change.old, change.new)
        if change_reason != '':
            update_change_reason(testplan, change_reason)
    elif 'upload_testplan' in request.POST:
        testplan.status = '1'
        testplan.save()
    elif 'save_testcase' in request.POST:
        add_testcase_list = request.POST.getlist('testcase_list[]')
        '''
        create teststep for tester
        '''
        count_number = testplan.number_issue
        change_reason = ''
        for item in add_testcase_list:
            '''
            獲取要複製的資料
            '''
            orignal_testcase = Testcase.objects.get(id=int(item))
            temp_testcase_name = orignal_testcase.name
            orignal_teststep = Teststep.objects.filter(
                testcase=orignal_testcase).order_by('number')
            orignal_testcase_tag = orignal_testcase.tag.all()
            '''
            建立clone檔案
            '''
            testcasefortestplan = Testrun.objects.create(name=orignal_testcase.name,testplan=testplan,description=orignal_testcase.description,
                                                                     number=str(count_number+1),testcase=orignal_testcase)
            for item2 in orignal_testcase_tag:
                testcasefortestplan.tag.add(Tag.objects.get(name=item2.name))
            testcasefortestplan.save()
            # clone file from testcase 
            testcase_file_list = testcase_file.objects.filter(testcase = orignal_testcase)
            for item in testcase_file_list:
                Testrun_file.objects.create(testrun = testcasefortestplan,file=item.file,filename=item.filename,uploader=request.user)
            # clone teststep
            for teststep_data in orignal_teststep:
                new_teststep = Testrun_Teststep.objects.create(testcase=testcasefortestplan,
                                        number=int(teststep_data.number),
                                        description=teststep_data.description,
                                        condition=teststep_data.condition,
                                        actual_outcome='',
                                        remark = teststep_data.remark,) 
                temp_teststep_file_list = teststep_file.objects.filter(teststep = teststep_data)
                for file_item in temp_teststep_file_list:
                    Testrun_Teststep_file.objects.create(teststep = new_teststep,file=file_item.file,filename=file_item.filename,uploader=request.user)
            count_number+=1
            change_reason += "添加||TestCase\n|| {}||{}|| ".format(
                temp_blank,temp_testcase_name)
        testplan.number_issue = count_number
        testplan.save()
        
        if change_reason != '':
            update_change_reason(testplan, change_reason)
    elif 'delete_verify' in request.POST:
        testplan.delete()
        return redirect('Dashboard')  
    elif 'delete_testrun_verify' in request.POST:
        id = request.POST['id']
        target_testrun = Testrun.objects.get(id=int(id))
        testrun_list  = []
        try:
            testcase_id = target_testrun.testcase.id
            testcase_name = target_testrun.testcase.name
            testrun_list.append([testcase_id,testcase_name])
        except:
            pass
        target_testrun.delete()
        return JsonResponse({'testrun_list':testrun_list})
    elif 'clone' in request.POST:
        testplanclone = Clone_Models(request.user,'testplan',testplan)
        return HttpResponseRedirect(reverse("testplan_view", args=[testplanclone.pk]))
    context = {'testplan':testplan,'tag_list':tag_list,'testrun_dict':testrun_dict,'testrun_list':testrun_list,
               'count_step': count_step, 'testplan_progress_list': testplan_progress_list, 'history_dict': history_dict}
    return render(request,'testplan/TestplanView_new.html',context)


@login_required
def Testrunview(request,pk):
    testrun = Testrun.objects.get(id=pk)
    teststep_list = Testrun_Teststep.objects.filter(
        testcase=testrun).order_by('id')
    temp_blank = ''
    # assign for testrun
    assign_list = []
    for item in testrun.assign.all():
        assign_list.append(item.username)
    # progress of testrun
    temp_value_list = get_progress_data_testrun(testrun)
    # Tag for testrun
    tag_list = []
    for tag in testrun.tag.all():
        tag_list.append(tag.name)
    # Testrun_Teststep Form List
    teststepset = inlineformset_factory(Testrun, Testrun_Teststep, fields=('number','description','condition','actual_outcome','status','remark'), extra=0)
    form_teststep_list = teststepset(instance=testrun,queryset=Testrun_Teststep.objects.order_by('id'))
    # history dict
    testrun_history_model = testrun.history.all()
    history_dict = get_history(testrun_history_model)
    '''
    testrun file list from creator
    '''
    testrun_file_list = Testrun_file.objects.filter(testrun = testrun)
    '''
    testrun file list from tester
    '''
    testrun_tester_file_list = Testrun_tester_upload_file.objects.filter(testrun = testrun)
    '''
    teststep from testrun file list
    '''
    teststep_file_dict = {}
    for teststep_item in teststep_list:
        teststep_file_dict[teststep_item] = [Testrun_Teststep_file.objects.filter(teststep = teststep_item),
                                             Teststep_tester_upload_file.objects.filter(teststep = teststep_item)]

    context = {'testrun': testrun, 'tag_list': tag_list,'teststep_list': teststep_list, 'form_teststep_list': form_teststep_list,
               'temp_value_list': temp_value_list, 'assign_list': assign_list, 'history_dict': history_dict,
               'testrun_file_list':testrun_file_list,'teststep_file_dict':teststep_file_dict,'testrun_tester_file_list':testrun_tester_file_list}
    if 'delete_verify' in request.POST:
        try:
            url_name = 'testplan_view'
            return_testplan = testrun.testplan.id
        except:
            url_name = 'testplan_group_view'
            return_testplan = testrun.testplans.testplan_group.id
        testrun.delete()
        return HttpResponseRedirect(reverse(url_name, args=[return_testplan]))
    elif 'save_info' in request.POST:
        change_reason = ''
        '''
        assign edit
        '''
        assign_list = request.POST.getlist('assign[]')
        orignal_assign_list = []
        for item in testrun.assign.all():
            orignal_assign_list.append(item.username)
        assign_list_str = ''
        for item in assign_list:
            if item != 'None':
                assign_list_str += (item+' ')
        orignal_assign_list_str = ''
        for item in orignal_assign_list:
            if item != 'None':
                orignal_assign_list_str += (item+' ')
        s = set(orignal_assign_list)
        need_add = [x for x in assign_list if x not in s]
        # send email
        send_mail_bool = False
        if testrun.testplan:
            if testrun.testplan.status == '2' and len(need_add) > 0:
                send_mail_bool = True
            target_testplan = testrun.testplan
        else:
            if testrun.testplans.testplan_group.status == '2' and len(need_add) > 0:
                send_mail_bool = True
            target_testplan = testrun.testplans.testplan_group
        '''
        msg_list = {}
        print('send_mail_bool=',send_mail_bool)
        if send_mail_bool == True:
            for item in need_add:
                try:
                    assign_item = User.objects.get(username=item)
                    # try:
                    testrun_assign_email = assign_item.email
                    email_title = "[Qisra] Testrun 已開啟" 
                    email_context = '<h1><font color="blue">議題詳情</font></h1><hr>\
                                    <h3><font>Testplan 名稱:</font><font color="#FF5733">{testplan_name}</font></h3>\
                                    <h3><font>Testrun 名稱:</font><font color="#FF5733">{testrun_name}</font></h3>\
                                    <h3><font>Testrun 鏈值:</font><font color="#FF5733">{testrun_issue_name}</font></h3>\
                                    <h3><font>Testrun 負責人:</font><font color="#FF5733">{testrun_assign}</font></h3>\
                                    <h3><font>Testrun 開始日期:</font><font color="#FF5733">{testrun_start_date}</font></h3>\
                                    <h3><font>Testrun 結束日期:</font><font color="#FF5733">{testrun_end_date}</font></h3>\
                                    <h3><font>Testrun 網址:</font><a href="{website_url}"><font color="blue">前往</font></a></h3>\
                                        '.format(testplan_name = target_testplan.name,
                                                testrun_name = testrun.name,
                                                testrun_issue_name = testrun,
                                                testrun_assign = assign_item,
                                                testrun_start_date = django_time_transform(target_testplan.start_date),
                                                testrun_end_date = django_time_transform(target_testplan.end_date),
                                                website_url = settings.ROOT_URL+reverse("testrun", args=[testrun.pk])
                                                )
                    msg_list[testrun_assign_email]={'title':email_title,'context':email_context}
                except Exception as e:
                    print('send email error=',e)
                # except:pass
        if msg_list != {}:
            send_email_method(msg_list)
        '''
        
        
        
        s = set(assign_list)
        need_delete = [x for x in orignal_assign_list if x not in s]
        title = '負責人'
        if len(need_delete) > 0 or len(need_add) > 0:
            if orignal_assign_list_str.replace(' ', '') != assign_list_str.replace(' ', ''):
                change_reason += "編輯|| {}:|| {}||{}||".format(
                    title, orignal_assign_list_str, assign_list_str)
        for item in need_delete:
            testrun.assign.remove(User.objects.get(username=item))
        for item in need_add:
            try:
                testrun.assign.add(User.objects.get(username=item))
            except:
                pass 
        testrun.save()
        new_record, old_record, *_ = testrun.history.all()
        delta = new_record.diff_against(old_record)
        for change in delta.changes:
            if change.field == 'name':
                title = '名稱'
            elif change.field == 'assign':
                title = '負責人'
            elif change.field == 'status':
                title = '狀態'
            if change.field != 'assign':
                change_reason += "編輯||{}:\n|| {} || {} ||".format(
                    title, change.old, change.new)
            else:
                try:
                    tempold = User.objects.get(id=int(change.old)).username
                except:
                    tempold = 'None'
                try:
                    tempnew = User.objects.get(id=int(change.new)).username
                except:
                    tempnew = 'None'
                change_reason += "編輯||{}:\n|| {} || {} ||".format(
                    title, tempold, tempnew)
        if change_reason != '':
            update_change_reason(testrun, change_reason)
    elif 'upload_file_to_testcase' in request.POST:
        newdoc = Testrun_tester_upload_file(
            filename=request.FILES['file'].name, file=request.FILES['file'],testrun = testrun,uploader=request.user)
        newdoc.save()
        # get file data
        file_path,filename,temp_time=get_file_data(newdoc)
        
        # history
        change_reason = ''
        change_reason += "添加|| {}:\n || {}|| {} ||".format(
            '附件',temp_blank, newdoc.filename)
        testrun.save()
        if change_reason != '':
            update_change_reason(testrun, change_reason)
        
        return JsonResponse({'id':str(newdoc.id),'path':file_path,'filename':filename,'upload_time':temp_time,'uploader':newdoc.uploader.username})
    elif 'delete_upload_file' in request.POST:
        delete_id = request.POST['delete_id']
        newdoc = Testrun_tester_upload_file.objects.get(id=int(delete_id))
        filename = newdoc.filename
        file_path = newdoc.file.path
        newdoc.delete()
        os.remove(file_path)
        # history
        change_reason = ''
        change_reason += "刪除|| {}:\n || {}|| {} ||".format(
            '附件',filename, temp_blank)
        testrun.save()
        if change_reason != '':
            update_change_reason(testrun, change_reason)
    elif 'upload_file_to_teststep' in request.POST:
        # need to build model of upload file
        temp_id = request.POST['id']
        temp_teststep = Testrun_Teststep.objects.get(id=temp_id)
        newdoc = Teststep_tester_upload_file(
            filename=request.FILES['file'].name, file=request.FILES['file'],teststep = temp_teststep,uploader=request.user)
        newdoc.save()
        # get file data
        file_path,filename,temp_time=get_file_data(newdoc)
        # history
        change_reason = ''
        change_reason += "添加附件|| 編號-{}:\n || {}|| {} ||".format(
            str(temp_teststep.number),temp_blank, newdoc.filename)
        testrun.save()
        if change_reason != '':
            update_change_reason(testrun, change_reason)
        return JsonResponse({'id':str(newdoc.id),'path':file_path,'filename':filename,'upload_time':temp_time,'uploader':newdoc.uploader.username})
    elif 'delete_teststep_file' in request.POST:
        delete_id = request.POST['delete_id']
        newdoc = Teststep_tester_upload_file.objects.get(id=int(delete_id))
        temp_teststep = newdoc.teststep
        filename = newdoc.filename
        file_path = newdoc.file.path
        newdoc.delete()
        os.remove(file_path)
        # history
        change_reason = ''
        change_reason += "刪除附件|| 編號-{}:\n || {}|| {} ||".format(
            temp_teststep.number,filename, temp_blank)
        testrun.save()
        if change_reason != '':
            update_change_reason(testrun, change_reason)
    elif 'save_context_data' in request.POST:
        testrun.description = request.POST['context']
        testrun.save()
        new_record, old_record, *_ = testrun.history.all()
        delta = new_record.diff_against(old_record)
        change_reason = ''
        for change in delta.changes:
            if change.field == 'description':
                title = '描述'
            change_reason = "編輯||{}:\n|| {} || {}||".format(
                title, change.old, change.new)
        if change_reason != '':
            update_change_reason(testrun, change_reason)
    elif 'save_teststep' in request.POST:
        fail_count = 0
        Incomplete_count = 0
        pass_count = 0
        omitt_count = 0
        block_count = 0 
        count_all = 0
        change_reason = ''
        print('testrun name',testrun.name,testrun.id)
        for item in request.POST:
            if '-' in item:
                target_list = item.split('-')
                target_name = target_list[0]
                target_num = int(target_list[1])
                if 'outcome' in target_name:
                    temp_teststep = Testrun_Teststep.objects.get(
                        testcase=testrun, number=target_num)
                    temp_teststep.actual_outcome = request.POST[item]
                elif 'status' in target_name:
                    temp_teststep = Testrun_Teststep.objects.get(testcase=testrun,number=target_num)
                    temp_status = request.POST[item]
                    temp_teststep.status = temp_status
                    if 'Incomplete' in temp_status:
                        Incomplete_count+=1
                    elif 'Failed' in temp_status:
                        fail_count+=1
                    elif 'Passed' in temp_status:
                        pass_count +=1
                    elif 'Omitted' in temp_status:
                        omitt_count +=1
                    elif 'Blocked' in temp_status:
                        block_count +=1
                    count_all += 1
                temp_teststep.save()
                new_record, old_record, *_ = temp_teststep.history.all()
                delta = new_record.diff_against(old_record)
                for change in delta.changes:
                    if change.field == 'actual_outcome':
                        title = '實際結果'
                    elif change.field == 'status':
                        title = 'Status'
                    change_reason += "更改|| 編號{}-{}:\n|| {}||{}||".format(
                        str(target_num), title, change.old, change.new)
        
        if count_all == Incomplete_count:
            testrun.status = 'Incomplete'
        else:
            if Incomplete_count < 1 :
                if fail_count>0:
                    testrun.status = 'Failed'
                else:
                    testrun.status = 'Passed'
            else:
                testrun.status = 'Ongoing'
        testrun.save()
        if change_reason != '':
            update_change_reason(testrun, change_reason)
        temp_value_list = get_progress_data_testrun(testrun)
        return JsonResponse({'temp_value_list':temp_value_list,'status':testrun.status,'last_time':testrun.date_modify})
    return render(request,'testplan/testrunview.html',context)



