// issue mode
var get_issue_mode = document.getElementById('issue_type')
try {
    var issue_choose_value = get_issue_mode.options[0].value
    var issue_choose_innertext = get_issue_mode.options[0].text
} catch (e) { }
const testplan_class = document.querySelectorAll('.testplan-css')
if (issue_choose_innertext == 'Testcase') {
    testplan_class.forEach(element => element.classList.add('hidden'));
} else {
    testplan_class.forEach(element => element.classList.remove('hidden'));
}
get_issue_mode.addEventListener('change', function handleChange(event) {
    issue_choose_value = get_issue_mode.options[get_issue_mode.selectedIndex].value
    issue_choose_innertext = get_issue_mode.options[get_issue_mode.selectedIndex].text
    invalid_summary.classList.add('hidden')
    invalid_starttime.classList.add('hidden')
    invalid_name.classList.add('hidden')
    invalid_time.classList.add('hidden')
    invalid_stoptime.classList.add('hidden')
    if (issue_choose_innertext == 'Project') {
        testplan_class.forEach(element => element.classList.add('hidden'));
    } else {
        testplan_class.forEach(element => element.classList.remove('hidden'));
    }
})
// CKEDITOR.editorConfig = function (config) {
//     config.toolbar = [
//         ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
//         ['Bold', 'Italic', 'Underline', 'Strike', '-'],
//         ['Image'],
//         ['Styles', 'Format', 'Font', 'FontSize'],
//         ['TextColor', 'BGColor'],
//         ['Undo', 'Redo', 'lineheight'],
//     ];
//     config.width = 400;
//     config.height = 180;
//     config.fillEmptyBlocks = false;
//     config.enterMode = CKEDITOR.ENTER_BR;
// };
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
const loading_create_testplan_project = document.getElementById('loading_create_testplan_project')
var save_btn = document.getElementById('save_create')
save_btn.addEventListener('click', function (e) {
    e.preventDefault()
    send_save()
})
var invalid_summary = document.getElementById('invalid-summary')
var invalid_name = document.getElementById('invalid-name')
var invalid_stoptime = document.getElementById('invalid-stoptime')
var invalid_starttime = document.getElementById('invalid-starttime')
var invalid_time = document.getElementById('invalid-create-time')
var invalid_project = document.getElementById('invalid-project')
function send_save() {
    var bool_ajax = true
    var csrftoken = getCookie('csrftoken')
    var data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    if (issue_choose_innertext == 'Project') {
        data_dict['name'] = document.getElementById('issue_summary').value
        data_dict['creator'] = document.getElementById('issue_uploader').value
        data_dict['tag_list[]'] = $('#issue_tag').val()
        data_dict['assign'] = document.getElementById('issue_principal').value
        var description_data = CKEDITOR.instances['id_create_description'].getData().replace(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        data_dict['description'] = description_data
        data_dict['start_time'] = document.getElementById('issue_starttime').value
        data_dict['stop_time'] = document.getElementById('issue_stoptime').value
        // detect if there are some not filled
        if (data_dict['name'] == '') {
            invalid_summary.classList.remove('hidden')
            bool_ajax = false
        } else {
            invalid_summary.classList.add('hidden')
        }
        //  compate datetime 
        if (data_dict['stop_time'] != '' && data_dict['start_time'] != '') {
            var start_time = new Date(data_dict['start_time'])
            var stop_time = new Date(data_dict['stop_time'])
            if (start_time.getTime() >= stop_time.getTime()) {
                invalid_time.classList.remove('hidden')
                bool_ajax = false
            } else {
                invalid_time.classList.add('hidden')
            }
        } else {
            invalid_time.classList.add('hidden')
        }

        if (bool_ajax == true) {
            save_btn.classList.add('hidden')
            loading_create_testplan_project.classList.remove('hidden')
            $.ajax({
                type: 'POST',
                url: '/project/CreateProject/',
                data: data_dict,
                success: function (data) {
                    console.log("success");
                    window.location = '/project/' + data['id'] + '/project/';
                },
                error: function (data) {
                    console.log("error")
                    alert("Project name has already existed ")
                }
            })
        }
    } else if (issue_choose_innertext == 'Testplan') {
        var checkboxes = document.querySelectorAll('input[name="checktestcase"]:checked');
        var testcase_has_checked = [];
        checkboxes.forEach((checkbox) => {
            testcase_has_checked.push(checkbox.value);
        });
        var description_data = CKEDITOR.instances['id_create_description'].getData().replace(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        var stage = document.querySelector('input[name="StageMethod"]:checked');
        stage = stage.id
        data_dict['name'] = document.getElementById('issue_summary').value
        data_dict['project'] = $('#issue_project').val()
        data_dict['creator'] = document.getElementById('issue_uploader').value
        data_dict['testcase_has_checked[]'] = testcase_has_checked
        data_dict['tag_list[]'] = $('#issue_tag').val()
        data_dict['assign'] = $('#issue_principal').val()
        data_dict['stage'] = stage
        data_dict['start_time'] = document.getElementById('issue_starttime').value
        data_dict['stop_time'] = document.getElementById('issue_stoptime').value
        data_dict['contect'] = description_data
        data_dict['issue_name'] = document.getElementById('issue_name').value
        console.log(data_dict)
        // detect if there are some not filled
        if (data_dict['name'] == '') {
            invalid_summary.classList.remove('hidden')
            bool_ajax = false
        } else {
            invalid_summary.classList.add('hidden')
        }
        if (data_dict['stop_time'] == '') {
            invalid_stoptime.classList.remove('hidden')
            bool_ajax = false
        } else {
            invalid_stoptime.classList.add('hidden')
        }
        if (data_dict['start_time'] == '') {
            invalid_starttime.classList.remove('hidden')
            bool_ajax = false
        } else {
            invalid_starttime.classList.add('hidden')
        }
        if (data_dict['issue_name'] == '') {
            invalid_name.classList.remove('hidden')
            bool_ajax = false
        } else {
            invalid_name.classList.add('hidden')
        }
        var start_time = new Date(data_dict['start_time'])
        var stop_time = new Date(data_dict['stop_time'])

        if (start_time.getTime() >= stop_time.getTime()) {
            invalid_time.classList.remove('hidden')
            bool_ajax = false
        } else {
            invalid_time.classList.add('hidden')
        }
        if (data_dict['project'] =='None'){
            invalid_project.classList.remove('hidden')
            bool_ajax = false
        }else{
            invalid_project.classList.add('hidden')
        }
        if (bool_ajax == true) {
            save_btn.classList.add('hidden')
            loading_create_testplan_project.classList.remove('hidden')
            $.ajax({
                type: 'POST',
                url: '/testplan/CreateTestplan/',
                data: data_dict,
                success: function (data) {
                    console.log("success");
                    window.location = '/testplan/' + data['id'] + '/testplan_view/';
                },
                error: function (data) {
                    console.log("error")
                    alert("Project name has already existed ")
                }
            })
        }

    }
}
// default detect project or testplan 
issue_choose_innertext = get_issue_mode.options[get_issue_mode.selectedIndex].text
if (issue_choose_innertext == 'Project') {
    testplan_class.forEach(element => element.classList.add('hidden'));
} else {
    testplan_class.forEach(element => element.classList.remove('hidden'));
}




var search_testcase_btn = document.getElementById('Search_testcase')
var search_testcase_tbody = document.getElementById('search_testcase_tbody')
search_testcase_btn.addEventListener('click', function (e) {
    e.preventDefault()
    // reset checkbox all 
    selectall_testcase_checkbox.checked = false

    // check filter
    var search_tag_list = $('#search_tag').val()
    var search_testcasename = $('#search_testcasename').val()
    var testcase_html = document.getElementById('testcase_html').value
    testcase_html = JSON.parse(testcase_html)
    var tag_tr = document.querySelectorAll('.tag_tr')
    tag_tr.forEach(element => {
        console.log()
        var get_bool = true
        var pk = element.id
        var testcasename = element.querySelector('#checktestcase').value
        var tag_list_div = element.querySelector('#tag').querySelectorAll('#each_tag')
        var temp_tag_list = []
        tag_list_div.forEach(element => {
            temp_tag_list.push(element.innerHTML)
        })
        tag_list = temp_tag_list
        pk = pk.toString()
        if (search_testcasename != '') {
            if (!testcasename.includes(`${search_testcasename}`)) {
                get_bool = false
            }
        }
        if (get_bool == true) {
            for (num in search_tag_list) {
                if (!tag_list.includes(search_tag_list[num])) {
                    get_bool = false
                }
            }
        }
        if (get_bool == true) {
            element.classList.remove('hidden')
        } else {
            element.classList.add('hidden')
        }

    });
})

var close_modal_create = document.getElementById('close_modal_create')
close_modal_create.addEventListener('click', function (e) {
    invalid_summary.classList.add('hidden')
    invalid_starttime.classList.add('hidden')
    invalid_stoptime.classList.add('hidden')
})


// check all checkbox 
var selectall_testcase_checkbox = document.getElementById('selectall_testcase')
selectall_testcase_checkbox.addEventListener('click', function (e) {
    var tag_tr = document.querySelectorAll('.tag_tr')
    if (selectall_testcase_checkbox.checked == true) {
        tag_tr.forEach(element => {
            if (element.classList.contains('hidden') == false) {
                element.querySelector('#checktestcase').checked = true
            }
        })
    } else {
        tag_tr.forEach(element => {
            if (element.classList.contains('hidden') == false) {
                element.querySelector('#checktestcase').checked = false
            }
        })
    }
})


function _Create_Modal_Create_Tag(dom){
    new_tag_name = document.getElementById('create_add_tag_input').value
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['add_tag'] = 'add_tag';
    data_dict['tag_name'] = new_tag_name;
    if (new_tag_name.replaceAll(' ','')==''){
        createToast(false, 'Tag 名稱 不可為空白')
    }else{
        $.ajax({
            type: 'GET',
            url: '/testcase/new_tag/',
            data: data_dict,
            success: function (data) {
                console.log('success')
                if(data['status']=='pass'){
                    finish_add_tag(data)
                    createToast(true, 'Tag 名稱 :'+data['name']+'已成功建立!')
                }else{
                    createToast(false, 'Tag 名稱 :'+data['name']+'已被命名了!')
                }
                document.getElementById('create_add_tag_input').value = ''
            },
            error: function (data) {
                console.log("error");
            }
        });
    }   
    
    return false
}

function finish_add_tag(data){
    new_tag_name = data['name']
    new_tag_id = data['id']
    // reset selectpicker
    var tag_list = $('#issue_tag').val()
    var new_tag_list = []
    for (item in tag_list){
        new_tag_list.push(tag_list[item])
    }
    $("#issue_tag").append('<option value="'+new_tag_id+'">'+new_tag_name+'</option>');
    new_tag_list.push(new_tag_id)
    $("#issue_tag").selectpicker('val', new_tag_list);
    $("#issue_tag").selectpicker("refresh");
}

function _Open_create_tag(dom){
    console.log(dom.innerHTML)
    if (dom.innerHTML=='<img src="/static/images/journal-plus.svg">'){
        console.log('same')
        dom.innerHTML = `<button class="btn btn-warning btn-sm">cancel</button>`
    }else{
        dom.innerHTML = `<img src="/static/images/journal-plus.svg">`
    }
    createtag_css = document.querySelectorAll('.createtag-css')
    createtag_css.forEach(css_element=>{
        if (css_element.classList.contains('hidden')){
            css_element.classList.remove('hidden')
        }else{
            css_element.classList.add('hidden')
        }
    })
}
