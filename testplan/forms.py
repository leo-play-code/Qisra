# -*- coding: utf-8 -*-
from django import forms
from testplan.models import TestPlan_test,TeststepforTestplan



class Testplan_test_form(forms.ModelForm):
    class Meta:
        model = TestPlan_test
        fields = ['name','assign','text','stage','start_date','end_date','is_activate']
class Teststepfortestplanform(forms.ModelForm):
    class Meta:
        model = TeststepforTestplan
        fields = ['description','condition','actual_outcome','status','comment','remark','modify_history']

        
    