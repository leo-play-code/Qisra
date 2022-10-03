from testcase.models import Teststep,Testcase,Tag,testcase_file,teststep_file
from testplan.models import (
    Testplan, Testrun_Teststep, Testrun,
    Testrun_file,Testrun_Teststep_file,
    Testrun_tester_upload_file,Teststep_tester_upload_file)
from django.contrib.auth.models import User
from datetime import datetime as dt2
def Clone_Models(creator,method,model):
    '''
    creator (Model) : request.user (User.Model)
    method (str) : Testplan or Testcase or Project
    model (Model) :  Clone Model
    '''
    loc_dt = dt2.today() 
    loc_dt_format = loc_dt.strftime("%Y-%m-%d %H:%M:%S")
    def Project_clone(model):
        '''
        Project to Project
        '''
        testplan_list = Testplan.objects.filter(project=model).order_by('status')
        temp_clone_list = str(model.name).split('-clone')
        clonename = temp_clone_list[0]+'-clone-'+str(loc_dt_format)
        model.pk = None
        model.name = clonename
        model.save()
        for testplan_item in testplan_list:
            orignal_testplan_item = testplan_item
            Testplan_clone(orignal_testplan_item,model)
        return model
    def Testplan_clone(testplan_model,project_modal):
        '''
        Testplan to Testplan
        '''
        # get tag from testplan
        tag_list = []
        for tag in testplan_model.tag.all():
            tag_list.append(tag.name)
        # get testrun from testplan
        testrun = Testrun.objects.filter(testplan=testplan_model).order_by('id')
        temp_clone_list = str(testplan_model.name).split('-clone')
        clonename = temp_clone_list[0]+'-clone-'+str(loc_dt_format)
        clone_issue_name = testplan_model.issue_name+'-clone-'+str(loc_dt_format)
        testplanclone = Testplan.objects.create(name=clonename,project=project_modal,creator=User.objects.get(username=creator.username),
                                stage = testplan_model.stage , start_date = testplan_model.start_date,end_date=testplan_model.end_date,
                                assign=testplan_model.assign,text=testplan_model.text,issue_name=clone_issue_name,number_issue=0)
        testplanclone = Testplan.objects.get(name = clonename)
        for instance in tag_list:
            testplanclone.tag.add(Tag.objects.get(name=instance))
        testplanclone.save()
        '''
        create teststep for tester
        '''
        count_number = testplanclone.number_issue
        for testrun_item in testrun:
            '''
            獲取要複製的資料
            '''
            Testrun_clone(testrun_item,testplanclone,count_number)
            count_number+=1
        testplanclone.number_issue = count_number
        testplanclone.save()
        return testplanclone
    def Testrun_clone(testrun_model,testplan_model,count_number):
        '''
        Testrun to Testrun
        '''
        orignal_teststep = Testrun_Teststep.objects.filter(
                testcase=testrun_model).order_by('id')
        orignal_testcase_tag = testrun_model.tag.all()
        orignal_testcase_assign = testrun_model.assign.all()
        '''
        建立clone檔案
        '''
        testcasefortestplan = Testrun.objects.create(name=testrun_model.name,testplan=testplan_model,description=testrun_model.description,creator=creator,number=str(count_number+1),testcase=testrun_model.testcase)
        for item2 in orignal_testcase_tag:
            testcasefortestplan.tag.add(Tag.objects.get(name=item2.name))
        for item3 in orignal_testcase_assign:
            testcasefortestplan.assign.add(item3)
        testcasefortestplan.save()
        # clone file from testcase 
        testcase_file_list = Testrun_file.objects.filter(testrun = testrun_model)
        for item in testcase_file_list:
            Testrun_file.objects.create(testrun = testcasefortestplan,file=item.file,filename=item.filename,uploader=creator)
        for teststep_data in orignal_teststep:
            new_teststep = Testrun_Teststep.objects.create(testcase=testcasefortestplan,
                                    number=int(teststep_data.number),
                                    description=teststep_data.description,
                                    condition=teststep_data.condition,
                                    actual_outcome='',
                                    remark = teststep_data.remark,) 
            temp_teststep_file_list = Testrun_Teststep_file.objects.filter(teststep = teststep_data)
            for file_item in temp_teststep_file_list:
                Testrun_Teststep_file.objects.create(teststep = new_teststep,file=file_item.file,filename=file_item.filename,uploader=creator)
    def Testcase_clone(model):
        '''
        Testcase to Testcase
        '''
        temp_clone_list = str(model.name).split('-clone')
        clonename = temp_clone_list[0]+'-clone-'+str(loc_dt_format)
        testcaseclone = Testcase.objects.create(name=clonename)
        testcaseclone = Testcase.objects.get(name=clonename)
        teststep = Teststep.objects.filter(testcase=model).order_by('number')
        tag_object_list = model.tag.all()
        for instance in tag_object_list:
            testcaseclone.tag.add(
                Tag.objects.get(name=instance.name))
        testcaseclone.description = model.description
        testcaseclone.creator = creator
        testcaseclone.save()
        for data in teststep:
            Teststep.objects.create(testcase=testcaseclone,
                                    number=int(data.number),
                                    description=data.description,
                                    condition=data.condition,
                                    remark=data.remark)
        # clone file from testcase 
        testcase_file_list = testcase_file.objects.filter(testcase = model)
        for item in testcase_file_list:
            newdoc = testcase_file(
                filename=item.filename, file=item.file,testcase = testcaseclone,uploader=creator)
            newdoc.save()
        # teststep file
        for item in teststep:
            teststep_file_list = teststep_file.objects.filter(teststep=item)
            for file_item in teststep_file_list:
                temp_teststep = Teststep.objects.get(testcase=testcaseclone,number = item.number)
                newdoc = teststep_file(
                    filename=file_item.filename, file=file_item.file,teststep = temp_teststep,uploader=creator)
                newdoc.save()
        return testcaseclone
    if method == 'project':
        return Project_clone(model)
    elif method == 'testplan':
        return Testplan_clone(model,model.project)
    elif method == 'testcase':
        return Testcase_clone(model)