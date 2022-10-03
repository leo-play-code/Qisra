const collapseExample = document.getElementById('collapseExample')
const second_box_data = document.getElementById('second-box-data')
const dropdown_btn_list = document.querySelectorAll('.dropdown_btn')
// const third_box_data = document.getElementById('Teststep')


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
        ['Undo', 'Redo']
    ];
    // config.width = 670;
    config.height = 180;
    // config.autoParagraph = false;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;
};
// table varible
teststepview_table_id = document.getElementById('teststepview_table')
const edit_save_div_teststep = document.getElementById('edit-save-div-teststep')
//Edit button
var EditButton = document.getElementById('edit_teststep')
EditButton.addEventListener('click',function(e){
    EditButton.innerHTML = `<img src="/static/images/Spinner-1s-28px.svg">`
    e.preventDefault()
    EditMode()
})
const loading_save_teststep = document.getElementById('loading_save_teststep')
function EditMode(){  
    if($('#dropdown_btn3').attr("aria-expanded")=='false'){
        $('#dropdown_btn3').click()
    }
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
            delete_condition_main = teststep_tr_list_exists_node.querySelector('#edit_condition > .django-ckeditor-widget')
            temp = teststep_tr_list_exists_node.querySelector('#edit_condition > .django-ckeditor-widget >#cke_id_teststep_set-'+String_i_m1+'-condition')
            delete_condition_main.removeChild(temp)
            // remark
            teststep_tr_list_exists_node.querySelector('#edit_remark > .django-ckeditor-widget >#id_teststep_set-' + String_i_m1 + '-remark').setAttribute('id', 'edit_remark-' + String_i)
            delete_remark_main = teststep_tr_list_exists_node.querySelector('#edit_remark > .django-ckeditor-widget')
            temp = teststep_tr_list_exists_node.querySelector('#edit_remark > .django-ckeditor-widget >#cke_id_teststep_set-' + String_i_m1 + '-remark')
            delete_remark_main.removeChild(temp)
            // description
            teststep_tr_list_exists_node.querySelector('#edit_description > .django-ckeditor-widget >#id_teststep_set-' + String_i_m1 + '-description').setAttribute('id', 'edit_description-' + String_i)
            delete_description_main = teststep_tr_list_exists_node.querySelector('#edit_description > .django-ckeditor-widget')
            temp = teststep_tr_list_exists_node.querySelector('#edit_description > .django-ckeditor-widget >#cke_id_teststep_set-' + String_i_m1 + '-description')
            delete_description_main.removeChild(temp)
            teststep_tr_list_edit.appendChild(teststep_tr_list_exists_node)
            CKEDITOR.replace('edit_description-' + String_i,
                {
                    removePlugins: "exportpdf",
                    on: {
                        instanceReady: function (evt) {
                            evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                        }
                    }
                })
            CKEDITOR.replace('edit_condition-' + String_i,
                {
                    removePlugins: "exportpdf",
                    on: {
                        instanceReady: function (evt) {
                            evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                        }
                    }
                })
            CKEDITOR.replace('edit_remark-' + String_i,
                {
                    removePlugins: "exportpdf",
                    on: {
                        instanceReady: function (evt) {
                            evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                        }
                    }
                })
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
            teststep_tr_list_edit.appendChild(teststep_tr_list_exists_node)
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
    edit_save_div_teststep.innerHTML = `
        <button type="submit" class="btn btn-sm btn-success" id="save_teststep" name="save_teststep">Save</button>
    `
    var SaveButton = document.getElementById('save_teststep')
    SaveButton.addEventListener('click', function (e) {
        e.preventDefault()
        SaveButton.classList.add('hidden')
        loading_save_teststep.classList.remove('hidden')
        save_teststep_todjango()
    })
} 
function SaveMode(data){
    edit_save_div_teststep.innerHTML = `
        <button type="submit" class="btn btn-sm btn-danger" id="edit_teststep" name="edit_teststep" value="edit_teststep">Edit</button>
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
    // record all modal from all table
    // 無法得到old modal 要改儲存後的td      
    teststep_tr_list_save.innerHTML=``
    next_teststep_num = teststep_length
    var num_count = 0
    teststep_dict = data['teststep_dict']
    for (number in teststep_dict){
        teststep_data = teststep_dict[number]
        id_data = teststep_data['id']
        description_data = teststep_data['description'].replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        condition_data = teststep_data['condition'].replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        remark_data = teststep_data['remark'].replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        filedata_list = teststep_data['filelist']
        // use innerHTML to change value


        Temp_HTML=
            `<tr>
                <td id="id" class="hidden">${id_data}</td>
                <td id="number" class="status_show_position">${num_count+1}</td>
                <td id="description" >${description_data}</td>
                <td><p></p>${condition_data}</td>
                <td>${remark_data}</td>
                <td>
                    <div class="row save_upload_td">
                        <div class="col">
                            <a class="btn" data-bs-toggle="modal" href="#teststep_file_toggle_${id_data}" role="button"><i class="fa-solid fa-file-arrow-up" style="color: red; font-size:30px"></i></a>
                            <div class="modal fade" id="teststep_file_toggle_${id_data}" aria-hidden="true" aria-labelledby="teststep_file_togglelabel_${id_data}" tabindex="-1">     
            `      
        // add teststep file modal
        
        Temp_HTML+=`
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="teststep_file_togglelabel_${id_data}">上傳檔案</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <span class="modal-body" >
                    <input type="file" id="teststep_file_upload_${id_data}" />
                    <div style="color: red" class="error_msg hidden error_upload_blank_msg">
                        請選擇要上傳的資料
                    </div>
                    <div style="color: red" class="error_msg hidden error_upload_fail_msg">
                        上傳失敗,請上傳.xlsx後綴的檔案
                    </div>
                </span>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary upload_file_btn">
                        上傳
                    </button>
                    <img src='/static/images/Ellipsis-2.4s-48px.svg' class="hidden loading_teststep_file_btn">
                </div>
            </div>
        </div>
        `
        Temp_HTML+=`
        </div>
        </div>
        <div class="col ">
        `
        if (filedata_list.length > 0 ){
            Temp_HTML +=`<a class="btn" id="teststep_showfile_link_${id_data}" data-bs-toggle="modal" href="#teststep_file_show_${id_data}" role="button"><img style="width:30px;height:auto;" src='/static/images/teststep_file.svg'></a>`
        }else{
            Temp_HTML +=`<a class="btn hidden" id="teststep_showfile_link_${id_data}" data-bs-toggle="modal" href="#teststep_file_show_${id_data}" role="button"><img style="width:30px;height:auto;" src='/static/images/teststep_file.svg'></a>`
        }
        // teststep show file modal   
        Temp_HTML += `
        <div class="modal fade fileshow-modal" id="teststep_file_show_${id_data}" aria-hidden="true" aria-labelledby="teststep_file_showlabel_${id_data}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="teststep_file_showlabel_${id_data}">檔案下載</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <span class="modal-body" >
                        <div class="form-group tableFixHead" style="overflow:scroll;height:500px;overflow-x: hidden;width:100%;">
                        <table class="table table-hover table_border " id="teststep_file_table_${id_data}">
                        <!-- <table class="table table-striped"> -->
                            <thead>
                                <th>檔案名稱</th>
                                <th class="status_show_position">上傳者</th>
                                <th class="status_show_position">上傳時間</th>
                                <th class="status_show_position">刪除</th>
                            </thead>
                            <tbody class="teststep_uploadfile_table_body">`
        for(filedata in filedata_list){
            temp_file = filedata_list[filedata]
            filename = temp_file[0]
            filepath = temp_file[1]
            fileuploader = temp_file[2]
            filetime =temp_file[3]
            fileid = temp_file[4]
            Temp_HTML +=`
                <tr>
                    <td style="Vertical-align:middle;"><a class="toast_download_show" href="/media/${filepath}" target="_blank">${filename}</a></td>
                    <td class="status_show_position">${fileuploader}</td>
                    <td class="status_show_position">${filetime}</td>
                    <td class="status_show_position"><a id="upload_teststep_id_${fileid}" class="btn" onclick="delete_teststep_upload(this)"><img style="width:15px;height:auto;" src='/static/images/trash3-fill.svg'></a></td>
                </tr>
                `
                
        }            

        Temp_HTML+=                   
        `
                        </tbody>
                    </table>
                    </div>
                </span>
                <div class="modal-footer">
                </div>
            </div>
        </div>
        `                                
        Temp_HTML+=
            `
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            `
        teststep_tr_list_save.innerHTML += Temp_HTML
        teststep_file_table = teststep_tr_list_save.querySelectorAll('.toast_download_show')
        teststep_file_table.forEach(toast_download_show_element=>{
            toast_download_show_element.addEventListener('click',function(e){
                filename = toast_download_show_element.innerText
                createToast(true, filename+'<br>下載成功')
            })
        })
        num_count+=1
        temp_upload_teststep_btn_list = teststep_tr_list_save.querySelectorAll('.upload_file_btn')
        temp_upload_teststep_btn_list.forEach(teststep_upload_btn_element=>{
            teststep_upload_btn_element.addEventListener('click',function(e){
                e.preventDefault()
                activate_upload_file_btn_element(teststep_upload_btn_element)
            })
        })
    }
    
    
    //save mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','hidden')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','')

    // reset height table
    JCLRgrip_list  = document.querySelectorAll('.JCLRgrip')
    JCLRgrip_list.forEach(element=>{
        element.style.height = ($('#teststepview_table').height()).toString()+'px'
    })

}

//  add delete 
function delete_teststep(num){
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    var delete_teststep_target = teststep_tr_list_edit.querySelector('#teststep_tr_list_exists-'+(num+1).toString())
    teststep_tr_list_edit.removeChild(delete_teststep_target)
    if( document.getElementsByClassName('teststep_tr_list_sample').length==0){
        document.getElementById('add_teststepform').classList.remove('hidden')
    }
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
    // detect the biggest number
    var max_number = 0
    var teststep_tr_list_sample_list = document.querySelectorAll('.teststep_tr_list_sample')
    teststep_tr_list_sample_list.forEach(element=>{
        if (max_number<parseInt(element.id.replace('teststep_tr_list_exists-',''))){
            max_number = parseInt(element.id.replace('teststep_tr_list_exists-',''))
        }
    })
    // add teststep
    var copy_teststep_tr_list = document.getElementById('teststep_tr_list').cloneNode(true)
    copy_teststep_tr_list.setAttribute('class','teststep_tr_list_sample')
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    var teststep_length = document.getElementsByClassName('teststep_tr_list_sample').length
    next_teststep_num = teststep_length
    next_teststep_id_num = (next_teststep_num+1).toString()
    copy_teststep_tr_list.setAttribute('id','teststep_tr_list_exists-'+(max_number+1).toString())
    //condition
    next_teststep_id_condition = 'edit_condition-'+(max_number+1).toString()
    copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget').setAttribute('data-field-id',next_teststep_id_condition)
    copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #id_condition').setAttribute('id',next_teststep_id_condition)
    temp = copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #cke_id_condition')
    copy_teststep_tr_list.querySelector('#condition > .django-ckeditor-widget').removeChild(temp)
    //remark
    next_teststep_id_remark = 'edit_remark-' + (max_number+1).toString()
    copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget').setAttribute('data-field-id', next_teststep_id_remark)
    copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #id_remark').setAttribute('id', next_teststep_id_remark)
    temp = copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #cke_id_remark')
    copy_teststep_tr_list.querySelector('#remark > .django-ckeditor-widget').removeChild(temp)
    //description
    next_teststep_id_description = 'edit_description-' + (max_number+1).toString()
    copy_teststep_tr_list.querySelector('#description > .django-ckeditor-widget').setAttribute('data-field-id', next_teststep_id_description)
    copy_teststep_tr_list.querySelector('#description > .django-ckeditor-widget > #id_description').setAttribute('id', next_teststep_id_description)
    temp = copy_teststep_tr_list.querySelector('#description > .django-ckeditor-widget > #cke_id_description')
    copy_teststep_tr_list.querySelector('#description > .django-ckeditor-widget').removeChild(temp) 
    
    
    copy_teststep_tr_list.querySelector('#number').setAttribute('id','edit_number')
    // copy_teststep_tr_list.querySelector('#description').setAttribute('id','edit_description')
    // copy_teststep_tr_list.querySelector('#edit_description > #id_description').setAttribute('id','id_teststep_set-'+next_teststep_num.toString()+'-description')
    copy_teststep_tr_list.querySelector('#description').setAttribute('id', 'edit_description')
    copy_teststep_tr_list.querySelector('#condition').setAttribute('id','edit_condition')
    copy_teststep_tr_list.querySelector('#remark').setAttribute('id', 'edit_remark')
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
    CKEDITOR.replace(next_teststep_id_description, {
        removePlugins: "exportpdf", on: {
            instanceReady: function (evt) {
                evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
            }
        }
    })
    CKEDITOR.replace(next_teststep_id_condition, {
        removePlugins: "exportpdf", on: {
            instanceReady: function (evt) {
                evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
            }
        }
    })
    CKEDITOR.replace(next_teststep_id_remark, {
        removePlugins: "exportpdf", on: {
            instanceReady: function (evt) {
                evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
            }
        }
    })
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
    var num_count = 1
    teststep_tr_list_sample.forEach(element => {
        teststep_id =element.querySelector('#edit_id').innerHTML
        i = Number((element.id).replace("teststep_tr_list_exists-", ""));
        // var description_data = document.getElementById('id_teststep_set-'+(i-1).toString()+'-description').value
        var description_data = CKEDITOR.instances['edit_description-' + i.toString()].getData()
        description_data =  description_data.replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        var condition_data = CKEDITOR.instances['edit_condition-' + i.toString()].getData()
        condition_data = condition_data.replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        var remark_data = CKEDITOR.instances['edit_remark-' + i.toString()].getData()
        remark_data = remark_data.replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        if (description_data.replaceAll('<br />', '').replaceAll('<p>&nbsp;</p>','')!=''){
            // console.log('condition=',condition_data)
            // data_dict['id_teststep_set-' + (num_count).toString() + '-description'] = 
            // data_dict['id_teststep_set-' + (num_count).toString() + '-condition'] = 
            // data_dict['id_teststep_set-' + (num_count).toString() + '-remark'] = 
            // console.log(data_dict)
            data_dict['id_teststep_set-' + (teststep_id).toString()+'-'+(num_count).toString()+'[]']=[(num_count).toString(),description_data,condition_data,remark_data]
        }
        num_count+=1
    });
    // get testcase tag_list data
    // console.log(data_dict)
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_teststep'] = 'save_teststep';
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function(data) {
            console.log("success");
            loading_save_teststep.classList.add('hidden')
            SaveMode(data)
            createToast(true, 'Teststep 儲存成功')
        },
        error: function(data) {
            SaveButton.classList.remove('hidden')
            loading_save_teststep.classList.add('hidden')
            console.log("error");
        }
    });
}


const edit_save_div_info = document.getElementById('edit-save-div-info')
var Edit_info_btn = document.getElementById('edit_info')
Edit_info_btn.addEventListener('click',function(e){
    Edit_info_btn.innerHTML = `<img src="/static/images/Spinner-1s-28px.svg">`
    e.preventDefault()
    Edit_info_mode()
    Edit_info_btn.innerHTML = `Edit`
})
var save_info_div = document.getElementById('info_savemode')
var edit_info_div = document.getElementById('info_editmode')
const loading_save_info = document.getElementById('loading_save_info')
function Edit_info_mode(){
    if($('#dropdown_btn1').attr("aria-expanded")=='false'){
        $('#dropdown_btn1').click()
    }
    
    edit_save_div_info.innerHTML = `
        <button type="submit" class="btn btn-sm btn-success" id="save_info" name="save_info">Save</button>
    `
    var SaveButton = document.getElementById('save_info')
    SaveButton.addEventListener('click',function(e){
        loading_save_info.classList.remove('hidden')
        SaveButton.classList.add('hidden')
        e.preventDefault()
        save_info_django()
    })
    save_info_div.setAttribute('class','hidden')
    edit_info_div.setAttribute('class','')
}
const save_context_div = document.getElementById('save_context')
const save_name_p = document.getElementById('save_name')
const save_tag_p = document.getElementById('save_tag')
const testcase_title = document.getElementById('testcase_title')
function Save_info_mode(){
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-sm btn-danger" id="edit_info" name="edit_info" value="edit_info">Edit</button>
    `
    var EditButton = document.getElementById('edit_info')
    EditButton.addEventListener('click',function(e){
        e.preventDefault()
        Edit_info_mode()
    })
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
const error_name_msg = document.getElementById('error-name')
function save_info_django(){
    error_name_msg.classList.add('hidden')
    var name_data = $('#id_testcasename').val()
    if (name_data.replaceAll(' ','')== ''){
        error_name_msg.classList.remove('hidden')
        loading_save_info.classList.add('hidden')
        var SaveButton = document.getElementById('save_info')
        SaveButton.classList.remove('hidden')
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
                createToast(true, 'Testcase Information 儲存成功')
            },
            error: function (data) {
                loading_save_info.classList.add('hidden')
                var SaveButton = document.getElementById('save_info')
                SaveButton.classList.remove('hidden')
                console.log("error");
                alert('此名稱已存在')
            }
        });
    }
    
}

var cancel_btn = document.getElementById('cancel_edit')
var dropdown_three_dot = document.getElementById('dropdown_three_dot')
var second_box_save_div = document.getElementById('second-box-save-div')
var second_box_edit_div = document.getElementById('second-box-edit-div')
cancel_btn.addEventListener('click',function(e){
    e.preventDefault()
    var EditButton = document.getElementById('edit_teststep')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var SaveButton = document.getElementById('save_teststep')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.remove('hidden')
    try{
        second_box_edit_btn.classList.add('hidden')
    }catch{
        second_box_save_btn.classList.add('hidden')
    }
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
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
    cancel_btn.classList.add('hidden')
})
var edit_all_btn = document.getElementById('edit_all')
edit_all_btn.addEventListener('click',function(e){
    e.preventDefault()
    var EditButton = document.getElementById('edit_teststep')
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var SaveButton = document.getElementById('save_teststep')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
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
    try{
        second_box_edit_btn.classList.remove('hidden')
    }catch{
        second_box_save_btn.classList.remove('hidden')
        second_box_save_div.classList.add('hidden')
        second_box_edit_div.classList.remove('hidden')
    }
    cancel_btn.classList.remove('hidden')
})




var clone_div = document.getElementById('clone_div')
if (testcase_title.innerHTML.includes('-clone')){
    clone_div.classList.add('hidden')
}else{
    clone_div.classList.remove('hidden')
}

// screen full 
var teststepview_table = document.querySelectorAll('.teststepview_table')
var fullscreen_btn = document.getElementById('fullscreen')
var smallscreen_btn = document.getElementById('smallscreen')

if ($('#teststepview_table').height() < 1000) {
    fullscreen_btn.classList.add('hidden')
    smallscreen_btn.classList.add('hidden')
    teststepview_table.forEach(element => {
        element.classList.remove('teststepview_table', 'tableFixHead')
    })
}
fullscreen_btn.addEventListener('click',function(e){
    e.preventDefault()
    fullscreen_btn.classList.add('hidden')
    smallscreen_btn.classList.remove('hidden')
    document.getElementById('resize_scroll_teststep_table').classList.remove('resize_scroll_limit_h')
})
smallscreen_btn.addEventListener('click',function(e){
    e.preventDefault()
    fullscreen_btn.classList.remove('hidden')
    smallscreen_btn.classList.add('hidden')
    document.getElementById('resize_scroll_teststep_table').classList.add('resize_scroll_limit_h')
})



//second-box
var second_box_edit_save_div = document.getElementById('second-box-edit-save_div')
var second_box_edit_btn = document.getElementById('second-box-edit')

second_box_edit_btn.addEventListener('click',function(e){
    second_box_edit_btn.innerHTML = `<img src="/static/images/Spinner-1s-28px.svg">`
    e.preventDefault()
    _edit_second_box_mode()
    second_box_edit_btn.innerHTML = `Edit`
})
function _save_second_box_todjango(){
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
            _save_second_box_mode()
            loading_save_context.classList.add('hidden')
            createToast(true, 'Testcase 描述 儲存成功')
        },
        error: function(data) {
            var second_box_save_btn = document.getElementById('second-box-save')
            loading_save_context.classList.add('hidden')
            second_box_save_btn.classList.remove('hidden')
            console.log("error");
        }
    });
    
}
const loading_save_context = document.getElementById('loading_save_context')
function _edit_second_box_mode(){
    if($('#dropdown_btn2').attr("aria-expanded")=='false'){
        $('#dropdown_btn2').click()
    }

    
    second_box_edit_save_div.innerHTML=`<button type="submit" class="btn btn-sm btn-success" id="second-box-save" name="second-box-save">Save</button>`
    var second_box_save_btn = document.getElementById('second-box-save')
    second_box_save_btn.addEventListener('click',function(e){
        loading_save_context.classList.remove('hidden')
        second_box_save_btn.classList.add('hidden')
        e.preventDefault()
        _save_second_box_todjango()
    })
    second_box_save_div.classList.add('hidden')
    second_box_edit_div.classList.remove('hidden')
}
function _save_second_box_mode(){
    second_box_edit_save_div.innerHTML=`<button type="submit" class="btn btn-sm btn-danger" id="second-box-edit" name="second-box-edit">Edit</button>`
    var second_box_edit_btn = document.getElementById('second-box-edit')
    second_box_edit_btn.addEventListener('click',function(e){
        e.preventDefault()
        _edit_second_box_mode()
    })
    var context_data = CKEDITOR.instances['context'].getData().replaceAll(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
    if(context_data == ''){
        save_context_div.classList.add('save_context_no_text')
        save_context_div.classList.remove('save_context_has_text')
        save_context_div.innerHTML = `&nbsp&nbsp&nbsp&nbsp&nbspNo description`
    }else{
        save_context_div.classList.remove('save_context_no_text')
        save_context_div.classList.add('save_context_has_text')
        save_context_div.innerHTML = `${context_data}<br>`
    }
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
}


add_teststepform.addEventListener('click', function(e){
    e.preventDefault()
    AddTeststep()
    document.getElementById('add_teststepform').classList.add('hidden')
})


