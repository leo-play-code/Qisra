// ckeditor config
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

var save_info_div = document.querySelectorAll('.info_savemode')
var edit_info_div = document.querySelectorAll('.info_editmode')
var error_name_msg = document.getElementById('error-name')
var error_time_msg = document.getElementById('invalid-project-time')
var project_title = document.getElementById('project_title')
const save_name_p = document.getElementById('save_name')
const save_tag_p = document.getElementById('save_tag')
const save_assign_p = document.getElementById('save_assign')
const save_client_p = document.getElementById('save_client')
const save_start_date_p = document.getElementById('save_start_date')
const save_end_date_p = document.getElementById('save_end_date')
const save_name_DOM = document.getElementById('save_name')
const edit_start_date_input = document.getElementById('edit_start_date_input')
const edit_end_date_input = document.getElementById('edit_end_date_input')
function _Edit_info(DOM){
    if($('#dropdown_btn1').attr("aria-expanded")=='false'){
        $('#dropdown_btn1').click()
    }
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
    Save_info_btn.classList.add('hidden')
    Cancel_info_btn.classList.add('hidden')
    loading_save_info.classList.remove('hidden')
    save_info_django()
    return false
}

function _Cancel_info(DOM){
    // reset testcase name
    var save_name_data = save_name_DOM.innerHTML.replaceAll('名稱: ','')
    $('#id_project_name').val(save_name_data)
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
    // reset client
    client_data = document.getElementById('save_client').innerHTML.replaceAll('客戶: ','')
    console.log(client_data)
    if (client_data == '尚無客戶選擇'){
        console.log('None')
        $('#id_client').val('None')
    }else{
        $('#id_client').val(client_data)
    }
    $('#id_client').selectpicker("refresh");
    // reset assign
    assign_data = document.getElementById('save_assign').innerHTML.replaceAll('負責人: ','')
    if (assign_data == '未指派'){
        $('#edit_assign_select').val('None')
    }else{
        $('#edit_assign_select').val(assign_data)
    }
    
    $('#edit_assign_select').selectpicker("refresh");
    // reset table
    Cancel_info_btn.classList.add('hidden')
    Save_info_btn.classList.add('hidden')
    Edit_info_btn.classList.remove('hidden')

    error_time_msg.classList.add('hidden')
    error_name_msg.classList.add('hidden')

    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element => {
        element.classList.add('hidden')
    })
    return false
}


function save_info_django() {    
    bool_ajax = true
    var name_data = $('#id_project_name').val()
    var csrftoken = getCookie('csrftoken');
    var tag_list = $('#id_tag').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    var client = $('#id_client').val()
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_info'] = 'save_info';
    data_dict['name'] = name_data
    data_dict['tag_list[]'] = tag_list
    data_dict['assign'] = assign
    data_dict['client'] = client
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
                createToast(true, 'Project Information 儲存成功')
            },
            error: function (data) {
                console.log("error");
                loading_save_info.classList.add('hidden')
                Save_info_btn.classList.remove('hidden')
                createToast(false, '此Project名稱已被使用')
            }
        });
    }else{
        loading_save_info.classList.add('hidden')
        Save_info_btn.classList.remove('hidden')
        Cancel_info_btn.classList.remove('hidden')
    }
}
function Save_info_mode() {
    Edit_info_btn.classList.remove('hidden')
    var name_data = $('#id_project_name').val()
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
    var tag_list = $('#id_tag').val()
    var client = $('#id_client').val()
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

    if (client != 'None'){
        save_client_p.innerHTML = `客戶: ${client}`
    }else {
        save_client_p.innerHTML = `客戶: 尚無客戶選擇`
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