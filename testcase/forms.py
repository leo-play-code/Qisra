# -*- coding: utf-8 -*-
from django import forms
from testcase.models import (
    Testcase,
    Teststep,
    testcase_import_excel,
    testcase_file
)
from ckeditor.widgets import CKEditorWidget

'''
new Testcase search
'''
class SearchCaseFormTest(forms.ModelForm):
    class Meta:
        model = Testcase
        fields = ['name']
        
class TestCasetestform(forms.ModelForm):
    class Meta:
        model = Testcase    
        fields = ['name','tag','description']   
        
class Teststepform(forms.ModelForm):
    class Meta:
        model = Teststep
        fields = ['description','condition','remark']

class save_excelform(forms.ModelForm):
    class Meta:
        model = testcase_import_excel
        fields = ['filename','file']

class testcase_fileForm(forms.ModelForm):
    class Meta:
        model = testcase_file
        fields = '__all__'






