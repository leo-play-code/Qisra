from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.sites.models import Site
from django.db import DEFAULT_DB_ALIAS, connections
from django.db.migrations.executor import MigrationExecutor
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from testplan.models import TestPlan_test,TestCaseforTestplan
from django.views.generic.base import TemplateView
from django.conf import settings

def base_navbar(request):
    context ={}
    return render(request,'main/base.html',context)


# @method_decorator(
#     login_required, name="dispatch"
# )  # pylint: disable=missing-permission-required
class DashboardView(TemplateView):
    template_name = "main/dashboard.html"
    def get_context_data(self, **kwargs):
        # Check if domain is configured
        current_user = self.request.user
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

        testplan_object_tester = TestPlan_test.objects.filter(assign=current_user,is_activate=True)

        testplan_object_creator = TestPlan_test.objects.filter(creator=current_user)
        
        testplan_all_count = TestPlan_test.objects.all().count()
        test_plans_count = testplan_object_creator.count()
        test_plans_tester_count = testplan_object_tester.count()
        tester_status_dict ={}
        for temp_testplan in testplan_object_tester:
            tester_status_list = [0,0,0]
            temp_testcase_list = TestCaseforTestplan.objects.filter(testplan = temp_testplan)
            for temp_testcase in temp_testcase_list:
                if temp_testcase.complete == True:
                    tester_status_list[0]+=1
                else:
                    tester_status_list[1]+=1
                tester_status_list[2]+=1
            tester_status_list[2]/=100
            tester_status_dict[temp_testplan] = tester_status_list
        
        creator_status_dict ={}
        for temp_testplan in testplan_object_creator:
            tester_status_list = [0,0,0]
            temp_testcase_list = TestCaseforTestplan.objects.filter(testplan = temp_testplan)
            for temp_testcase in temp_testcase_list:
                if temp_testcase.complete == True:
                    tester_status_list[0]+=1
                else:
                    tester_status_list[1]+=1
                tester_status_list[2]+=1
            tester_status_list[2]/=100
            creator_status_dict[temp_testplan] = tester_status_list
        return {
            "tester_status_dict":tester_status_dict,
            "creator_status_dict":creator_status_dict,
            "test_plans_count":test_plans_count,
            "test_plans_tester_count":test_plans_tester_count,
            "testplan_all_count":testplan_all_count,
            "creator_bool":creator_bool,        
            # 'saved_setting':val    
        }
    

