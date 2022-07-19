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

const edit_save_div_teststep = document.getElementById('edit-save-div-teststep')
//Edit button
var EditButton = document.getElementById('edit_teststep')
EditButton.addEventListener('click',function(e){
    e.preventDefault()
    EditMode()
    
})
function EditMode(){  
    edit_save_div_teststep.innerHTML = `
        <button type="submit" class="btn btn-success" id="save_teststep" name="save_teststep">Save</button>
    `
    var SaveButton = document.getElementById('save_teststep')
    SaveButton.addEventListener('click',function(e){
        e.preventDefault()
        save_teststep_todjango()
    })
    // change orignal ckeditor to same ckeditor
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    var teststep_length = document.getElementsByClassName('teststep_tr_list_sample').length
    next_teststep_num = teststep_length
    try{
        for(i=1;i<=next_teststep_num;i++){
            // setup number
            String_i = i.toString()
            String_i_m1 = (i-1).toString()
            // inital tr-list
            teststep_tr_list_exists = document.getElementById('teststep_tr_list_exists-'+String_i)
            teststep_tr_list_exists_node = document.getElementById('teststep_tr_list_exists-'+String_i).cloneNode(true)
            // condition
            teststep_tr_list_exists_node.querySelector('#edit_condition > .django-ckeditor-widget >#id_teststep_set-'+String_i_m1+'-condition').setAttribute('id','edit_condition-'+String_i)
            delete_remark_main = teststep_tr_list_exists_node.querySelector('#edit_condition > .django-ckeditor-widget')
            temp = teststep_tr_list_exists_node.querySelector('#edit_condition > .django-ckeditor-widget >#cke_id_teststep_set-'+String_i_m1+'-condition')
            delete_remark_main.removeChild(temp)
            
            teststep_tr_list_edit.appendChild(teststep_tr_list_exists_node)
            CKEDITOR.replace('edit_condition-'+String_i,
            {removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({color: 'black', 'font-size': '18px', 'font-family': 'Verdana'})
                }
            }})
            // remark 
            teststep_tr_list_exists_node.querySelector('#edit_remark > .django-ckeditor-widget >#id_teststep_set-'+String_i_m1+'-remark').setAttribute('id','edit_remark-'+String_i)
            delete_remark_main = teststep_tr_list_exists_node.querySelector('#edit_remark > .django-ckeditor-widget')
            temp = teststep_tr_list_exists_node.querySelector('#edit_remark > .django-ckeditor-widget >#cke_id_teststep_set-'+String_i_m1+'-remark')
            // create delete button
            teststep_tr_list_exists_node.querySelector('#edit_number').innerHTML+=
            `
            <button type="submit" class="btn add-teststep-up"><img src='/static/images/arrow-90deg-up.svg'></button>
            <br>
            <br>
            <br>
            <br><button type="submit" style="color:red" class="btn delete-teststep"><img src='/static/images/trash.svg'></button>
            <br>
            <br>
            <br>
            <br><button type="submit" class="btn add-teststep-down"><img src='/static/images/arrow-90deg-down.svg'></button>
            `
            delete_remark_main.removeChild(temp)
            teststep_tr_list_edit.appendChild(teststep_tr_list_exists_node)
            CKEDITOR.replace('edit_remark-'+String_i,
            {removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({color: 'black', 'font-size': '18px', 'font-family': 'Verdana'})
                }
            }})
            teststep_tr_list_edit.removeChild(teststep_tr_list_exists)
        }
        for(i=0;i<next_teststep_num;i++){
            var delete_teststep_button = document.getElementsByClassName('delete-teststep')[i]
            delete_teststep_button.addEventListener('click',(function(item){
                return function(e){
                    e.preventDefault()
                    delete_teststep(item)
                }
            })(i))
        }
        for(i=0;i<next_teststep_num;i++){
            var addteststepup = document.getElementsByClassName('add-teststep-up')[i]
            addteststepup.addEventListener('click',(function(item){
                return function(e){
                    e.preventDefault()
                    add_up(item)
                }
            })(i))
        }
        for(i=0;i<next_teststep_num;i++){
            var addteststepdwown = document.getElementsByClassName('add-teststep-down')[i]
            addteststepdwown.addEventListener('click',(function(item){
                return function(e){
                    e.preventDefault()
                    add_down(item)
                }
            })(i))
        }
    }catch (e) {
    }
    // teststep edit-mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','hidden')
}
function SaveMode(){
    edit_save_div_teststep.innerHTML = `
        <button type="submit" class="btn btn-danger" id="edit_teststep" name="edit_teststep" value="edit_teststep">Edit</button>
    `
    var EditButton = document.getElementById('edit_teststep')
    EditButton.addEventListener('click',function(e){
        e.preventDefault()
        EditMode()
    })
    // get data from editmode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    var teststep_length = document.getElementsByClassName('teststep_tr_list_sample').length
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    var teststep_tr_list_sample = document.querySelectorAll('.teststep_tr_list_sample')
    teststep_tr_list_save.innerHTML=``
    next_teststep_num = teststep_length
    var num_count = 0
    teststep_tr_list_sample.forEach(element => {
        i = Number((element.id).replace("teststep_tr_list_exists-", ""));
        var description_data = document.getElementById('id_teststep_set-'+(i-1).toString()+'-description').value
        var condition_data = CKEDITOR.instances['edit_condition-'+i.toString()].getData()
        var remark_data = CKEDITOR.instances['edit_remark-'+i.toString()].getData()
        if(description_data.replace('<br />','').replace('<p>&nbsp;</p>','')!=''){
            teststep_tr_list_save.innerHTML+=
            `<tr>
                <td>${num_count+1}</td>
                <td>${description_data.replace('<br />','').replace('<p>&nbsp;</p>','')}</td>
                <td><p></p>${condition_data.replace('<br />','').replace('<p>&nbsp;</p>','')}</td>
                <td><p></p>${remark_data.replace('<br />','').replace('<p>&nbsp;</p>','')}</td>
            </tr>
            `
        }
        num_count+=1
    
    });
    
    //save mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','hidden')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','')
}

//  add delete 
function delete_teststep(num){
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    var delete_teststep_target = teststep_tr_list_edit.querySelector('#teststep_tr_list_exists-'+(num+1).toString())
    teststep_tr_list_edit.removeChild(delete_teststep_target)
}
function add_up(num){
    var orignal_teststep = document.getElementById('teststep_tr_list_exists-'+(num+1).toString())
    AddTeststep()
    var length_teststep_list = document.getElementsByClassName('teststep_tr_list_sample').length-1
    var new_teststep =document.getElementsByClassName('teststep_tr_list_sample')[length_teststep_list]
    var parentDiv =new_teststep.parentNode;
    parentDiv.insertBefore(new_teststep,orignal_teststep)    
    new_teststep.scrollIntoView({block: "center"});
}
function add_down(num){
    var orignal_teststep = document.getElementById('teststep_tr_list_exists-'+(num+1).toString())
    AddTeststep()
    var length_teststep_list = document.getElementsByClassName('teststep_tr_list_sample').length-1
    var new_teststep =document.getElementsByClassName('teststep_tr_list_sample')[length_teststep_list]
    insertAfter(new_teststep,orignal_teststep)    
    new_teststep.scrollIntoView({block: "center"});
}
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function AddTeststep(){
    var copy_teststep_tr_list = document.getElementById('teststep_tr_list').cloneNode(true)
    copy_teststep_tr_list.setAttribute('class','teststep_tr_list_sample')
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    var teststep_length = document.getElementsByClassName('teststep_tr_list_sample').length
    next_teststep_num = teststep_length
    next_teststep_id_num = (next_teststep_num+1).toString()
    copy_teststep_tr_list.setAttribute('id','teststep_tr_list_exists-'+next_teststep_id_num)
    // remark
    next_teststep_id_remark = 'edit_remark-'+next_teststep_id_num
    copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget').setAttribute('data-field-id',next_teststep_id_remark)
    copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #id_remark').setAttribute('id',next_teststep_id_remark)
    temp = copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #cke_id_remark')
    copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget').removeChild(temp)
    //condition
    next_teststep_id_condition = 'edit_condition-'+next_teststep_id_num
    copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget').setAttribute('data-field-id',next_teststep_id_condition)
    copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #id_condition').setAttribute('id',next_teststep_id_condition)
    temp = copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #cke_id_condition')
    copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget').removeChild(temp)
    copy_teststep_tr_list.querySelector('#number').setAttribute('id','edit_number')
    copy_teststep_tr_list.querySelector('#description').setAttribute('id','edit_description')
    copy_teststep_tr_list.querySelector('#edit_description > #id_description').setAttribute('id','id_teststep_set-'+next_teststep_num.toString()+'-description')
    copy_teststep_tr_list.querySelector('#condition').setAttribute('id','edit_condition')
    copy_teststep_tr_list.querySelector('#remark').setAttribute('id','edit_remark')
    copy_teststep_tr_list.querySelector('#edit_number').innerHTML+=
    `
    <button type="submit" class="btn add-teststep-up"><img src='/static/images/arrow-90deg-up.svg'></button>
    <br>
    <br>
    <br>
    <br><button type="submit" style="color:red" class="btn delete-teststep"><img src='/static/images/trash.svg'></button>
    <br>
    <br>
    <br>
    <br><button type="submit" class="btn add-teststep-down"><img src='/static/images/arrow-90deg-down.svg'></button>
    `
    teststep_tr_list_edit.appendChild(copy_teststep_tr_list)
    var delete_teststep_button = document.getElementsByClassName('delete-teststep')[next_teststep_num]
    delete_teststep_button.addEventListener('click',(function(item){
        return function(e){
            e.preventDefault()
            delete_teststep(item)
        }
    })(next_teststep_num))
    var addteststepup = document.getElementsByClassName('add-teststep-up')[next_teststep_num]
    addteststepup.addEventListener('click',(function(item){
        return function(e){
            e.preventDefault()
            add_up(item)
        }
    })(next_teststep_num))
    var addteststepdwown = document.getElementsByClassName('add-teststep-down')[next_teststep_num]
    addteststepdwown.addEventListener('click',(function(item){
        return function(e){
            e.preventDefault()
            add_down(item)
        }
    })(next_teststep_num))
    CKEDITOR.replace(next_teststep_id_remark,{removePlugins: "exportpdf" ,on: {
        instanceReady: function (evt) {
            evt.editor.document.getBody().setStyles({color: 'black', 'font-size': '18px', 'font-family': 'Verdana'})
        }
    }})
    CKEDITOR.replace(next_teststep_id_condition,{removePlugins: "exportpdf",on: {
        instanceReady: function (evt) {
            evt.editor.document.getBody().setStyles({color: 'black', 'font-size': '18px', 'font-family': 'Verdana'})
        }
    }})
    copy_teststep_tr_list.scrollIntoView({block: "center"});
}
function save_teststep_todjango(){
    var csrftoken = getCookie('csrftoken');
    // get teststep data
    var teststep_length = document.getElementsByClassName('teststep_tr_list_sample').length
    next_teststep_num = teststep_length
    var data_dict = {}
    // get data from editmode
    var teststep_length = document.getElementsByClassName('teststep_tr_list_sample').length
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    var teststep_tr_list_sample = document.querySelectorAll('.teststep_tr_list_sample')
    teststep_tr_list_save.innerHTML=``
    next_teststep_num = teststep_length
    var num_count = 0
    teststep_tr_list_sample.forEach(element => {
        i = Number((element.id).replace("teststep_tr_list_exists-", ""));
        var description_data = document.getElementById('id_teststep_set-'+(i-1).toString()+'-description').value
        var condition_data = CKEDITOR.instances['edit_condition-'+i.toString()].getData()
        var remark_data = CKEDITOR.instances['edit_remark-'+i.toString()].getData()
        if(description_data.replace('<br />','').replace('<p>&nbsp;</p>','')!=''){
            console.log('condition=',condition_data)
            console.log('remark',remark_data)
            data_dict['id_teststep_set-'+(num_count).toString()+'-description'] = description_data
            data_dict['id_teststep_set-'+(num_count).toString()+'-condition'] = condition_data.replace('<p>&nbsp;</p>','').replace(/\n/g,'</br>')
            data_dict['id_teststep_set-'+(num_count).toString()+'-remark'] = remark_data.replace('<p>&nbsp;</p>','').replace(/\n/g,'</br>')
        }
        num_count+=1
    });
    // get testcase tag_list data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_teststep'] = 'save_teststep';
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            SaveMode()
        },
        error: function(data) {
            console.log("error");
        }
    });
}


const edit_save_div_info = document.getElementById('edit-save-div-info')
var Edit_info_btn = document.getElementById('edit_info')
Edit_info_btn.addEventListener('click',function(e){
    e.preventDefault()
    Edit_info_mode()
})
var save_info_div = document.getElementById('info_savemode')
var edit_info_div = document.getElementById('info_editmode')
function Edit_info_mode(){
    edit_save_div_info.innerHTML = `
        <button type="submit" class="btn btn-success" id="save_info" name="save_info">Save</button>
    `
    var SaveButton = document.getElementById('save_info')
    SaveButton.addEventListener('click',function(e){
        e.preventDefault()
        save_info_django()
    })
    save_info_div.setAttribute('class','hidden')
    edit_info_div.setAttribute('class','')
}
const save_name_p = document.getElementById('save_name')
const save_context_div = document.getElementById('save_context')
const save_tag_p = document.getElementById('save_tag')
const testcase_title = document.getElementById('testcase_title')
function Save_info_mode(){
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-danger" id="edit_info" name="edit_info" value="edit_info">Edit</button>
    `
    var EditButton = document.getElementById('edit_info')
    EditButton.addEventListener('click',function(e){
        e.preventDefault()
        Edit_info_mode()
    })
    var name_data = $('#id_testcasename').val()
    var context_data = CKEDITOR.instances['context'].getData()
    var tag_list = $('#id_tag').val()
    testcase_title.innerHTML = `${name_data}`
    save_name_p.innerHTML = `名稱: ${name_data}`
    save_context_div.innerHTML = `${context_data}<br>`
    save_tag_p.innerHTML = `標籤:`
    for (item in tag_list){
        save_tag_p.innerHTML+=` ${tag_list[item]}`
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

function save_info_django(){
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    var name_data = $('#id_testcasename').val()
    var context_data = CKEDITOR.instances['context'].getData()
    var tag_list = $('#id_tag').val()
    // get testcase tag_list data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_info'] = 'save_info';
    data_dict['testcasename'] = name_data
    data_dict['tag_list[]'] = tag_list
    data_dict['context'] = context_data
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
            alert('Testcase name has existed')
        }
    });
}
var cancel_btn = document.getElementById('cancel_edit')
var dropdown_three_dot = document.getElementById('dropdown_three_dot')
cancel_btn.addEventListener('click',function(e){
    e.preventDefault()
    var EditButton = document.getElementById('edit_teststep')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var SaveButton = document.getElementById('save_teststep')
    dropdown_three_dot.classList.remove('hidden')
    try{
        EditButton.classList.add("hidden");
    }catch{
        SaveButton.classList.add('hidden')
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
    save_info_div.setAttribute('class','')
    edit_info_div.setAttribute('class','hidden')
    cancel_btn.classList.add('hidden')
})
var edit_all_btn = document.getElementById('edit_all')
edit_all_btn.addEventListener('click',function(e){
    e.preventDefault()
    var EditButton = document.getElementById('edit_teststep')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var SaveButton = document.getElementById('save_teststep')
    dropdown_three_dot.classList.add('hidden')
    try{
        EditButton.classList.remove("hidden");
    }catch{
        SaveButton.classList.remove('hidden')
        var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
        teststep_tr_list_edit.setAttribute('class','')
        var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
        teststep_tr_list_save.setAttribute('class','hidden')
    }
    try{
        Edit_info_btn.classList.remove('hidden');
    }catch{
        Save_info_btn.classList.remove('hidden')
        save_info_div.setAttribute('class','hidden')
        edit_info_div.setAttribute('class','')
    }
    cancel_btn.classList.remove('hidden')
})




var clone_div = document.getElementById('clone_div')
if (testcase_title.innerHTML.includes('-clone')){
    clone_div.classList.add('hidden')
}else{
    clone_div.classList.remove('hidden')
}


var add_tag_btn = document.getElementById('addnewtag')
add_tag_btn.addEventListener('click',function(e){
    e.preventDefault()
    add_tag_django()
})

function add_tag_django(){
    var new_tag_name = document.getElementById('new_tag_name').value
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['add_tag'] = 'add_tag';
    data_dict['tag_name'] = new_tag_name;
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            finish_add_tag(new_tag_name)
        },
        error: function(data) {
            console.log("error");
            alert('Tag name has existed')
        }
    });
}


function finish_add_tag(new_tag_name){
    $('#tag_toggle').modal('hide');
    // reset selectpicker
    var tag_list = $('#id_tag').val()
    var new_tag_list = []
    for (item in tag_list){
        new_tag_list.push(tag_list[item])
    }
    $("#id_tag").append('<option value="'+new_tag_name+'">'+new_tag_name+'</option>');
    new_tag_list.push(new_tag_name)
    $("#id_tag").selectpicker('val', new_tag_list);
    $("#id_tag").selectpicker("refresh");

}

var teststepview_table = document.getElementById('teststepview_table')
var fullscreen_btn = document.getElementById('fullscreen')
var smallscreen_btn = document.getElementById('smallscreen')
fullscreen_btn.addEventListener('click',function(e){
    e.preventDefault()
    fullscreen_btn.classList.add('hidden')
    smallscreen_btn.classList.remove('hidden')
    teststepview_table.classList.remove('teststepview_table','tableFixHead')
})
smallscreen_btn.addEventListener('click',function(e){
    e.preventDefault()
    fullscreen_btn.classList.remove('hidden')
    smallscreen_btn.classList.add('hidden')
    teststepview_table.classList.add('teststepview_table','tableFixHead')
})