const Edit_context_btn = document.getElementById('Edit_context_btn')
const Save_context_btn = document.getElementById('Save_context_btn')
const Cancel_context_btn = document.getElementById('Cancel_context_btn')
const save_context_div = document.getElementById('save_context_div')
const edit_context_div = document.getElementById('edit_context_div')
const loading_save_context = document.getElementById('loading_save_context')
const save_context = document.getElementById('save_context')
function _Edit_context(DOM){
    if($('#dropdown_btn2').attr("aria-expanded")=='false'){
        $('#dropdown_btn2').click()
    }
    Edit_context_btn.classList.add('hidden')
    Save_context_btn.classList.remove('hidden')
    Cancel_context_btn.classList.remove('hidden')
    save_context_div.classList.add('hidden')
    edit_context_div.classList.remove('hidden')
    return false
}
function _Save_context(DOM){
    Save_context_btn.classList.add('hidden')
    Cancel_context_btn.classList.add('hidden')
    loading_save_context.classList.remove('hidden')
    save_context_django()
    return false
}
function _Cancel_context(DOM){
    Save_context_btn.classList.add('hidden')
    Cancel_context_btn.classList.add('hidden')
    Edit_context_btn.classList.remove('hidden')
    edit_context_div.classList.add('hidden')
    save_context_div.classList.remove('hidden')
    // get ckeditor context orignal value
    if (save_context.classList.contains('save_context_has_text')){
        CKEDITOR.instances['context'].setData(save_context.innerHTML)
    }else{
        CKEDITOR.instances['context'].setData('')
    }
    return false
}
function save_context_django(){
    var context_data = CKEDITOR.instances['context'].getData().replaceAll(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['context'] = context_data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_context_data'] = 'save'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            save_context_mode()
            loading_save_context.classList.add('hidden')
            createToast(true, 'Testcase 描述 儲存成功')
        },
        error: function(data) {
            loading_save_context.classList.add('hidden')
            Save_context_btn.classList.remove('hidden')
            Cancel_context_btn.classList.remove('hidden')
            console.log("error");
        }
    });
}
function save_context_mode(){
    Edit_context_btn.classList.remove('hidden')
    var context_data = CKEDITOR.instances['context'].getData().replaceAll(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
    if(context_data == ''){
        save_context.classList.add('save_context_no_text')
        save_context.classList.remove('save_context_has_text')
        save_context.innerHTML = `&nbsp&nbsp&nbsp&nbsp&nbspNo description`
    }else{
        save_context.classList.remove('save_context_no_text')
        save_context.classList.add('save_context_has_text')
        save_context.innerHTML = `${context_data}<br>`
    }
    save_context_div.classList.remove('hidden')
    edit_context_div.classList.add('hidden')
}