// issue mode
var get_issue_mode = document.getElementById('issue_type')
try{
    var issue_choose_value =  get_issue_mode.options[0].value
    var issue_choose_innertext =  get_issue_mode.options[0].text
}catch (e){}
const testplan_class = document.querySelectorAll('.testplan-css')
if (issue_choose_innertext == 'Testcase'){
    testplan_class.forEach(element => element.classList.add('hidden'));
}else{
    testplan_class.forEach(element => element.classList.remove('hidden'));
}
get_issue_mode.addEventListener('change', function handleChange(event) {
    issue_choose_value = get_issue_mode.options[get_issue_mode.selectedIndex].value
    issue_choose_innertext = get_issue_mode.options[get_issue_mode.selectedIndex].text
    invalid_summary.classList.add('hidden')
    invalid_starttime.classList.add('hidden')
    invalid_stoptime.classList.add('hidden')
    if (issue_choose_innertext == 'Project'){
        testplan_class.forEach(element => element.classList.add('hidden'));
    }else{
        testplan_class.forEach(element => element.classList.remove('hidden'));
    }
})
// csrf token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const save_btn = document.getElementById('save')
save_btn.addEventListener('click',function(e){
    e.preventDefault()
    send_save()
})
var invalid_summary = document.getElementById('invalid-summary')
var invalid_stoptime = document.getElementById('invalid-stoptime')
var invalid_starttime = document.getElementById('invalid-starttime')
function send_save(){
    var bool_ajax = true
    var csrftoken = getCookie('csrftoken')
    var data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    if(issue_choose_innertext=='Project'){
        data_dict['name'] = document.getElementById('issue_summary').value
        data_dict['creator'] = document.getElementById('issue_uploader').value
        data_dict['tag_list[]'] = $('#issue_tag').val()
        data_dict['assign'] = document.getElementById('issue_principal').value
        var description_data = CKEDITOR.instances['id_description'].getData()
        data_dict['description'] = description_data
        data_dict['start_time'] = document.getElementById('issue_starttime').value
        data_dict['stop_time'] = document.getElementById('issue_stoptime').value
        // detect if there are some not filled
        if (data_dict['name'] == ''){
            invalid_summary.classList.remove('hidden')
            bool_ajax = false
        }else{
            invalid_summary.classList.add('hidden')     
        }
        if (bool_ajax == true){
            $.ajax({
                type: 'POST',
                url: '/project/CreateProject/',
                data: data_dict,
                success:function() {
                    console.log("success");
                    window.location = '';
                },
                error: function(data) {
                    console.log("error")
                    alert("Project name has already existed ")
                }
            })
        }
    }else if (issue_choose_innertext == 'Testplan'){
        var checkboxes = document.querySelectorAll('input[name="checktestcase"]:checked');
        var testcase_has_checked = [];
        checkboxes.forEach((checkbox) => {
            testcase_has_checked.push(checkbox.value);
        });
        var description_data = CKEDITOR.instances['id_description'].getData()
        var stage = document.querySelector('input[name="StageMethod"]:checked');
        stage = stage.id
        data_dict['name'] = document.getElementById('issue_summary').value
        data_dict['project'] = document.getElementById('issue_project').value
        data_dict['creator'] = document.getElementById('issue_uploader').value
        data_dict['testcase_has_checked[]'] = testcase_has_checked
        data_dict['tag_list[]'] = $('#issue_tag').val()
        data_dict['assign'] = document.getElementById('issue_principal').value
        data_dict['stage'] = stage
        data_dict['start_time'] = document.getElementById('issue_starttime').value
        data_dict['stop_time'] = document.getElementById('issue_stoptime').value
        data_dict['contect'] =  CKEDITOR.instances['id_description'].getData()
        console.log(data_dict)
        // detect if there are some not filled
        if (data_dict['name'] == ''){
            invalid_summary.classList.remove('hidden')
            bool_ajax = false
        }else{
            invalid_summary.classList.add('hidden')     
        }
        if (data_dict['stop_time'] == ''){
            invalid_stoptime.classList.remove('hidden')
            bool_ajax = false
        }else{
            invalid_stoptime.classList.add('hidden')     
        }
        if (data_dict['start_time'] == ''){
            invalid_starttime.classList.remove('hidden')
            bool_ajax = false
        }else{
            invalid_starttime.classList.add('hidden')     
        }

        if (bool_ajax == true){
            $.ajax({
                type: 'POST',
                url: '/testplan/CreateTestplan/',
                data: data_dict,
                success:function(data) {
                    console.log("success");
                    window.location = '/testplan/14/testplan_view/';
                },
                error: function(data) {
                    console.log("error")
                    alert("Project name has already existed ")
                }
            })
        }
        
    }
}
// default detect project or testplan 
issue_choose_innertext = get_issue_mode.options[get_issue_mode.selectedIndex].text
if (issue_choose_innertext == 'Project'){
    testplan_class.forEach(element => element.classList.add('hidden'));
}else{
    testplan_class.forEach(element => element.classList.remove('hidden'));
}




var search_testcase_btn = document.getElementById('Search_testcase')
var search_testcase_tbody = document.getElementById('search_testcase_tbody')
search_testcase_btn.addEventListener('click',function(e){
    e.preventDefault()
    // reset checkbox all 
    selectall_testcase_checkbox.checked = false

    // check filter
    var search_tag_list =  $('#search_tag').val()
    var search_testcasename = $('#search_testcasename').val()
    var testcase_html = document.getElementById('testcase_html').value
    testcase_html = JSON.parse(testcase_html)
    var tag_tr = document.querySelectorAll('.tag_tr')
    tag_tr.forEach(element => {
        console.log()
        var get_bool = true
        var pk = element.id
        var testcasename = element.querySelector('#checktestcase').value
        var tag_list_div =element.querySelector('#tag').querySelectorAll('#each_tag')
        var temp_tag_list = []
        tag_list_div.forEach(element =>{
            temp_tag_list.push(element.innerHTML)
        })
        tag_list = temp_tag_list
        pk = pk.toString()
        if (search_testcasename != ''){
            if (!testcasename.includes(`${search_testcasename}`)){
                get_bool = false
            }
        }
        if (get_bool == true){
            for(num in search_tag_list){
                if (!tag_list.includes(search_tag_list[num])){
                    get_bool = false
                }
            }
        }
        if (get_bool == true){
            element.classList.remove('hidden')
        }else{
            element.classList.add('hidden')
        }

    });
})

var close_modal_create = document.getElementById('close_modal_create')
close_modal_create.addEventListener('click',function(e){
    invalid_summary.classList.add('hidden')
    invalid_starttime.classList.add('hidden')
    invalid_stoptime.classList.add('hidden')
})


// check all checkbox 
var selectall_testcase_checkbox = document.getElementById('selectall_testcase')
selectall_testcase_checkbox.addEventListener('click',function(e){
    var tag_tr = document.querySelectorAll('.tag_tr')
    if (selectall_testcase_checkbox.checked == true){
        tag_tr.forEach(element => {
            if (element.classList.contains('hidden')==false){
                element.querySelector('#checktestcase').checked = true
            }
        })
    }else{
        tag_tr.forEach(element => {
            if (element.classList.contains('hidden')==false){
                element.querySelector('#checktestcase').checked = false
            }
        })
    }
})

