# -*- coding: utf-8 -*-


from django.contrib.auth.models import User
from django.http import HttpResponseRedirect,JsonResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic.base import TemplateView
from django.forms import inlineformset_factory
from django.shortcuts import render,redirect
from testplan.forms import (
    Testplan_test_form,
    Teststepfortestplanform
    
)
from testcase.decorators import allowed_user
from testcase.models import Teststep,TestCasetest,TagNewTestcase
from testplan.models import TestPlan_test,TeststepforTestplan,TestCaseforTestplan
import json
import ast
from project.models import CreateProject
from datetime import datetime as dt2



status = ['Incomplete','Passed','Failed','Blocked','Omitted']
# @allowed_user(allowed_roles=['creator'])
def Create_testplan(request):
    print('testplan',request.POST)
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
    project_object = CreateProject.objects.get(id = int(project))
    creator_object = User.objects.get(username = creator)
    
    format_data = "%Y-%m-%d"
    start_time = dt2.strptime(start_time, format_data)
    stop_time = dt2.strptime(stop_time,format_data)
   
    if assign != 'None':
        assing_object = User.objects.get(username = assign)
        new_testplan = TestPlan_test.objects.create(name=name,project=project_object,creator=creator_object,
                                stage = stage , start_date = start_time,end_date=stop_time,
                                assign=assing_object,text=context)
    else:
        new_testplan = TestPlan_test.objects.create(name=name,project=project_object,creator=creator_object,
                                stage = stage , start_date = start_time,end_date=stop_time,text=context)
    for item in tag_list:
        print(item)
        try:
            tag= TagNewTestcase.objects.get(id=int(item))
            print(tag.name)
            new_testplan.tag.add(tag.id)
        except Exception as e:
            print('error = ',e,item)   
    new_testplan.save()
    '''
    create teststep for tester
    '''
    for item in add_testcase_list:
        '''
        獲取要複製的資料
        '''
        orignal_testcase = TestCasetest.objects.get(name=item)
        orignal_teststep = Teststep.objects.filter(testcase = orignal_testcase)
        orignal_testcase_tag = orignal_testcase.tag.all()
        '''
        建立clone檔案
        '''
        testcasefortestplan = TestCaseforTestplan.objects.create(name=orignal_testcase.name,testplan=new_testplan)
        for item2 in orignal_testcase_tag:
            testcasefortestplan.tag.add(TagNewTestcase.objects.get(name=item2.name))
        testcasefortestplan.save()

        for teststep_data in orignal_teststep:
            TeststepforTestplan.objects.create(testcase=testcasefortestplan,
                                    number=str(teststep_data.number),
                                    description=teststep_data.description,
                                    condition=teststep_data.condition,
                                    actual_outcome='',
                                    comment = '',
                                    remark=teststep_data.remark,) 
    return JsonResponse({'id':str(new_testplan.id)})



# 'save_info': ['save_info'], 'testcasename': ['newtestplan2123'], 
# 'tag_list[]': ['new1', 'new2', '111'], 'context': ['<p>new tsetplan2 descriptionfasdfsdaf</p>\n'],
# 'stage': ['EVT0'], 'assign': ['leo'], 'start_date': ['2022-07-15'], 
# 'end_date': ['2023-10-24'], 'activate': ['true']}>

def Testplanview(request,pk):
    testplan = TestPlan_test.objects.get(id=pk)
    tag_list = []
    for tag in testplan.tag.all():
        tag_list.append(tag.name)
    count = TestCaseforTestplan.objects.filter(testplan=testplan).count
    testrun = TestCaseforTestplan.objects.filter(testplan=testplan)
    if 'save_info' in request.POST:
        print('save_info')
        print(request.POST)
        name = request.POST['name']
        assign = request.POST['assign']
        if assign != 'None':
            assign_object = User.objects.get(username=assign)
            testplan.assign = assign_object
        else:
            testplan.assign = None
        tag_list = request.POST.getlist('tag_list[]')
        testplan.name = name
        testplan.text = request.POST['context']
        testplan.stage = request.POST['stage']
        format_data = "%Y-%m-%d"
        start_time = dt2.strptime(request.POST['start_date'], format_data)
        stop_time = dt2.strptime(request.POST['end_date'],format_data)
        testplan.start_date = start_time
        testplan.end_date = stop_time
        for item in testplan.tag.all():
            testplan.tag.remove(item)
        for item in tag_list:
            try:
                testplan.tag.add(TagNewTestcase.objects.get(name=item))
            except:
                pass
        if request.POST['activate'] == 'true':
            testplan.is_activate = True
        else:
            testplan.is_activate = False
        testplan.save()
        
    context = {'testplan':testplan,'tag_list':tag_list,'count':count,'testrun':testrun}
    return render(request,'testplan/TestplanView_new.html',context)


class TestPlanSearchView_template(TemplateView):
    template_name = "testplans/search_new_testplan.html"
    def get_context_data(self, **kwargs):
        '''
        data : 要顯示的資料
        tag_list : 已經選擇的tag
        Tag_object_list : 將已經選擇的tag object 並和到list裡面
        '''
        form = Testplan_test_form(self.request.GET)
        group_allow = ['creator']
        group = None
        group_len = None
        creator_bool = False
        if self.request.user.groups.exists():
            print(self.request.user.groups.all())
            group_len = len(self.request.user.groups.all())
        print('group=',group,'allow=',group_allow)
        if group_len != None:
            i=0
            while i<group_len:
                group = self.request.user.groups.all()[i].name
                if group in group_allow:
                    creator_bool = True
                i+=1
        if creator_bool == True:
            testplans = TestPlan_test.objects.all()
        else:
            testplans = TestPlan_test.objects.filter(is_activate = True)
        testplan_html = []
        stage_choices = ['','None','EVT0 Test','EVT1 Test','EVT2 Test','DVT Test','PVT Test','F/W modify Test','H/W modify Test']
        creator_list = []
        for instance in testplans:
            testplan_datetime = (instance.create_date).strftime("%Y-%m-%d, %H:%M:%S")
            testplan_startdate = (instance.start_date).strftime("%Y-%m-%d")
            testplan_enddate = (instance.end_date).strftime("%Y-%m-%d")
            testplan_html.append({'pk': instance.pk, 'name': instance.name,'assign':instance.assign,'stage':instance.stage,'start_date':testplan_startdate,'end_date':testplan_enddate,'datecreated':testplan_datetime,'creator':instance.creator,'is_activate':instance.is_activate})
            if instance.creator not in creator_list:
                creator_list.append(instance.creator)
        testplan_html = json.dumps(testplan_html)
        print(testplan_html)
        '''
        user list
        '''
        users = User.objects.all()
        user_list = ['']
        for user in users:
            if user.username != 'AnonymousUser':
                user_list.append(user.username)
        context = {"form": form,'testplans':testplans,'testplan_html':testplan_html,
                "stage_choices":stage_choices,'user_list':user_list,'creator_bool':creator_bool,
                'creator_list':creator_list}
        # print(context['testplan_html'])
        return context
    


def TestPlanView_test(request,pk):
    group_allow = ['creator']
    group = None
    group_len = None
    edit_clone_btn_cansee = False
    if request.user.groups.exists():
        print(request.user.groups.all())
        group_len = len(request.user.groups.all())
    if group_len != None:
        i=0
        while i<group_len:
            group = request.user.groups.all()[i].name
            if group in group_allow:
                edit_clone_btn_cansee = True
            i+=1
    testplan = TestPlan_test.objects.get(id=pk)
    if testplan.creator == request.user.username:
        creator_bool =True
    else:
        creator_bool = False
    testcase_list = TestCaseforTestplan.objects.filter(testplan=testplan)
    testcase_count = testcase_list.count()
    testplan_html = [{'pk':testplan.pk,'name':testplan.name,'assign':testplan.assign,'stage':testplan.stage}]
    testplan_html = json.dumps(testplan_html)
    user_list = []
    TestplanForm = Testplan_test_form(instance=testplan)
    '''
    data for progress bar
    '''
    progress_dict = {}
    for instance in testcase_list:
        teststep = TeststepforTestplan.objects.filter(testcase = instance)
        status_list = [0,0,0,0,0,0]
        for item in teststep:
            temp_status = item.status
            if temp_status == 'Failed':
                status_list[1]+=1
            elif temp_status == 'Incomplete':
                status_list[4]+=1
            elif temp_status == 'Passed':
                status_list[0]+=1
            elif temp_status == 'Blocked':
                status_list[2]+=1
            elif temp_status == 'Omitted':
                status_list[3]+=1
            status_list[5]+=1
        status_list[5] = status_list[5]/100
        progress_dict[instance] = status_list
    print(progress_dict)
    '''
    testcase list 
    '''
    testcase_intestplan = []
    for instance in testcase_list:
        # print(type(instance.date_created))
        testcase_datetime = (instance.date_created).strftime("%Y-%m-%d, %H:%M:%S")
        tag_list_object = instance.tag.all()
        tag_list = []
        for tag_object in tag_list_object:
            tag_list.append(tag_object.name)
        testcase_intestplan.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list,'datecreated':testcase_datetime})
    testcase_intestplan = json.dumps(testcase_intestplan)
    '''
    Testcase list all
    '''
    testcase_html= []
    data = TestCasetest.objects.all()
    for instance in data:
        # print(type(instance.date_created))
        testcase_datetime = (instance.date_created).strftime("%Y-%m-%d, %H:%M:%S")
        tag_list_object = instance.tag.all()
        tag_list = []
        for tag_object in tag_list_object:
            tag_list.append(tag_object.name)
        testcase_html.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list,'datecreated':testcase_datetime})
    testcase_html = json.dumps(testcase_html)
    '''
    user list
    '''
    users = User.objects.all()
    user_list = []
    for user in users:
        if user.username != 'AnonymousUser':
            user_list.append(user.username)
    '''
    stage list
    '''
    Tag_object = TagNewTestcase.objects.all()
    tag_list_text=[]
    stage_choices = ['None','EVT0 Test','EVT1 Test','EVT2 Test','DVT Test','PVT Test','F/W modify Test','H/W modify Test']
    '''
    setup index
    '''
    selected_testcase_list = []
    '''
    allow_clone
    '''
    if '-clone' in str(testplan.name):
        allow_clone = False
    else:
        allow_clone = True
    if request.POST:
        '''
        避免名字重複
        '''
        if 'save' in request.POST:
            detect_exist_name=False
            testplan_name = request.POST['testplan_name']
            assign = request.POST['assign']
            stage = request.POST['stage']
            start_date = request.POST['start_date']
            end_date = request.POST['stop_date']       
            selected_testcase_list = request.POST.get('selected_testcase_list')
            selected_testcase_list = ast.literal_eval(selected_testcase_list)
            text = request.POST['text']
            if testplan.name != testplan_name:
                try:
                    testplanview = TestPlan_test.objects.get(name = testplan_name)
                    if testplan.pk != testplanview.pk:
                        detect_exist_name = True
                except:
                    testplan.name = testplan_name
                    testplan.assign = assign
                    testplan.stage = stage
                    testplan.start_date = start_date
                    testplan.end_date = end_date
                    testplan.text = text
                    have_testcase = TestCaseforTestplan.objects.filter(testplan=testplan)
                    have_testcase_list = []
                    for temp_have_testcase in have_testcase:
                        have_testcase_list.append(temp_have_testcase.name)
                    for item in selected_testcase_list:
                        if item not in have_testcase_list:
                            '''
                            獲取要複製的資料
                            '''
                            orignal_testcase = TestCasetest.objects.get(name=item)
                            orignal_teststep = Teststep.objects.filter(testcase = orignal_testcase)
                            orignal_testcase_tag = orignal_testcase.tag.all()
                            '''
                            建立clone檔案
                            '''
                            testcasefortestplan = TestCaseforTestplan.objects.create(name=orignal_testcase.name,testplan=testplan)
                            for item2 in orignal_testcase_tag:
                                testcasefortestplan.tag.add(TagNewTestcase.objects.get(name=item2.name))
                            testcasefortestplan.save()
                            for teststep_data in orignal_teststep:
                                TeststepforTestplan.objects.create(testcase=testcasefortestplan,
                                                        number=str(teststep_data.number),
                                                        description=teststep_data.description,
                                                        condition=teststep_data.condition,
                                                        actual_outcome='',
                                                        comment = '',
                                                        remark=teststep_data.remark,
                                                        modify_history=teststep_data.modify_history,) 
                    for item in have_testcase_list:
                        if item not in selected_testcase_list:
                            temp_delete_testcase = TestCaseforTestplan.objects.get(name=item,testplan=testplan)
                            temp_delete_testcase.delete()
                    testplan.save()
            else:
                testplan.name = testplan_name
                testplan.assign = assign
                testplan.stage = stage
                testplan.start_date = start_date
                testplan.end_date = end_date
                testplan.text = text
                have_testcase = TestCaseforTestplan.objects.filter(testplan=testplan)
                have_testcase_list = []
                for temp_have_testcase in have_testcase:
                    have_testcase_list.append(temp_have_testcase.name)
                for item in selected_testcase_list:
                    if item not in have_testcase_list:
                        '''
                        獲取要複製的資料
                        '''
                        orignal_testcase = TestCasetest.objects.get(name=item)
                        orignal_teststep = Teststep.objects.filter(testcase = orignal_testcase)
                        orignal_testcase_tag = orignal_testcase.tag.all()
                        '''
                        建立clone檔案
                        '''
                        testcasefortestplan = TestCaseforTestplan.objects.create(name=orignal_testcase.name,testplan=testplan)
                        for item2 in orignal_testcase_tag:
                            testcasefortestplan.tag.add(TagNewTestcase.objects.get(name=item2.name))
                        testcasefortestplan.save()
                        for teststep_data in orignal_teststep:
                            TeststepforTestplan.objects.create(testcase=testcasefortestplan,
                                                    number=str(teststep_data.number),
                                                    description=teststep_data.description,
                                                    condition=teststep_data.condition,
                                                    actual_outcome='',
                                                    comment = '',
                                                    remark=teststep_data.remark,
                                                    modify_history=teststep_data.modify_history,) 
                for item in have_testcase_list:
                    if item not in selected_testcase_list:
                        temp_delete_testcase = TestCaseforTestplan.objects.get(name=item,testplan=testplan)
                        temp_delete_testcase.delete()

                testplan.save()
            if detect_exist_name==True:
                testplan = TestPlan_test.objects.get(name = ';;;;~~;`!!=-dsfasf, lsapdfisda,pfaisdfo ')
        elif 'checkbox_ans' in request.POST:
            is_activate = request.POST['is_activate']
            print(is_activate,type(is_activate))
            if is_activate == 'true':
                is_activate = True
            elif is_activate == 'false':
                is_activate = False
            testplan.is_activate = is_activate
            testplan.save()
        elif 'delete_testplan' in request.POST:
            testplan.delete()
            return redirect('plans_search_test')  
        elif 'clone' in request.POST:
            current_user = request.user
            if '-clone' in str(testplan.name):
                temp_clone_list = str(testplan.name).split('-clone')
                try:
                    clone_num = int(temp_clone_list[-1])
                    clonename = temp_clone_list[0]+'-clone'+str(clone_num+1)
                except:
                    clonename = str(testplan.name)+'-clone1'
            else:
                clonename = str(testplan.name)+'-clone1'
            testplanclone = TestPlan_test.objects.create(name=clonename,assign=testplan.assign,stage=testplan.stage,start_date=testplan.start_date,end_date=testplan.end_date,text=testplan.text,creator = current_user)
            testplanclone = TestPlan_test.objects.get(name = clonename)
            have_testcase_list = []
            for temp_have_testcase in testcase_list:
                have_testcase_list.append(temp_have_testcase.name)
            for item in have_testcase_list:
                '''
                獲取要複製的資料
                '''
                orignal_testcase = TestCasetest.objects.get(name=item)
                orignal_teststep = Teststep.objects.filter(testcase = orignal_testcase)
                orignal_testcase_tag = orignal_testcase.tag.all()
                '''
                建立clone檔案
                '''
                testcasefortestplan = TestCaseforTestplan.objects.create(name=orignal_testcase.name,testplan=testplanclone)
                for item2 in orignal_testcase_tag:
                    testcasefortestplan.tag.add(TagNewTestcase.objects.get(name=item2.name))
                testcasefortestplan.save()
                for teststep_data in orignal_teststep:
                    TeststepforTestplan.objects.create(testcase=testcasefortestplan,
                                            number=str(teststep_data.number),
                                            description=teststep_data.description,
                                            condition=teststep_data.condition,
                                            actual_outcome='',
                                            comment = '',
                                            remark=teststep_data.remark,
                                            modify_history=teststep_data.modify_history,) 
            
            testplanclone.save()
            return HttpResponseRedirect(reverse("testplan_view", args=[testplanclone.pk]))

    context={'testplanform':TestplanForm,'stage_choices':stage_choices,'user_list':user_list,'data':data,
             'Tag_object':Tag_object,'tag_list_text':tag_list_text,'testcase_html':testcase_html,
             'selected_testcase_list':selected_testcase_list,
             'testplan':testplan,'count':testcase_count,'testcase_list':testcase_list,'testplan_html':testplan_html,'testcase_intestplan':testcase_intestplan,
             'allow_clone':allow_clone,'edit_clone_btn_cansee':edit_clone_btn_cansee,'progress_dict':progress_dict,'creator_bool':creator_bool}
    return render(request,'testplans/testplanview.html',context)


def TeststepforTestplanView(request,pk):
    group_allow = ['creator','Tester']
    group = None
    group_len = None
    edit_clone_btn_cansee = False
    if request.user.groups.exists():
        print(request.user.groups.all())
        group_len = len(request.user.groups.all())
    print('group=',group,'allow=',group_allow)
    if group_len != None:
        i=0
        while i<group_len:
            group = request.user.groups.all()[i].name
            if group in group_allow:
                edit_clone_btn_cansee = True
            i+=1
    teststepform = Teststepfortestplanform()
    testcase = TestCaseforTestplan.objects.get(id=pk)
    teststep = TeststepforTestplan.objects.filter(testcase = testcase)
    teststepset = inlineformset_factory(TestCaseforTestplan, TeststepforTestplan, fields=('number','description','condition','actual_outcome','status','comment','remark','modify_history'), extra=0)
    form_teststep_list = teststepset(instance=testcase)
    status_list = [0,0,0,0,0]
    for item in teststep:
        temp_status = item.status
        if temp_status == 'Failed':
            status_list[0]+=1
        elif temp_status == 'Incomplete':
            status_list[1]+=1
        elif temp_status == 'Passed':
            status_list[2]+=1
        elif temp_status == 'Blocked':
            status_list[3]+=1
        elif temp_status == 'Omitted':
            status_list[4]+=1
    teststep_count = teststep.count()
    tag_object_list = testcase.tag.all()
    tag_list= []
    for item in tag_object_list:
        tag_list.append(item.name)
    if request.method == 'POST':
        teststep_dict= {}
        i=0
        while i < teststep_count:
            temp_teststep = TeststepforTestplan.objects.get(testcase = testcase , number=i+1)
            teststep_dict[i]=temp_teststep
            i+=1
        for item in request.POST:
            if 'teststepfortestplan_set' in item:
                item_name = item.split('-')
                item_number = int(item_name[1])
                item_data = item_name[2]
                data = request.POST[item].replace('\r','').replace('\n','').replace('\t','').replace('<p>&nbsp;</p>','').replace('<br />','')
                if item_data=='actual_outcome':
                    teststep_dict[item_number].actual_outcome=data
                elif item_data == 'status':
                    teststep_dict[item_number-1].status = data
                elif item_data == 'comment':
                    teststep_dict[item_number].comment = data
                if item_data=='status':
                    teststep_dict[item_number-1].save()
                else:
                    teststep_dict[item_number].save()
        temp_teststep = TeststepforTestplan.objects.filter(testcase=testcase)
        count=0
        count_incomplete = 0
        for temp_item in temp_teststep:
            temp_status = temp_item.status
            print(temp_status)
            if temp_status != 'Incomplete':
                count_incomplete+=1
            count+=1
        if count_incomplete == count:
            testcase.complete = True
        else:
            testcase.complete = False
        testcase.save()
        # teststepfortestplan_set-41-comment
    context = {'pk':pk,'testcase':testcase,'teststep':teststep,'tag_list':tag_list,'count':teststep_count,'form_teststep_list':form_teststep_list,
               'teststepform':teststepform,'status':status,'status_list':status_list,'edit_clone_btn_cansee':edit_clone_btn_cansee}
    return render(request,'testplans/TeststepforTestplan.html',context)
    