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



// info
var save_info_div = document.getElementById('info_savemode')
var edit_info_div = document.getElementById('info_editmode')
const loading_save_info = document.getElementById('loading_save_info')
const error_name_msg = document.getElementById('error-name')
const save_name_p = document.getElementById('save_name')
const save_tag_p = document.getElementById('save_tag')
const testcase_title = document.getElementById('testcase_title')
const testcase_name_DOM = document.getElementById('save_name')
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
    save_info_div.setAttribute('class','hidden')
    edit_info_div.setAttribute('class','')
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
    var testcase_name = testcase_name_DOM.innerHTML.replaceAll('名稱: ','')
    $('#id_testcasename').val(testcase_name)
    // reset tag
    var temp_tag_list = []
    var tag_list = document.getElementById('save_tag').querySelectorAll('span')
    tag_list.forEach(element=>{
        temp_tag_list.push(element.innerHTML)
    })
    $('#id_tag').val(temp_tag_list)
    $('#id_tag').selectpicker("refresh");
    // reset table
    Cancel_info_btn.classList.add('hidden')
    Save_info_btn.classList.add('hidden')
    Edit_info_btn.classList.remove('hidden')
    error_name_msg.classList.add('hidden')
    save_info_div.setAttribute('class','')
    edit_info_div.setAttribute('class','hidden')
    return false
}
function save_info_django(){
    error_name_msg.classList.add('hidden')
    var name_data = $('#id_testcasename').val()
    if (name_data.replaceAll(' ','')== ''){
        error_name_msg.classList.remove('hidden')
        loading_save_info.classList.add('hidden')
        Save_info_btn.classList.remove('hidden')
        Cancel_info_btn.classList.remove('hidden')
    }else{
        var csrftoken = getCookie('csrftoken');
        data_dict = {}
        var tag_list = $('#id_tag').val()
        // get testcase tag_list data
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        data_dict['save_info'] = 'save_info';
        data_dict['testcasename'] = name_data
        data_dict['tag_list[]'] = tag_list
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success: function () {
                console.log("success");
                Save_info_mode()
                loading_save_info.classList.add('hidden')
                Edit_info_btn.classList.remove('hidden')
                createToast(true, 'Testcase Information 儲存成功')
            },
            error: function (data) {
                loading_save_info.classList.add('hidden')
                Save_info_btn.classList.remove('hidden')
                Cancel_info_btn.classList.remove('hidden')
                console.log("error");
                createToast(false, 'Testcase 名稱已經存在')
            }
        });
    }
}
function Save_info_mode(){
    var name_data = $('#id_testcasename').val()
    var tag_list = $('#id_tag').val()
    testcase_title.innerHTML = `${name_data}`
    save_name_p.innerHTML = `名稱: ${name_data}`
    save_tag_p.innerHTML = `標籤:`
    if (tag_list == null){
        save_tag_p.innerHTML+=` <span>無</span>`
    }else{
        for (item in tag_list){
            save_tag_p.innerHTML+=` <span style="color:#5DADE2;">${tag_list[item]}</span>`
        }
    }
    save_info_div.setAttribute('class','')
    edit_info_div.setAttribute('class','hidden')
    var clone_div = document.getElementById('clone_div')
    if (testcase_title.innerHTML.includes('-clone')){
        clone_div.classList.add('hidden')
    }else{
        clone_div.classList.remove('hidden')
    }
}