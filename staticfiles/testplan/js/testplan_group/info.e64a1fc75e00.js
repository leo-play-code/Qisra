CKEDITOR.editorConfig = function (config) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-'],
        ['Image'],
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['Undo', 'Redo']
    ];
    // config.width = 670;
    config.height = 180;
    // config.autoParagraph = false;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;
};

// dropdown 
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

// info-btn
const Edit_info_btn = document.getElementById('Edit_info_btn')
const Save_info_btn = document.getElementById('Save_info_btn')
const Cancel_info_btn = document.getElementById('Cancel_info_btn')
const loading_save_info = document.getElementById('loading_save_info')

var save_info_div = document.querySelectorAll('.info_savemode')
var edit_info_div = document.querySelectorAll('.info_editmode')

const current_username = document.getElementById('current_user_username').value
const error_name_msg = document.getElementById('error-name')

const error_time_msg = document.getElementById('invalid-testplan-time')
const error_start_time_msg = document.getElementById('invalid-testplan-start-time')
const error_end_time_msg = document.getElementById('invalid-testplan-end-time')
var testplan_title = document.getElementById('testplan_title')
const save_name_p = document.getElementById('save_name')
const save_tag_p = document.getElementById('save_tag')
const save_stage_p = document.getElementById('save_stage')
const save_assign_p = document.getElementById('save_assign')
const save_start_date_p = document.getElementById('save_start_date')
const save_end_date_p = document.getElementById('save_end_date')
const save_status_p = document.getElementById('save_status')
const upload_testplan_btn = document.getElementById('upload-testplan')
const already_upload_testplan_btn = document.getElementById('already-upload-testplan')
const edit_start_date_input = document.getElementById('edit_start_date_input')
const edit_end_date_input = document.getElementById('edit_end_date_input')
const edit_status_p = document.getElementById('edit_status')
function _Edit_info(DOM){
    if($('#dropdown_btn1').attr("aria-expanded")=='false'){
        $('#dropdown_btn1').click()
    }
    // 按鈕狀態
    Edit_info_btn.classList.add('hidden')
    Save_info_btn.classList.remove('hidden')
    Cancel_info_btn.classList.remove('hidden')
    save_info_div.forEach(element=>{
        element.classList.add('hidden')
    })
    edit_info_div.forEach(element=>{
        element.classList.remove('hidden')
    })
    return false
}

function _Save_info(DOM){
    // 按鈕狀態
    Save_info_btn.classList.add('hidden')
    Cancel_info_btn.classList.add('hidden')
    loading_save_info.classList.remove('hidden')
    save_info_django()
    return false
}

function _Cancel_info(DOM){
    // reset name
    var save_name_data = save_name_p.innerHTML.replaceAll('名稱: ','')
    $('#id_testplanname').val(save_name_data)
    // reset stage
    var save_stage_data = save_stage_p.innerHTML.replaceAll('Stage: ','')
    $('#edit_stage_select').val(save_stage_data).change()
    // reset status
    var save_status_data = save_status_p.querySelector('.btn').innerHTML
    if (save_status_data=='進行中'){
        edit_status_p.querySelector('#Ongoing-outlined-testplan-edit').checked = true
    }else{
        edit_status_p.querySelector('#Ongoing-outlined-testplan-edit').checked = false
    }
    if (save_status_data=='關閉'){
        edit_status_p.querySelector('#Closed-outlined-testplan-edit').checked = true
    }else{
        edit_status_p.querySelector('#Closed-outlined-testplan-edit').checked = false
    }
    if (save_status_data=='未開始'){
        edit_status_p.querySelector('#Not_start-outlined-testplan-edit').checked = true
    }else{
        edit_status_p.querySelector('#Not_start-outlined-testplan-edit').checked = false
    }
    // reset tag
    var temp_tag_list = []
    var tag_list = document.getElementById('save_tag').querySelectorAll('span')
    tag_list.forEach(element=>{
        temp_tag_list.push(element.innerHTML)
    })
    $('#id_tag').val(temp_tag_list)
    $('#id_tag').selectpicker("refresh");
    // reset time
    save_start_date = document.getElementById('save_start_date').innerHTML.replaceAll('開始日: ','')
    save_end_date = document.getElementById('save_end_date').innerHTML.replaceAll('結束日: ','')
    if (save_start_date != '未選擇日期'){
        edit_start_date_input.value = save_start_date
    }else{
        edit_start_date_input.value = ''
    }
    if (save_end_date != '未選擇日期'){
        edit_end_date_input.value = save_end_date
    }else{
        edit_end_date_input.value = ''
    }
    // reset assign
    assign_data = document.getElementById('save_assign').innerHTML.replaceAll('負責人: ','')
    if (assign_data == '未指派'){
        $('#edit_assign_select').val('None')
    }else{
        $('#edit_assign_select').val(assign_data)
    }
    $('#edit_assign_select').selectpicker("refresh");
    // 按鈕狀態
    Save_info_btn.classList.add('hidden')
    Cancel_info_btn.classList.add('hidden')
    Edit_info_btn.classList.remove('hidden')
    error_name_msg.classList.add('hidden')
    error_time_msg.classList.add('hidden')
    error_start_time_msg.classList.add('hidden')
    error_end_time_msg.classList.add('hidden')
    error_time_msg.classList.add('hidden')
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.add('hidden')
    })
    return false
}



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

    if (name_data.replaceAll(' ', '') == '') {
        error_name_msg.classList.remove('hidden')
        bool_ajax = false
    } else {
        error_name_msg.classList.add('hidden')
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
                // Save_info_mode()
                window.location=''
                loading_save_info.classList.add('hidden')
                createToast(true, 'Testplan information 儲存成功')
            },
            error: function (data) {
                console.log("error");
                loading_save_info.classList.add('hidden')
                Save_info_btn.classList.remove('hidden')
                createToast(false, '此Testplan名稱已被使用！')
            }
        });
    } else {
        loading_save_info.classList.add('hidden')
        Save_info_btn.classList.remove('hidden')
        Cancel_info_btn.classList.remove('hidden')
    }
}

function Save_info_mode() {
    Edit_info_btn.classList.remove('hidden')
    var name_data = $('#id_testplanname').val()
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
    save_name_p.innerHTML = `名稱: ${name_data}`
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
        save_assign_p.innerHTML = `負責人: <span style="color:red ;">未指派`
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



function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
}


function _Upload_testplan_method(DOM){
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
    return false
}