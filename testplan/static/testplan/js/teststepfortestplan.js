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
var csrftoken = getCookie('csrftoken');
const edit_save_div = document.getElementById('edit-save-div')
//Edit button
var EditButton = document.getElementById('edit')
EditButton.addEventListener('click',function(e){
    e.preventDefault()
    console.log('edit button')
    EditMode()
})
function EditMode(){  
    // create save button
    edit_save_div.innerHTML = `
    <button type="submit" class="btn btn-success" id="save">Save</button>
    `
    var save_btn = document.getElementById('save')
    save_btn.addEventListener('click',function(e){
        e.preventDefault()
        console.log('save_btn')
        sendform()
        
        
    })
    // teststep edit-mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','teststep_tr_list_editmode')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','hidden')
}
function sendform(){
    var csrftoken = getCookie('csrftoken');
    var data_dict = {}
    for(var instanceName in CKEDITOR.instances){
        CKEDITOR.instances[instanceName].updateElement();
    }
    var data = $('form').serializeArray()
    for(num in data){
        data_dict[data[num].name]=data[num].value
    }
    data_dict['csrfmiddlewaretoken'] = csrftoken
    
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            window.location = '';
        },
        error: function(data) {
            console.log("error");
        }
    });

}