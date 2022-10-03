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
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.remove('hidden')
    try {
        Edit_info_btn.classList.add('hidden');
    } catch {
        Save_info_btn.classList.add('hidden')
    }
    try {
        second_box_edit_btn.classList.add('hidden')
    } catch {
        second_box_save_btn.classList.add('hidden')
    }
    //save mode
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.add('hidden')
    })
    cancel_btn.classList.add('hidden')
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
})
edit_all_btn.addEventListener('click', function (e) {
    e.preventDefault()

    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.add('hidden')
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



// INFO method
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
}
var project_title = document.getElementById('project_title')
const save_name_p = document.getElementById('save_name')
const save_context_div = document.getElementById('save_context')
const save_tag_p = document.getElementById('save_tag')
const save_assign_p = document.getElementById('save_assign')
const save_start_date_p = document.getElementById('save_start_date')
const save_end_date_p = document.getElementById('save_end_date')
function Save_info_mode() {
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-sm btn-danger" id="edit_info" name="edit_info" value="edit_info">Edit</button>
    `
    var EditButton = document.getElementById('edit_info')
    EditButton.addEventListener('click', function (e) {
        e.preventDefault()
        Edit_info_mode()
    })
    var name_data = $('#id_project_name').val()
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
    var tag_list = $('#id_tag').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    project_title.innerHTML = `${name_data}`
    save_name_p.innerHTML = `名稱: ${name_data}`
    save_context_div.innerHTML = `${context_data}<br>`
    save_tag_p.innerHTML = `標籤:`
    if (tag_list == null) {
        save_tag_p.innerHTML += ` <span>無</span>`
    } else {
        for (item in tag_list) {
            save_tag_p.innerHTML += ` <span style="color:#5DADE2;">${tag_list[item]}</span>`
        }
    }
    if (start_date != ''){
        save_start_date_p.innerHTML = `開始日: ${start_date}`
    }else{
        save_start_date_p.innerHTML = `開始日: 未選擇日期`
    }
    if (end_date != ''){
        save_end_date_p.innerHTML = `結束日: ${end_date}`
    }else{
        save_end_date_p.innerHTML = `結束日: 未選擇日期`
    }
    
    if (assign != 'None') {
        save_assign_p.innerHTML = `負責人: ${assign}`
    } else {
        save_assign_p.innerHTML = `負責人: 未指派`
    }
    
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.add('hidden')
    })
    var clone_div = document.getElementById('clone_div')
    if (project_title.innerHTML.includes('-clone')) {
        clone_div.classList.add('hidden')
    } else {
        clone_div.classList.remove('hidden')
    }
}
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
    // config.autoParagraph = false;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;
};

var error_name_msg = document.getElementById('error-name')
var error_time_msg = document.getElementById('invalid-project-time')
function save_info_django() {    
    bool_ajax = true
    var name_data = $('#id_project_name').val()
    var csrftoken = getCookie('csrftoken');
    var tag_list = $('#id_tag').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_info'] = 'save_info';
    data_dict['name'] = name_data
    data_dict['tag_list[]'] = tag_list
    data_dict['assign'] = assign
    data_dict['start_date'] = start_date
    data_dict['end_date'] = end_date
    if (name_data.replaceAll(' ','')==''){
        error_name_msg.classList.remove('hidden')
        bool_ajax = false
    }else{
        error_name_msg.classList.add('hidden')
    }
    if (data_dict['end_date'] != '' && data_dict['start_date'] != '') {
        var start_date = new Date(data_dict['start_date'])
        var end_date = new Date(data_dict['end_date'])
        
        if (start_date.getTime() >= end_date.getTime()) {
            error_time_msg.classList.remove('hidden')
            bool_ajax = false
        } else {
            error_time_msg.classList.add('hidden')
        }
    } else {
        error_time_msg.classList.add('hidden')
    }
    if (bool_ajax == true){
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
                loading_save_info.classList.add('hidden')
                var SaveButton = document.getElementById('save_info')
                SaveButton.classList.remove('hidden')
                alert("此Project名稱已被使用")
            }
        });
    }else{
        loading_save_info.classList.add('hidden')
        var SaveButton = document.getElementById('save_info')
        SaveButton.classList.remove('hidden')
    }
    
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
            loading_save_second.classList.add('hidden')
            var second_box_edit_btn = document.getElementById('second-box-edit')
            second_box_edit_btn.classList.remove('hidden')
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