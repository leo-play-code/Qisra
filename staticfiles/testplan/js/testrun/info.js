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
CKEDITOR.editorConfig = function( config ) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold','Italic','Underline','Strike','-'],
        ['Image'],
        ['Styles','Format','Font','FontSize'],

        ['TextColor','BGColor'],
        ['Undo','Redo']
    ];
    config.height = 180;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;
};
// info
var save_info_div = document.querySelectorAll('.info_savemode')
var edit_info_div = document.querySelectorAll('.info_editmode')
const loading_save_info = document.getElementById('loading_save_info')
const save_name_DOM = document.getElementById('save_name')
const save_assign_p = document.getElementById('save_assign')
// info-btn
const Edit_info_btn = document.getElementById('Edit_info_btn')
const Save_info_btn = document.getElementById('Save_info_btn')
const Cancel_info_btn = document.getElementById('Cancel_info_btn')
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
    // reset assign 未完成
    var save_assign_list = []
    var assign_list = document.getElementById('save_assign').innerHTML
    assign_list = assign_list.replaceAll('負責人:','').replaceAll(' ','').split('\n')
    for (num in assign_list){
        temp_assign = assign_list[num]
        if (temp_assign != ''){
            save_assign_list.push(temp_assign)
        }
    }
    $('#edit_assign_select').val(save_assign_list)
    $('#edit_assign_select').selectpicker("refresh");
    // reset table
    Cancel_info_btn.classList.add('hidden')
    Save_info_btn.classList.add('hidden')
    Edit_info_btn.classList.remove('hidden')
    // save_info_django()
    save_info_div.forEach(element=>{
        element.classList.remove('hidden')
    })
    edit_info_div.forEach(element=>{
        element.classList.add('hidden')
    })
    return false
}


function save_info_django(){
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    // var tag_list = $('#id_tag').val()
    var assign = $('#edit_assign_select').val()
    // get testcase tag_list data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_info'] = 'save_info';
    // data_dict['testcasename'] = name_data
    // data_dict['tag_list[]'] = tag_list
    data_dict['assign[]'] = assign
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function () {
            console.log("success");
            Save_info_mode()
            loading_save_info.classList.add('hidden')
            Edit_info_btn.classList.remove('hidden')
            createToast(true, 'Testrun information 儲存成功')
        },
        error: function (data) {
            loading_save_info.classList.add('hidden')
            Save_info_btn.classList.remove('hidden')
            Cancel_info_btn.classList.remove('hidden')
            console.log("error");
            createToast(false, 'Testrun information 儲存失敗')
        }
    });
}

function Save_info_mode(){
    var assign = $('#edit_assign_select').val()
    save_assign_p.innerHTML = `負責人:`
    if (assign == null){  
        save_assign_p.innerHTML += ` 未指派`
    }else{
        for (item in assign){
            if (assign[item] != "None"){
                save_assign_p.innerHTML += ` ${assign[item]}`
            }
        }
    }
    save_info_div.forEach(element=>{
        element.classList.remove('hidden')
    })
    edit_info_div.forEach(element=>{
        element.classList.add('hidden')
    })

}