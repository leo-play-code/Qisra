const dropdown_btn_list = document.querySelectorAll('.dropdown_btn')
dropdown_btn_list.forEach(element=>{
    element.addEventListener('click',function(e){
        if (element.style.transform == "rotate(-90deg)"){
            element.style.transform = "rotate(0deg)";
        }else{
            element.style.transform = "rotate(-90deg)";
        }
    })
})

CKEDITOR.editorConfig = function (config) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-'],
        ['Image'],
        ['Styles', 'Format', 'Font', 'FontSize'],

        ['TextColor', 'BGColor'],
        ['Undo', 'Redo'],
    ];
    // config.width = 670;
    config.height = 180;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;
};
const current_username = document.getElementById('current_user_username').value
const loading_save_info = document.getElementById('loading_save_info')
const loading_save_second = document.getElementById('loading_save_second')
const loading_save_testrun = document.getElementById('loading_save_testrun')
// EDIT ALL
var cancel_btn = document.getElementById('cancel_edit')
var dropdown_three_dot = document.getElementById('dropdown_three_dot')
var edit_all_btn = document.getElementById('edit_all')
var save_info_div = document.querySelectorAll('.info_savemode')
var edit_info_div = document.querySelectorAll('.info_editmode')
var second_box_save_div = document.getElementById('second-box-save-div')
var second_box_edit_div = document.getElementById('second-box-edit-div')
cancel_btn.addEventListener('click', function (e) {
    e.preventDefault()
    var Edit_next_level_btn = document.getElementById('edit_next_level')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var Save_next_level_btn = document.getElementById('save_next_level')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.remove('hidden')
    try {
        second_box_edit_btn.classList.add('hidden')
    } catch {
        second_box_save_btn.classList.add('hidden')
    }
    try {
        Edit_next_level_btn.classList.add("hidden");
    } catch {
        Save_next_level_btn.classList.add('hidden')
    }
    try {
        Edit_info_btn.classList.add('hidden');
    } catch {
        Save_info_btn.classList.add('hidden')
    }
    //save mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class', 'hidden')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class', '')
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.add('hidden')
    })
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
    cancel_btn.classList.add('hidden')
})
edit_all_btn.addEventListener('click', function (e) {
    e.preventDefault()
    var Edit_next_level_btn = document.getElementById('edit_next_level')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var Save_next_level_btn = document.getElementById('save_next_level')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.add('hidden')
    try {
        Edit_next_level_btn.classList.remove("hidden");
    } catch {
        Save_next_level_btn.classList.remove('hidden')
        var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
        teststep_tr_list_edit.setAttribute('class', '')
        var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
        teststep_tr_list_save.setAttribute('class', 'hidden')
    }
    try {
        second_box_edit_btn.classList.remove('hidden')
    } catch {
        second_box_save_btn.classList.remove('hidden')
        second_box_save_div.classList.add('hidden')
        second_box_edit_div.classList.remove('hidden')
    }
    try {
        Edit_info_btn.classList.remove('hidden');
    } catch {
        Save_info_btn.classList.remove('hidden')
        save_info_div.forEach(element => {
            element.classList.add('hidden')
        });
        edit_info_div.forEach(element => {
            element.classList.remove('hidden')
        })
    }

    cancel_btn.classList.remove('hidden')
})
var first_box_info_1 = document.getElementById('first_box_info_1')
var first_box_info_2 = document.getElementById('first_box_info_2')
var Edit_info_btn = document.getElementById('edit_info')
Edit_info_btn.addEventListener('click', function (e) {
    e.preventDefault()
    Edit_info_mode()
})
const edit_save_div_info = document.getElementById('edit-save-div-info')
function Edit_info_mode() {
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-sm btn-success" id="save_info" name="save_info">Save</button>
    `
    var SaveButton = document.getElementById('save_info')
    SaveButton.addEventListener('click', function (e) {
        e.preventDefault()
        SaveButton.classList.add('hidden')
        loading_save_info.classList.remove('hidden')
        save_info_django()
    })
    save_info_div.forEach(element => {
        element.classList.add('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.remove('hidden')
    })
    first_box_info_1.className = "col-md-4"
    first_box_info_2.className = "col-md-1"

}
var testplan_title = document.getElementById('testplan_title')
const save_name_p = document.getElementById('save_name')
const save_issue_name_p = document.getElementById('save_issue_name')
const save_context_div = document.getElementById('save_context')
const edit_context_div = document.getElementById('edit_context')
const save_tag_p = document.getElementById('save_tag')
const save_stage_p = document.getElementById('save_stage')
const save_assign_p = document.getElementById('save_assign')
const save_start_date_p = document.getElementById('save_start_date')
const save_end_date_p = document.getElementById('save_end_date')
const save_status_p = document.getElementById('save_status')
const testplan_issue_name_show_span = document.getElementById('testplan_issue_name_show')
const upload_testplan_btn = document.getElementById('upload-testplan')
const already_upload_testplan_btn = document.getElementById('already-upload-testplan')
function Save_info_mode() {
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-sm btn-danger" id="edit_info" name="edit_info" value="edit_info">Edit</button>
    `
    var EditButton = document.getElementById('edit_info')
    EditButton.addEventListener('click', function (e) {
        e.preventDefault()
        Edit_info_mode()
    })
    var name_data = $('#id_testplanname').val()
    var issue_name_data = $('#id_testplan_issue_name').val()
    var tag_list = $('#id_tag').val()
    var stage = $('#edit_stage_select').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    try{
        var status = document.getElementById('edit_status').querySelector('input[name="testplan_status_option_edit"]:checked').id
        status = status.replace('-outlined-testplan-edit', '')
    }catch{
        status = 'pending'
    }
    
    testplan_title.innerHTML = `${name_data}`
    testplan_issue_name_show_span.innerHTML = `[${issue_name_data}]`
    save_name_p.innerHTML = `名稱: ${name_data}`
    save_issue_name_p.innerHTML = `鏈值: ${issue_name_data}`
    save_tag_p.innerHTML = `標籤:`
    if (tag_list == null) {
        save_tag_p.innerHTML += ` <span>無</span>`
    } else {
        for (item in tag_list) {
            save_tag_p.innerHTML += ` <span style="color:#5DADE2;">${tag_list[item]}</span>`
        }
    }
    save_stage_p.innerHTML = `Stage: ${stage}`
    save_start_date_p.innerHTML = `開始日: ${start_date}`
    // record old assign
    var assign_list = document.querySelectorAll('.assign_list')
    var assign_orignal = document.getElementById('save_assign').innerHTML
    assign_orignal = assign_orignal.replaceAll('負責人: ', '')
    if (assign != 'None') {
        save_assign_p.innerHTML = `負責人: ${assign}`
    } else {
        save_assign_p.innerHTML = `負責人: 未指派`
    }
    save_end_date_p.innerHTML = `結束日: ${end_date}`
    if (status == 'Ongoing') {
        save_status_p.innerHTML = `狀態:   
        <button type="button" class="btn btn-sm btn-primary" style="--bs-btn-disabled-opacity:1" disabled >進行中</button>
        `
        if (current_username == assign){
            upload_testplan_btn.classList.remove('hidden')
        }else{
            upload_testplan_btn.classList.add('hidden')
        }
        already_upload_testplan_btn.classList.add('hidden')
    } else if (status == 'Closed') {
        save_status_p.innerHTML = `狀態:   
        <button type="button" class="btn btn-sm btn-success" style="--bs-btn-disabled-opacity:1" disabled >關閉</button>
        `
        upload_testplan_btn.classList.add('hidden')
        already_upload_testplan_btn.classList.add('hidden')
    } else if (status == 'Not_start') {
        save_status_p.innerHTML = `狀態:   
        <button type="button" class="btn btn-sm btn-secondary" style="--bs-btn-disabled-opacity:1" disabled >未開始</button>
        `
        upload_testplan_btn.classList.add('hidden')
        already_upload_testplan_btn.classList.add('hidden')
    }else{
        save_status_p.innerHTML = `狀態:   
        <button type="button" class="btn btn-sm btn-warning" style="--bs-btn-disabled-opacity:1" disabled>pending</button>
        `
        upload_testplan_btn.classList.add('hidden')
        already_upload_testplan_btn.classList.remove('hidden')
    }
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.add('hidden')
    })
    var clone_div = document.getElementById('clone_div')
    if (testplan_title.innerHTML.includes('-clone')) {
        clone_div.classList.add('hidden')
    } else {
        clone_div.classList.remove('hidden')
    }
    first_box_info_1.className = "col-md-3"
    first_box_info_2.className = "col-md-2"
    // refresh table issue_name
    var issue_number_href = document.querySelectorAll('.issue_number_href')
    issue_number_href.forEach(element => {
        temp_issue_list = element.innerHTML.split('-')
        element.innerHTML = `${issue_name_data}-${temp_issue_list[1]}`
    })
    // refresh table assign name
    if (assign == 'None') {
        new_assign = '未指派'
    } else {
        new_assign = assign
    }
    assign_list.forEach(element => {
        old_innerHtml = element.innerHTML
        if (old_innerHtml.includes(new_assign)){
            old_innerHtml = old_innerHtml.replaceAll(new_assign, '')
        }
        if (!old_innerHtml.includes(assign_orignal)) {
            old_innerHtml += `${new_assign}`
        }
        if (new_assign == '未指派'){
            if (!containsAnyLetter(old_innerHtml.replaceAll(assign_orignal, '').replaceAll(' ', ''))) {
                new_innerHtml = old_innerHtml.replaceAll(assign_orignal, new_assign)
            } else {
                new_innerHtml = old_innerHtml.replaceAll(assign_orignal, '')
            }
        }else{
            new_innerHtml = old_innerHtml.replaceAll(assign_orignal, new_assign)
        }

        element.innerHTML = new_innerHtml
    })

}
const error_name_msg = document.getElementById('error-name')
const error_issue_name_msg = document.getElementById('error-issue-name')
const error_time_msg = document.getElementById('invalid-testplan-time')
const error_start_time_msg = document.getElementById('invalid-testplan-start-time')
const error_end_time_msg = document.getElementById('invalid-testplan-end-time')
function save_info_django() {
    var bool_ajax = true
    var csrftoken = getCookie('csrftoken');
    var tag_list = $('#id_tag').val()
    var stage = $('#edit_stage_select').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    try{
        status_data = document.getElementById('edit_status').querySelector('input[name="testplan_status_option_edit"]:checked').id
        status_data = status_data.replace('-outlined-testplan-edit', '')
    }catch{
        status_data = 'pending'
    }
    if (status_data == 'Not_start'){
        var status = '3'
    } else if (status_data == 'Ongoing'){
        var status = '2'
    } else if (status_data == 'Closed'){
        var status = '4'
    }else if (status_data == 'pending'){
        var status = '1'
    }
    var name_data = $('#id_testplanname').val()
    var issue_name_data = $('#id_testplan_issue_name').val()
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_info'] = 'save_info';
    data_dict['name'] = name_data
    data_dict['tag_list[]'] = tag_list
    data_dict['stage'] = stage
    data_dict['assign'] = assign
    data_dict['start_date'] = start_date
    data_dict['end_date'] = end_date
    data_dict['status'] = status
    data_dict['issue_name'] = issue_name_data

    if (name_data.replaceAll(' ', '') == '') {
        error_name_msg.classList.remove('hidden')
        bool_ajax = false
    } else {
        error_name_msg.classList.add('hidden')
    }
    if (issue_name_data.replaceAll(' ', '') == '') {
        error_issue_name_msg.classList.remove('hidden')
        bool_ajax = false
    } else {
        error_issue_name_msg.classList.add('hidden')
    }

    if (data_dict['start_date'] == '') {
        error_start_time_msg.classList.remove('hidden')
        bool_ajax = false
    } else {
        error_start_time_msg.classList.add('hidden')
    }
    if (data_dict['end_date'] == '') {
        error_end_time_msg.classList.remove('hidden')
        bool_ajax = false
    } else {
        error_end_time_msg.classList.add('hidden')
    }
    var start_time = new Date(data_dict['start_date'])
    var stop_time = new Date(data_dict['end_date'])

    if (start_time.getTime() >= stop_time.getTime()) {
        error_time_msg.classList.remove('hidden')
        bool_ajax = false
    } else {
        error_time_msg.classList.add('hidden')
    }

    if (bool_ajax == true) {
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success: function () {
                console.log("success");
                Save_info_mode()
                loading_save_info.classList.add('hidden')
            },
            error: function (data) {
                console.log("error");
                var SaveButton = document.getElementById('save_info')
                loading_save_info.classList.add('hidden')
                SaveButton.classList.remove('hidden')
                alert("此Testplan名稱已被使用")
            }
        });
    } else {
        var SaveButton = document.getElementById('save_info')
        loading_save_info.classList.add('hidden')
        SaveButton.classList.remove('hidden')
    }


}

var Edit_next_level_btn = document.getElementById('edit_next_level')

var edit_table_div = document.getElementById('edit-save-div-next-level')
Edit_next_level_btn.addEventListener('click', function (e) {
    e.preventDefault()
    console.log('edit down')
    _edit_table()
})
var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
function _edit_table() {
    edit_table_div.innerHTML = `
        <button type="submit" class="btn btn-sm btn-warning" id="save_next_level" name="save_next_level">Cancel</button>
    `
    var Save_next_level_btn = document.getElementById('save_next_level')
    Save_next_level_btn.addEventListener('click', function (e) {
        e.preventDefault()
        _save_table()
    })
    teststep_tr_list_edit.classList.remove('hidden')
    teststep_tr_list_save.classList.add('hidden')

}

function _save_table() {
    console.log('save down')
    edit_table_div.innerHTML = `
    <button type="submit" class="btn btn-sm btn-danger" id="edit_next_level" name="edit_next_level">Edit</button>
    `
    var Edit_next_level_btn = document.getElementById('edit_next_level')
    Edit_next_level_btn.addEventListener('click', function (e) {
        e.preventDefault()
        console.log('edit down')
        _edit_table()
    })
    teststep_tr_list_edit.classList.add('hidden')
    teststep_tr_list_save.classList.remove('hidden')
}


// screen full 
var teststepview_table = document.querySelectorAll('.teststepview_table')
var fullscreen_btn = document.getElementById('fullscreen')
var smallscreen_btn = document.getElementById('smallscreen')
fullscreen_btn.addEventListener('click', function (e) {
    e.preventDefault()
    fullscreen_btn.classList.add('hidden')
    smallscreen_btn.classList.remove('hidden')
    teststepview_table.forEach(element => {
        element.classList.remove('teststepview_table', 'tableFixHead')
    })

})
smallscreen_btn.addEventListener('click', function (e) {
    e.preventDefault()
    fullscreen_btn.classList.remove('hidden')
    smallscreen_btn.classList.add('hidden')
    teststepview_table.forEach(element => {
        element.classList.add('teststepview_table', 'tableFixHead')
    })
})


// testplan search testcase 
var testplan_search_testcase_btn = document.getElementById('testplan_search_testcase')
testplan_search_testcase.addEventListener('click', function (e) {
    e.preventDefault()
    _Testplan_search_testcase()
})

function _Testplan_search_testcase() {
    var target_name = $('#testplan_search_testcase_name').val()
    var target_tag_list = $('#testplan_search_testcase_tag').val()

    var search_all_testcase_tr = document.querySelectorAll('.testplan_search_testcase_tr')
    search_all_testcase_tr.forEach(element => {
        var get_bool = true
        var testcase_name = element.querySelector('#testplan_check_testcase_name').innerText
        var tag_list_div = element.querySelector('#testplan_search_testcase_tag').querySelectorAll('#testplan_each_testcase_tag')
        var temp_tag_list = []
        tag_list_div.forEach(element => {
            temp_tag_list.push(element.innerHTML)
        })
        tag_list = temp_tag_list
        if (target_name != '') {
            if (!testcase_name.includes(`${target_name}`)) {
                get_bool = false
            }
        }
        if (get_bool == true) {
            for (num in target_tag_list) {
                if (!tag_list.includes(target_tag_list[num])) {
                    get_bool = false
                }
            }
        }
        if (get_bool == true) {
            element.classList.remove('hidden')
        } else {
            element.classList.add('hidden')
        }
    })
}

var testplan_add_testcase = []
var testplan_add_testcase_plus_class = document.querySelectorAll('.testplan_add_testcase_plus')
testplan_add_testcase_plus_class.forEach(element => {
    element.addEventListener('click', function (e) {
        console.log('add', element.id)
        if (element.innerHTML == `<i class="fa-solid fa-check"></i>`) {
            element.innerHTML = `<img src='/static/images/plus.svg'>`
            testplan_add_testcase.pop(element.id)
        } else {
            element.innerHTML = `<i class="fa-solid fa-check"></i>`
            testplan_add_testcase.push(element.id)
        }
        console.log(testplan_add_testcase)
    })
})

var testplan_add_testcase_btn = document.getElementById('testplan_add_testcase_btn')
testplan_add_testcase_btn.addEventListener('click', function (e) {
    testplan_add_testcase_btn.classList.add('hidden')
    loading_save_testrun.classList.remove('hidden')
    e.preventDefault()
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_testcase'] = 'save_testcase'
    data_dict['testcase_list[]'] = testplan_add_testcase
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function () {
            console.log("success");
            window.location = '';
        },
        error: function () {
            console.log("error");
            loading_save_testrun.classList.add('hidden')
            testplan_add_testcase_btn.classList.remove('hidden')

        }
    });

})


var clone_div = document.getElementById('clone_div')
if (testplan_title.innerHTML.includes('-clone')) {
    clone_div.classList.add('hidden')
} else {
    clone_div.classList.remove('hidden')
}

//second-box
var second_box_edit_save_div = document.getElementById('second-box-edit-save_div')
var second_box_edit_btn = document.getElementById('second-box-edit')
// var second_box_save_btn = document.getElementById('second-box-save')
second_box_edit_btn.addEventListener('click', function (e) {
    e.preventDefault()
    _edit_second_box_mode()
})
function _save_second_box_todjango() {
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['context'] = context_data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_context_data'] = 'save'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function () {
            console.log("success");
            _save_second_box_mode()
            loading_save_second.classList.add('hidden')
        },
        error: function (data) {
            console.log("error");
            var second_box_save_btn = document.getElementById('second-box-save')
            loading_save_second.classList.add('hidden')
            second_box_save_btn.classList.remove('hidden')
        }
    });

}
function _edit_second_box_mode() {
    second_box_edit_save_div.innerHTML = `<button type="submit" class="btn btn-sm btn-success" id="second-box-save" name="second-box-save">Save</button>`
    var second_box_save_btn = document.getElementById('second-box-save')
    second_box_save_btn.addEventListener('click', function (e) {
        e.preventDefault()
        second_box_save_btn.classList.add('hidden')
        loading_save_second.classList.remove('hidden')
        _save_second_box_todjango()
    })
    second_box_save_div.classList.add('hidden')
    second_box_edit_div.classList.remove('hidden')
}
function _save_second_box_mode() {
    second_box_edit_save_div.innerHTML = `<button type="submit" class="btn btn-sm btn-danger" id="second-box-edit" name="second-box-edit">Edit</button>`
    var second_box_edit_btn = document.getElementById('second-box-edit')
    second_box_edit_btn.addEventListener('click', function (e) {
        e.preventDefault()
        _edit_second_box_mode()
    })
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
    if (context_data == '') {
        save_context_div.classList.add('save_context_no_text')
        save_context_div.classList.remove('save_context_has_text')
        save_context_div.innerHTML = `&nbsp&nbsp&nbsp&nbsp&nbspNo description`
    } else {
        save_context_div.classList.remove('save_context_no_text')
        save_context_div.classList.add('save_context_has_text')
        save_context_div.innerHTML = `${context_data}<br>`
    }
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
}


function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
}
const already_upload_testplan = document.getElementById('already-upload-testplan')
// 等待結案
upload_testplan_btn.addEventListener('click',function(e){
    e.preventDefault()
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['upload_testplan'] = 'upload_testplan'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function () {
            console.log("success");
            save_status_p.innerHTML = `狀態:   
            <button type="button" class="btn btn-sm btn-warning" style="--bs-btn-disabled-opacity:1" disabled>pending</button>
            `
            upload_testplan_btn.classList.add('hidden')
            already_upload_testplan_btn.classList.remove('hidden')
            document.getElementById('Ongoing-outlined-testplan-edit').checked = false
        },
        error: function (data) {
            console.log("error");
        }
    });
})