// issue mode
var search_all_type = document.getElementById('search_all_type')
try{
    var search_all_type_value =  search_all_type.options[0].value
    var search_all_type_innertext =  search_all_type.options[0].text
}catch (e){}
search_all_type.addEventListener('change', function(e) {
    search_all_type_value = search_all_type.options[search_all_type.selectedIndex].value
    search_all_type_innertext = search_all_type.options[search_all_type.selectedIndex].text
    _reset_search_table(search_all_type_value)
    reset_all_select()
    _Search_Main()
})


var Search_allkind_btn  = document.getElementById('Search_allkind')
var search_all_project_table = document.querySelectorAll('.search_all_project_table')
var search_all_testplan_table = document.querySelectorAll('.search_all_testplan_table')
var search_all_testcase_table = document.querySelectorAll('.search_all_testcase_table')
Search_allkind_btn.addEventListener('click',function(e){
    e.preventDefault()
    _Search_Main()
    
})
_Search_Main()



// all target setup
var search_target_name = document.querySelectorAll('.search_target_name')
var search_target_creator = document.querySelectorAll('.search_target_creator')
var search_target_start_date = document.querySelectorAll('.search_target_start_date')
var search_target_project = document.querySelectorAll('.search_target_project')
var search_target_tag = document.querySelectorAll('.search_target_tag')
var search_target_stage = document.querySelectorAll('.search_target_stage')
var search_target_assign = document.querySelectorAll('.search_target_assign')
var search_target_end_date = document.querySelectorAll('.search_target_end_date')
var search_target_status = document.querySelectorAll('.search_target_status')
var search_target_issue_name = document.querySelectorAll('.search_target_issue_name')



_reset_search_table(search_all_type_value)
function _reset_search_table(value){
    if (value == 'Project'){
        _show_ornot(search_target_name,true)
        _show_ornot(search_target_creator,true)
        _show_ornot(search_target_start_date,false)
        _show_ornot(search_target_end_date,false)
        _show_ornot(search_target_tag,false)
        _show_ornot(search_target_assign,false)
        _show_ornot(search_target_project,false)
        _show_ornot(search_target_status,false)
        _show_ornot(search_target_stage,false)
        _show_ornot(search_target_issue_name,false)
    }else if(value == 'Testplan'){
        _show_ornot(search_target_name,true)
        _show_ornot(search_target_creator,true)
        _show_ornot(search_target_start_date,true)
        _show_ornot(search_target_end_date,true)
        _show_ornot(search_target_tag,true)
        _show_ornot(search_target_assign,true)
        _show_ornot(search_target_project,true)
        _show_ornot(search_target_status,true)
        _show_ornot(search_target_stage,true)
        _show_ornot(search_target_issue_name,true)
    }else if(value == 'Testcase'){
        _show_ornot(search_target_name,true)
        _show_ornot(search_target_creator,false)
        _show_ornot(search_target_start_date,false)
        _show_ornot(search_target_end_date,false)
        _show_ornot(search_target_tag,true)
        _show_ornot(search_target_assign,false)
        _show_ornot(search_target_project,false)
        _show_ornot(search_target_status,false)
        _show_ornot(search_target_stage,false)
        _show_ornot(search_target_issue_name,false)
    }

}


function _show_ornot(target,bool_status){
    if (bool_status == false){
        target.forEach(element =>{
            element.classList.add('hidden')
        })
    }else{
        target.forEach(element =>{
            element.classList.remove('hidden')
        })
    }
    
}


function _Search_Main(){
    var search_all_tag = $('#search_all_tag').val()
    var search_all_name = $('#search_all_name').val()
    var search_all_creator = $('#search_all_creator').val()
    var search_all_assign = $('#search_all_assign').val()
    var search_all_start_date = $('#search_all_start_date').val()
    var search_all_end_date = $('#search_all_end_date').val()
    var search_dict = {}
    try{
        var search_all_status = document.querySelector('input[name="search_status_target"]:checked').id
        search_dict['status'] = search_all_status.replace('-outlined-search','')
        if (search_dict['status']=='Ongoing'){
            search_dict['status'] = '進行中'
        }else if(search_dict['status']=='Closed'){
            search_dict['status'] = '關閉'
        }else if(search_dict['status']=='Not_start'){
            search_dict['status'] = '未開始'
        }
    }catch{
        var search_all_status = null
        search_dict['status'] = search_all_status
    }
    
    var search_all_stage = $('#search_all_stage').val()
    var search_all_testplan_project = $('#search_all_testplan_project').val()
    
    search_dict['name'] = search_all_name
    search_dict['tag'] = search_all_tag
    search_dict['creator'] = search_all_creator
    search_dict['assign'] = search_all_assign
    search_dict['start_date'] = search_all_start_date
    search_dict['end_date'] = search_all_end_date
    search_dict['creator'] = search_all_creator
    search_dict['issue_name'] =  $('#search_all_issue_name').val()
    search_dict['project'] = search_all_testplan_project
    search_dict['stage'] = search_all_stage
    if (search_all_type_value == 'Project'){
        search_all_project_table.forEach(element => {
            element.classList.remove('hidden')
        });
        _Search_all_Project(search_dict)
    }else{
        search_all_project_table.forEach(element => {
            element.classList.add('hidden')
        });
    }
    if(search_all_type_value == 'Testplan'){
        search_all_testplan_table.forEach(element => {
            element.classList.remove('hidden')
        });
        _Search_all_Testplan(search_dict)
    }else{
        search_all_testplan_table.forEach(element => {
            element.classList.add('hidden')
        });
    }
    if(search_all_type_value == 'Testcase'){
        search_all_testcase_table.forEach(element => {
            element.classList.remove('hidden')
        });
        _Search_all_Testcase(search_dict)
    }else{
        search_all_testcase_table.forEach(element => {
            element.classList.add('hidden')
        });
    }
}



var search_all_testcase_list = document.getElementById('search_all_testcase')
var search_all_testplan_list = document.getElementById('search_all_testplan')
var search_all_project_list = document.getElementById('search_all_project')
function _Search_all_Project(search_dict){
    target_name = search_dict['name'].toLowerCase()
    target_tag_list = search_dict['tag']
    target_assign = search_dict['assign']
    target_creator=search_dict['creator']
    target_start_date=search_dict['start_date'] 
    target_end_date=search_dict['end_date'] 
    var search_all_project_tr = document.querySelectorAll('.search_all_project_tr')
    search_all_project_tr.forEach(element => {
        var get_bool = true
        var project_name = element.querySelector('#search_all_check_project_name').value.toLowerCase()
        var tag_list_div =element.querySelector('#search_all_project_tag').querySelectorAll('#each_project_tag')
        var assign = element.querySelector('#search_all_project_assign').innerText
        var creator = element.querySelector('#search_all_project_creator').innerText
        var start_date = element.querySelector('#search_all_project_start_date').innerText
        var end_date = element.querySelector('#search_all_project_end_date').innerText

        var temp_tag_list = []
        tag_list_div.forEach(element =>{
            temp_tag_list.push(element.innerHTML)
        })
        tag_list = temp_tag_list
        if (target_name != ''){
            if (!project_name.includes(`${target_name}`)){
                get_bool = false
            }
        }
        if (get_bool == true){
            for(num in target_tag_list){
                if (!tag_list.includes(target_tag_list[num])){
                    get_bool = false
                }
            }
        }
        if (target_assign != 'None'){
            if (!(target_assign==assign)){
                get_bool = false
            }
        }
        if (target_creator != 'None'){
            if (!(target_creator==creator)){
                get_bool = false
            }
        }
        if (target_start_date != ''){
            if (start_date == ''){
                get_bool = false
            }else{
                if (!(target_start_date<=start_date)){
                    get_bool = false
                }
            }
        }
        if (target_end_date != ''){
            if (end_date == ''){
                get_bool = false
            }else {
                if (!(target_end_date>=end_date)){
                get_bool = false
                }
            }
        }
        if (get_bool == true){
            element.classList.remove('hidden')
        }else{
            element.classList.add('hidden')
        }
    })
}
function _Search_all_Testplan(search_dict){
    target_name = search_dict['name'].toLowerCase()
    target_issue_name = search_dict['issue_name'].toLowerCase()
    target_tag_list = search_dict['tag']
    target_assign = search_dict['assign']
    target_creator=search_dict['creator']
    target_start_date=search_dict['start_date'] 
    target_end_date=search_dict['end_date'] 
    target_status = search_dict['status']
    target_project = search_dict['project']
    target_stage = search_dict['stage']
    var search_all_testplan_tr = document.querySelectorAll('.search_all_testplan_tr')
    search_all_testplan_tr.forEach(element => {
        var get_bool = true
        var project = element.querySelector('#search_all_testplan_project').innerHTML
        var testplan_name = element.querySelector('#search_all_testplan_name').innerText.toLowerCase()
        var testplan_issue_name =   element.querySelector('#search_all_issue_name').innerText.toLowerCase()
        var tag_list_div =element.querySelector('#search_all_testplan_tag').querySelectorAll('#each_testplan_tag')
        var assign = element.querySelector('#search_all_testplan_assign').innerText
        var creator = element.querySelector('#search_all_testplan_creator').innerText
        var start_date = element.querySelector('#search_all_testplan_start_date').innerText
        var end_date = element.querySelector('#search_all_testplan_end_date').innerText
        var stage = element.querySelector('#search_all_testplan_stage').innerText
        var status = element.querySelector('#search_all_testplan_status > .btn').innerText
        var temp_tag_list = []
        tag_list_div.forEach(element =>{
            temp_tag_list.push(element.innerHTML)
        })
        tag_list = temp_tag_list
        if (target_name != ''){
            if (!testplan_name.includes(`${target_name}`)){
                get_bool = false
            }
        }
        if (target_issue_name != ''){
            if (!testplan_issue_name.includes(`${target_issue_name}`)){
                get_bool = false
            } 
        }
        if (get_bool == true){
            for(num in target_tag_list){
                if (!tag_list.includes(target_tag_list[num])){
                    get_bool = false
                }
            }
        }
        if (target_assign != 'None'){
            if (!(target_assign==assign)){
                get_bool = false
            }
        }
        if (target_creator != 'None'){
            if (!(target_creator==creator)){
                get_bool = false
            }
        }
        if (target_start_date != ''){
            if (start_date == ''){
                get_bool = false
            }else{
                if (!(target_start_date<=start_date)){
                    get_bool = false
                }
            }
        }
        if (target_end_date != ''){
            if (end_date == ''){
                get_bool = false
            }else {
                if (!(target_end_date>=end_date)){
                    get_bool = false
                }
            }
        }
        if (target_project != 'None'){
            if (!(target_project == project) ){
                get_bool = false
            }
        }
        if (target_status != null){
            if (!(target_status == status)){
                get_bool = false
            }
        }
        if (target_stage != null){
            if (get_bool == true){
                if(!(target_stage.includes(stage))){
                    get_bool = false
                }
            }
        }
        if (get_bool == true){
            element.classList.remove('hidden')
        }else{
            element.classList.add('hidden')
        }
    })
    
}

function _Search_all_Testcase(search_dict){
    target_name = search_dict['name'].toLowerCase()
    target_tag_list = search_dict['tag']
    var search_all_testcase_tr = document.querySelectorAll('.search_all_testcase_tr')
    search_all_testcase_tr.forEach(element => {
        var get_bool = true
        var testcase_name = element.querySelector('#search_all_check_testcase_name').innerText.toLowerCase()
        var tag_list_div =element.querySelector('#search_all_testcase_tag').querySelectorAll('#each_testcase_tag')
        var temp_tag_list = []
        tag_list_div.forEach(element =>{
            temp_tag_list.push(element.innerHTML)
        })
        tag_list = temp_tag_list
        if (target_name != ''){
            if (!testcase_name.includes(`${target_name}`)){
                get_bool = false
            }
        }
        if (get_bool == true){
            for(num in target_tag_list){
                if (!tag_list.includes(target_tag_list[num])){
                    get_bool = false
                }
            }
        }
        if (get_bool == true){
            element.classList.remove('hidden')
        }else{
            element.classList.add('hidden')
        }
    })
}

// reset btn 
var search_all_reset = document.getElementById('search_all_reset')
search_all_reset.addEventListener('click',function(e){
    e.preventDefault()
    reset_all_select()
    
})

function reset_all_select(){
    $('.selectpicker').selectpicker('deselectAll');
    document.getElementById('search_all_name').value = ''
    document.getElementById('search_all_creator').value = 'None'
    document.getElementById('search_all_assign').value = 'None'
    document.getElementById('search_all_start_date').value = ''
    document.getElementById('search_all_end_date').value = ''
    document.getElementById('search_all_testplan_project').value = 'None'
    try{
        document.querySelector('input[name="search_status_target"]:checked').checked = false
    }catch{}
    
    $('.selectpicker').selectpicker('refresh')

}