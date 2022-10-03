from django.conf import settings # import the settings file
from project.models import Project,Client
from django.contrib.auth.models import User
from testcase.models import Tag,Testcase
from main.forms import modal_descriptionForm
import json
from testplan.models import Testplan,Testrun,Testplan_Group
def settings_template(request):
    # Testplan.objects.all().delete()
    # Testrun.objects.all().delete()
    if request.user.is_superuser == True:
        bool_superuser = True
    else:
        bool_superuser = False
    '''
    'MENU_ITEMS': settings.MENU_ITEMS,
    set the value for every template to call without send from every views
    '''
    project_object = Project.objects.all()
    current_user = request.user

    group_allow = ['creator']
    group = None
    group_len = None
    creator_bool = False
    if request.user.groups.exists():
        group_len = len(request.user.groups.all())
    if group_len != None:
        i=0
        while i<group_len:
            group = request.user.groups.all()[i].name
            if group in group_allow:
                creator_bool = True
            i+=1
    '''
    cleint list
    '''
    client_list = []
    clients = Client.objects.all()
    for client in clients:
        client_list.append(client.name)
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
    tag_object = Tag.objects.all()
    '''
    Testcase Object
    '''
    testcase_object = Testcase.objects.all()
    '''
    testcase list
    '''
    testcase_html = []
    testcase = Testcase.objects.all()
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
    project = Project.objects.all()
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
        project_html.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list, 'datecreated': project_create_date, 'creator': instance.creator.username,
                             'assign':project_assign,'start_date':project_start_date,'end_date':project_end_date})
    project_html = json.dumps(project_html)
    '''
    Testplan list
    '''
    testplan_html = []
    testplan = Testplan.objects.all()
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
        status = instance.status
        tag_list_object = instance.tag.all()
        tag_list = []
        for tag_object_temp in tag_list_object:
            tag_list.append(tag_object_temp.name)
        try:
            testplan_assign = instance.assign.username
        except:
            testplan_assign = ''
        testplan_html.append({'pk': instance.pk, 'name': instance.name, 'tag': tag_list, 'datecreated': testplan_create_date, 'creator': instance.creator.username,
                             'assign':testplan_assign,'start_date':testplan_start_date,'end_date':testplan_end_date,'status':status,'project':temp_project})
    testplan_html = json.dumps(testplan_html)
    '''
    Testplan_Group object
    '''
    testplan_group_object = Testplan_Group.objects.all().order_by('-status')
    '''
    project object
    '''
    testplan_object = Testplan.objects.all().order_by('-status')
    '''
    testrun object
    '''
    testrun_object = Testrun.objects.all()
    return {'MENU_ITEMS':['Project','Testplan','Testplan-group'],'search_type':['Project','Testplan','Testcase'],
            'Stage_list':['無','EVT0','EVT1','EVT2','DVT','PVT','F/W modify','H/W modify'],
            'project_object':project_object,'current_user':current_user,'user_list':user_list,
            'tag_object':tag_object,'client_list':client_list
            ,'modal_descriptionForm':modal_descriptionForm(),
            'testcase_object':testcase_object,'testcase_html':testcase_html,
            'project_html':project_html,'testplan_html':testplan_html,
            'testplan_object':testplan_object,'testrun_object':testrun_object,'project_object':project
            , 'creator_bool': creator_bool, 'bool_superuser': bool_superuser,'testplan_group_object':testplan_group_object}

