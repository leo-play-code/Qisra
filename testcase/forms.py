# -*- coding: utf-8 -*-
from django import forms
from testcase.models import (
    TestCasetest,
    Teststep,
    save_excel
)
from ckeditor.widgets import CKEditorWidget

'''
new Testcase search
'''
class SearchCaseFormTest(forms.ModelForm):
    class Meta:
        model = TestCasetest
        fields = ['name']
        
class TestCasetestform(forms.ModelForm):
    class Meta:
        model = TestCasetest    
        fields = ['name','tag','description']   
        
class Teststepform(forms.ModelForm):
    class Meta:
        model = Teststep
        fields = ['description','condition','remark','modify_history']

class save_excelform(forms.ModelForm):
    class Meta:
        model = save_excel
        fields = ['filename','file']






# class TeststepForm(forms.Form): 
#     description =forms.CharField()
#     condition = forms.CharField(widget = CKEditorWidget())
#     remark =  forms.CharField(widget = CKEditorWidget())
#     modify_history =  forms.CharField()