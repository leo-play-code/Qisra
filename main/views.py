from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect,JsonResponse
from django.conf import settings
from django.contrib import messages
from django.contrib.sites.models import Site
from django.db import DEFAULT_DB_ALIAS, connections
from django.db.migrations.executor import MigrationExecutor
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from testplan.models import Testplan, Testplan_Group,Testrun,Testrun_Teststep,Testplans
from django.views.generic.base import TemplateView
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.db.models import Q
@login_required
def base_navbar(request):
    context ={}
    return render(request,'main/base.html',context)



def get_progress_data_testplan(item):
    '''
    item : Testplan Model
    if item is not Testplan Model will use Testplan_group Model
    '''
    temp_value_list = [0,0,0,0,0,0]
    try:
        testrun_teststep_list = Testrun.objects.filter(testplan = item)
    except:
        testplan_group = item
        testplan_list = Testplans.objects.filter(testplan_group=testplan_group)
        testrun_teststep_list = []
        for testplan_item in testplan_list:
            temp_testrun_list = Testrun.objects.filter(testplans = testplan_item)
            for testrun_item in temp_testrun_list:
                testrun_teststep_list.append(testrun_item)
    for teststep_item in testrun_teststep_list:
        if teststep_item.status == 'Ongoing':
            temp_value_list[0]+=1
        elif teststep_item.status == 'Passed':
            temp_value_list[1]+=1
        elif teststep_item.status == 'Failed':
            temp_value_list[2]+=1
        elif teststep_item.status == 'Incomplete':
            temp_value_list[3]+=1
        temp_value_list[4]+=1
    temp_value_list[5] = temp_value_list[2]+temp_value_list[1]
    temp_value_list[4] = temp_value_list[4]/100
    return temp_value_list

def get_progress_data_testrun(item):
    '''
    item : Testrun Model
    '''
    temp_value_list = [0,0,0,0,0,0,0,0]
    testrun_teststep_list = Testrun_Teststep.objects.filter(testcase = item)
    for teststep_item in testrun_teststep_list:
        if teststep_item.status == 'Incomplete':
            temp_value_list[0]+=1
        elif teststep_item.status == 'Passed':
            temp_value_list[1]+=1
        elif teststep_item.status == 'Failed':
            temp_value_list[2]+=1
        elif teststep_item.status == 'Blocked':
            temp_value_list[3]+=1
        elif teststep_item.status == 'Omitted':
            temp_value_list[4]+=1
        temp_value_list[5]+=1
    temp_value_list[6] = temp_value_list[5]-temp_value_list[0]
    temp_value_list[7] = temp_value_list[5]
    temp_value_list[5] = temp_value_list[5]/100
    return temp_value_list

class DashboardView(TemplateView):
    template_name = "main/dashboard.html"
    def get_context_data(self, **kwargs):
        current_user = self.request.user
        # testplan creator
        Testplan_creator_list = Testplan.objects.filter(creator=current_user).order_by('status')
        Testplan_creator_list = Testplan_creator_list.filter(Q(status='1')|Q(status='2')|Q(status='3')|Q(status='4')).order_by('status')
        Testplan_creator_dict = {}
        for testplan_item in Testplan_creator_list:
            Testplan_creator_dict[testplan_item] = get_progress_data_testplan(testplan_item)
        # testplan assign
        Testplan_assign_list = Testplan.objects.filter(assign=current_user).filter(Q(status='1')|Q(status='2')|Q(status='3')).order_by('status')
        Testplan_assign_dict = {}
        for testplan_item in Testplan_assign_list:
            Testplan_assign_dict[testplan_item] = get_progress_data_testplan(testplan_item)
        # testrun assign 
        testrun_assign_list = Testrun.objects.filter(assign__in=[current_user])
        testplan_support_list = []
        for testrun_item in testrun_assign_list:
            if testrun_item.testplan:
                if  testrun_item.testplan.assign != current_user:
                    if testrun_item.testplan not in testplan_support_list:
                        testplan_support_list.append(testrun_item.testplan)
            else:
                if testrun_item.testplans.testplan_group.assign != current_user:
                    if testrun_item.testplans.testplan_group not in testplan_support_list:
                        testplan_support_list.append(testrun_item.testplans.testplan_group)
        
        

        testplan_support_dict = {}
        for testplan_item in testplan_support_list:
            testplan_support_dict[testplan_item] = get_progress_data_testplan(testplan_item)
        # testplan group creator
        Testplan_group_creator_list = Testplan_Group.objects.filter(creator=current_user).order_by('status')
        Testplan_group_creator_list = Testplan_group_creator_list.filter(Q(status='1')|Q(status='2')|Q(status='3')|Q(status='4')).order_by('status')
        Testplan_group_creator_dict = {}
        for testplan_item in Testplan_group_creator_list:
            Testplan_group_creator_dict[testplan_item] = get_progress_data_testplan(testplan_item)
        # testplan group assign
        Testplan_group_assign_list = Testplan_Group.objects.filter(assign=current_user).filter(Q(status='1')|Q(status='2')|Q(status='3')).order_by('status')
        Testplan_group_assign_dict = {}
        for testplan_item in Testplan_group_assign_list:
            Testplan_group_assign_dict[testplan_item] = get_progress_data_testplan(testplan_item)
        
        # count testplan creator
        testplan_creator_close_count = Testplan.objects.filter(creator=current_user,status='4').count()
        testplan_creator_not_close_count = Testplan_creator_list.count()-testplan_creator_close_count
        testplan_group_creator_close_count =  Testplan_Group.objects.filter(creator=current_user,status='4').count()
        testplan_group_creator_not_close_count = Testplan_group_creator_list.count() - testplan_group_creator_close_count
        testplan_open_count = testplan_creator_not_close_count+testplan_group_creator_not_close_count
        testplan_close_count = testplan_creator_close_count+testplan_group_creator_close_count
        # count testplan assign
        Testplan_assign_count = Testplan_assign_list.count()+Testplan_group_assign_list.count()
        # count testrun assign
        testrun_assign_count = len(testrun_assign_list)
        return {
            'Testplan_creator_list':Testplan_creator_list,
            'Testplan_creator_dict':Testplan_creator_dict,
            'Testplan_assign_list':Testplan_assign_list,
            'Testplan_assign_dict':Testplan_assign_dict,
            'testplan_support_list':testplan_support_list,
            'testplan_support_dict':testplan_support_dict,
            'Testplan_group_creator_list':Testplan_group_creator_list,
            'Testplan_group_creator_dict':Testplan_group_creator_dict,
            'Testplan_group_assign_list':Testplan_group_assign_list,
            'Testplan_group_assign_dict':Testplan_group_assign_dict,
            'testplan_open_count':testplan_open_count,
            'testplan_close_count':testplan_close_count,
            'Testplan_assign_count':Testplan_assign_count,
            'testrun_assign_count':testrun_assign_count
        }
        

#  profile views 
@login_required
def profile_view(request):
    current_user = request.user
    if 'update_profile' in request.POST:
        current_user.password = make_password(request.POST['password'])
        current_user.save()   
        login(request, current_user)
    context = {}
    return render(request,'main/profile/profile.html',context)

    
def test_div(request):
    context = {}
    return render(request,'main/demo.html',context)