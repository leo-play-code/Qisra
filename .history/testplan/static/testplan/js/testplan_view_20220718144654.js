var dropdown_btn = document.getElementById('dropdown_btn');
dropdown_btn.addEventListener('click',function(e){
    if (dropdown_btn.style.transform == "rotate(-90deg)"){
        dropdown_btn.style.transform = "rotate(0deg)";
    }else{
        dropdown_btn.style.transform = "rotate(-90deg)";
    }
})
var dropdown_btn2 = document.getElementById('dropdown_btn2');
dropdown_btn2.addEventListener('click',function(e){
    if (dropdown_btn2.style.transform == "rotate(-90deg)"){
        dropdown_btn2.style.transform = "rotate(0deg)";
    }else{
        dropdown_btn2.style.transform = "rotate(-90deg)";
    }
})
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
CKEDITOR.editorConfig = function( config ) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold','Italic','Underline','Strike','-'],
        ['Image'],
        ['Styles','Format','Font','FontSize'],

        ['TextColor','BGColor'],
        ['Undo','Redo'],
    ];
    config.width = 670;
    config.height = 180;
};

// EDIT ALL
var cancel_btn = document.getElementById('cancel_edit')
var dropdown_three_dot = document.getElementById('dropdown_three_dot')
var edit_all_btn = document.getElementById('edit_all')
var save_info_div = document.querySelectorAll('.info_savemode')
var edit_info_div = document.querySelectorAll('.info_editmode')
cancel_btn.addEventListener('click',function(e){
    e.preventDefault()
    var Edit_next_level_btn = document.getElementById('edit_next_level')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var Save_next_level_btn = document.getElementById('save_next_level')
    dropdown_three_dot.classList.remove('hidden')
    try{
        Edit_next_level_btn.classList.add("hidden");
    }catch{
        Save_next_level_btn.classList.add('hidden')
    }
    try{
        Edit_info_btn.classList.add('hidden');
    }catch{
        Save_info_btn.classList.add('hidden')
    }
    //save mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','hidden')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','')
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element =>{
        element.classList.add('hidden')
    })
    cancel_btn.classList.add('hidden')
})
edit_all_btn.addEventListener('click',function(e){
    e.preventDefault()
    var Edit_next_level_btn = document.getElementById('edit_next_level')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var Save_next_level_btn = document.getElementById('save_next_level')
    dropdown_three_dot.classList.add('hidden')
    try{
        Edit_next_level_btn.classList.remove("hidden");
    }catch{
        Save_next_level_btn.classList.remove('hidden')
        var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
        teststep_tr_list_edit.setAttribute('class','')
        var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
        teststep_tr_list_save.setAttribute('class','hidden')
    }
    try{
        Edit_info_btn.classList.remove('hidden');
    }catch{ 
        Save_info_btn.classList.remove('hidden')
        save_info_div.forEach(element => {
            element.classList.remove('hidden')
        });
        edit_info_div.forEach(element =>{
            element.classList.add('hidden')
        })
    }
    cancel_btn.classList.remove('hidden')
})

var Edit_info_btn = document.getElementById('edit_info')
Edit_info_btn.addEventListener('click',function(e){
    e.preventDefault()
    Edit_info_mode()
})
const edit_save_div_info = document.getElementById('edit-save-div-info')
function Edit_info_mode(){
    edit_save_div_info.innerHTML = `
        <button type="submit" class="btn btn-success" id="save_info" name="save_info">Save</button>
    `
    var SaveButton = document.getElementById('save_info')
    SaveButton.addEventListener('click',function(e){
        e.preventDefault()
        save_info_django()
    })
    save_info_div.forEach(element => {
        element.classList.add('hidden')
    });
    edit_info_div.forEach(element =>{
        element.classList.remove('hidden')
    })
}
var testplan_title = document.getElementById('testplan_title')
const save_name_p = document.getElementById('save_name')
const save_context_div = document.getElementById('save_context')
const save_tag_p = document.getElementById('save_tag')
const save_stage_p = document.getElementById('save_stage')
const save_assign_p = document.getElementById('save_assign')
const save_start_date_p = document.getElementById('save_start_date')
const save_end_date_p = document.getElementById('save_end_date')
const save_activate_p = document.getElementById('save_activate')
function Save_info_mode(){
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-danger" id="edit_info" name="edit_info" value="edit_info">Edit</button>
    `
    var EditButton = document.getElementById('edit_info')
    EditButton.addEventListener('click',function(e){
        e.preventDefault()
        Edit_info_mode()
    })
    var name_data = $('#id_testplanname').val()
    var context_data = CKEDITOR.instances['context'].getData()
    var tag_list = $('#id_tag').val()
    var stage = $('#edit_stage_select').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    var activate = document.getElementById('edit_activate_input').checked
    testplan_title.innerHTML = `${name_data}`
    save_name_p.innerHTML = `名稱: ${name_data}`
    save_context_div.innerHTML = `${context_data}<br>`
    save_tag_p.innerHTML = `標籤:`
    for (item in tag_list){
        save_tag_p.innerHTML+=` ${tag_list[item]}`
    }
    save_stage_p.innerHTML = `Stage: ${stage}`
    save_start_date_p.innerHTML = `開始日: ${start_date}`
    if (assign != 'None'){  
        save_assign_p.innerHTML = `負責人: ${assign}`
    }else{
        save_assign_p.innerHTML = `負責人: `
    }
    save_end_date_p.innerHTML = `結束日: ${end_date}`
    if (activate == true){
        save_activate_p.innerHTML = `Activate True`
    }else{
        save_activate_p.innerHTML = `Activate False`
    }
    save_info_div.forEach(element => {
        element.classList.remove('hidden')
    });
    edit_info_div.forEach(element =>{
        element.classList.add('hidden')
    })
    var clone_div = document.getElementById('clone_div')
    if (testplan_title.innerHTML.includes('-clone')){
        clone_div.classList.add('hidden')
    }else{
        clone_div.classList.remove('hidden')
    }
}

function save_info_django(){
    console.log('save info django')
    var csrftoken = getCookie('csrftoken');
    var name_data = $('#id_testplanname').val()
    var context_data = CKEDITOR.instances['context'].getData()
    var tag_list = $('#id_tag').val()
    var stage = $('#edit_stage_select').val()
    var assign = $('#edit_assign_select').val()
    var start_date = $('#edit_start_date_input').val()
    var end_date = $('#edit_end_date_input').val()
    var activate = document.getElementById('edit_activate_input').checked
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_info'] = 'save_info';
    data_dict['name'] = name_data
    data_dict['tag_list[]'] = tag_list
    data_dict['context'] = context_data
    data_dict['stage'] = stage
    data_dict['assign'] = assign
    data_dict['start_date'] = start_date
    data_dict['end_date'] = end_date
    data_dict['activate'] = activate
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            Save_info_mode()
        },
        error: function(data) {
            console.log("error");
            alert('Testplan name has existed')
        }
    });
}

var Edit_next_level_btn = document.getElementById('edit_next_level')

var edit_table_div = document.getElementById('edit-save-div-next-level')
Edit_next_level_btn.addEventListener('click',function(e){
    e.preventDefault()
    console.log('edit down')
    _edit_table()
})
var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
function _edit_table(){
    edit_table_div.innerHTML =`
        <button type="submit" class="btn btn-success" id="save_next_level" name="save_next_level">Save</button>
    `
    var Save_next_level_btn = document.getElementById('save_next_level')
    Save_next_level_btn.addEventListener('click',function(e){
        e.preventDefault()
        _save_table()
    })
    teststep_tr_list_edit.classList.remove('hidden')
    teststep_tr_list_save.classList.add('hidden')

}

function _save_table(){
    console.log('save down')
    edit_table_div.innerHTML =`
    <button type="submit" class="btn btn-danger" id="edit_next_level" name="edit_next_level">Edit</button>
    `
    var Edit_next_level_btn = document.getElementById('edit_next_level')
    Edit_next_level_btn.addEventListener('click',function(e){
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
fullscreen_btn.addEventListener('click',function(e){
    e.preventDefault()
    fullscreen_btn.classList.add('hidden')
    smallscreen_btn.classList.remove('hidden')
    teststepview_table.forEach(element=>{
        element.classList.remove('teststepview_table','tableFixHead')
    })
    
})
smallscreen_btn.addEventListener('click',function(e){
    e.preventDefault()
    fullscreen_btn.classList.remove('hidden')
    smallscreen_btn.classList.add('hidden')
    teststepview_table.forEach(element=>{
        element.classList.add('teststepview_table','tableFixHead')
    })
})



