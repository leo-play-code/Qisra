from django.conf import settings # import the settings file
from project.models import CreateProject
from django.contrib.auth.models import User
from testcase.models import TagNewTestcase,TestCasetest
from main.forms import modal_descriptionForm
import json
from testplan.models import TestPlan_test,TestCaseforTestplan
def settings_template(request):
    '''
    'MENU_ITEMS': settings.MENU_ITEMS,
    set the value for every template to call without send from every views
    '''
    project_object = CreateProject.objects.all()
    current_user = request.user.username
    '''
    user list
    '''
    users = User.objects.all()
    user_list = []
    for user in users:
        if user.username != 'AnonymousUser':
            user_list.append(user.username)
    '''
    Tag object
    ''' 
    tag_object = TagNewTestcase.objects.all()
    '''
    Testcase Object
    '''
    testcase_object = TestCasetest.objects.all()
    '''
    testcase list
    '''
    testcase_html = []
    testcase = TestCasetest.objects.all()
    for instance in testcase:
        testcase_datetime = (instance.date_created).strftime("%Y-%m-%d, %H:%M:%S")
        tag_list_object = instance.tag.all()
        tag_list = []
        for tag_object_temp in tag_list_object:
            tag_list.append(tag_object_temp.name)
        testcase_html.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list,'datecreated':testcase_datetime})
    testcase_html = json.dumps(testcase_html)
    '''
    project list
    '''
    project_html = []
    project = CreateProject.objects.all()
    for instance in project:
        project_create_date = (instance.create_date).strftime("%Y-%m-%d, %H:%M:%S")
        try:
            project_start_date =(instance.start_date).strftime("%Y-%m-%d, %H:%M:%S")
        except:
            project_start_date = ''
        try:
            project_end_date =(instance.end_date).strftime("%Y-%m-%d, %H:%M:%S")
        except:
            project_end_date = '' 
        tag_list_object = instance.tag.all()
        tag_list = []
        for tag_object_temp in tag_list_object:
            tag_list.append(tag_object_temp.name)
        try:
            project_assign  = instance.assign.username
        except:
            project_assign = ''
        project_html.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list,'datecreated':project_create_date,'creator':instance.creator.username,
                             'assign':project_assign,'start_date':project_start_date,'end_date':project_end_date})
    project_html = json.dumps(project_html)
    '''
    Testplan list
    '''
    testplan_html = []
    testplan = TestPlan_test.objects.all()
    for instance in testplan:
        temp_project = instance.project.name
        testplan_create_date = (instance.create_date).strftime("%Y-%m-%d, %H:%M:%S")
        try:
            testplan_start_date =(instance.start_date).strftime("%Y-%m-%d, %H:%M:%S")
        except:
            testplan_start_date = ''
        try:
            testplan_end_date =(instance.end_date).strftime("%Y-%m-%d, %H:%M:%S")
        except:
            testplan_end_date = '' 
        is_activate = instance.is_activate
        tag_list_object = instance.tag.all()
        tag_list = []
        for tag_object_temp in tag_list_object:
            tag_list.append(tag_object_temp.name)
        try:
            testplan_assign  = instance.assign.username
        except:
            testplan_assign = ''
        testplan_html.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list,'datecreated':testplan_create_date,'creator':instance.creator.username,
                             'assign':testplan_assign,'start_date':testplan_start_date,'end_date':testplan_end_date,'is_activate':is_activate,'project':temp_project})
    testplan_html = json.dumps(testplan_html)
    '''
    project object
    '''
    testplan_object = TestPlan_test.objects.all()
    '''
    testrun object
    '''
    testrun_object = TestCaseforTestplan.objects.all()
    return {'MENU_ITEMS':['Project','Testplan'],'search_type':['Project','Testplan','Testcase'],
            'Stage_list':['無','EVT0','EVT1','EVT2','DVT','PVT','F/W modify','H/W modify'],
            'project_object':project_object,'current_user':current_user,'user_list':user_list,
            'current_user':current_user,'tag_object':tag_object
            ,'modal_descriptionForm':modal_descriptionForm(),
            'testcase_object':testcase_object,'testcase_html':testcase_html,
            'project_html':project_html,'testplan_html':testplan_html,
            'testplan_object':testplan_object,'testrun_object':testrun_object}

