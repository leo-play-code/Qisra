// btn DOM
const Edit_teststep_btn = document.getElementById('Edit_teststep_btn')
const Cancel_teststep_btn = document.getElementById('Cancel_teststep_btn')
const Save_teststep_btn = document.getElementById('Save_teststep_btn')
const loading_save_teststep = document.getElementById('loading_save_teststep')
const add_teststep_btn = document.getElementById('add_teststep_btn')
// table DOM
const upload_title = document.getElementById('upload_title')
const teststep_tr_list_savemode = document.getElementById('teststep_tr_list_savemode')
// Table btn
function _Edit_teststep(DOM){
    // btn change
    Edit_teststep_btn.classList.add('hidden')
    gradient_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    gradient_teststep_list.forEach(teststep_element => {
        teststep_element.querySelector('#number').classList.add('hidden')
        teststep_element.querySelector('#edit_number').classList.remove('hidden')
        teststep_element.querySelector('#upload').classList.add('hidden')
    })
    // activate ckeditor replace
    var ckeditor_replcae_list = teststep_tr_list_savemode.querySelectorAll('.ckeditor_replace')
    ckeditor_replcae_list.forEach(ckeditor_replcae_element=>{
        temp = CKEDITOR.replace(ckeditor_replcae_element);
        temp = ckeditor_replcae_element.parentNode
    })
    // hide 附件
    upload_title.classList.add('hidden')

    // wait unitl exist
    var checkExist = setInterval(function() {
        if (temp.querySelector('.cke_reset')) {
            Save_teststep_btn.classList.remove('hidden')
            Cancel_teststep_btn.classList.remove('hidden')
           clearInterval(checkExist);
        }
    }, 100); // check every 100ms
    return false
}
function _Save_teststep(DOM){
    Save_teststep_btn.classList.add('hidden')
    Cancel_teststep_btn.classList.add('hidden')
    add_teststep_btn.classList.add('hidden')
    count_teststep = 1
    gradient_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    gradient_teststep_list.forEach(teststep_element => {
        if (teststep_element.classList.contains('hidden')==true){
            teststep_tr_list_savemode.removeChild(teststep_element)
        }else{
            if (teststep_element.classList.contains('temp_teststep')){
                teststep_element.classList.remove('temp_teststep')
            }
            teststep_element.querySelector('#edit_number').classList.add('hidden')
            teststep_element.querySelector('#number').classList.remove('hidden')
            teststep_element.querySelector('#number').innerHTML = `${count_teststep.toString()}`
            count_teststep+=1
            teststep_element.querySelector('#upload').classList.remove('hidden')
        }
    })
    // hide 附件
    upload_title.classList.remove('hidden')
    // ckeditor save and destory
    var ckeditor_replcae_list = teststep_tr_list_savemode.querySelectorAll('.ckeditor_replace')
    ckeditor_replcae_list.forEach(ckeditor_replcae_element=>{
        ckeditor_id = ckeditor_replcae_element.parentNode.querySelector('.cke_chrome').id
        ckeditor_id = ckeditor_id.replace('cke_','')
        ckeditor_data = CKEDITOR.instances[ckeditor_id].getData()
        ckeditor_replcae_element.innerHTML = ckeditor_data
        CKEDITOR.instances[ckeditor_id].destroy(true);
    })
    // reset table height
    JCLRgrip_list  = document.querySelectorAll('.JCLRgrip')
    JCLRgrip_list.forEach(element=>{
        element.style.height = ($('#teststepview_table').height()).toString()+'px'
    })
    // save to django read table now and save all data one by one
    loading_save_teststep.classList.remove('hidden')
    Save_teststep_todjango()
    return false
}
function _Cancel_teststep(DOM){
    // 更改按鈕狀態
    Save_teststep_btn.classList.add('hidden')
    Cancel_teststep_btn.classList.add('hidden')
    Edit_teststep_btn.classList.remove('hidden')
    add_teststep_btn.classList.add('hidden')
    // 更改桌面狀態
    gradient_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    gradient_teststep_list.forEach(teststep_element => {
        if (teststep_element.classList.contains('temp_teststep')){
            teststep_tr_list_savemode.removeChild(teststep_element)
        }else{
            teststep_element.querySelector('#edit_number').classList.add('hidden')
            teststep_element.querySelector('#number').classList.remove('hidden')
            teststep_element.classList.remove('hidden')
            teststep_element.querySelector('#upload').classList.remove('hidden')
        }
    })
    // hide 附件
    upload_title.classList.remove('hidden')
    // destory table ckeditor
    teststep_tr_list_savemode.querySelectorAll('.cke_chrome').forEach(element=>{
        data = element.id.replaceAll('cke_','')
        CKEDITOR.instances[data].destroy(true);
    })

    JCLRgrip_list  = document.querySelectorAll('.JCLRgrip')
    JCLRgrip_list.forEach(element=>{
        element.style.height = ($('#teststepview_table').height()).toString()+'px'
    })
    return false
}



// teststep btn
function Add_teststep(){
    teststep_sameple_tr = document.getElementById('teststep_tr_list').cloneNode(true)
    teststep_sameple_tr.classList.remove('hidden')
    teststep_tr_list_savemode.appendChild(teststep_sameple_tr)
    var ckeditor_replcae_list = teststep_sameple_tr.querySelectorAll('.ckeditor_replace')
    ckeditor_replcae_list.forEach(ckeditor_replcae_element=>{
        CKEDITOR.replace(ckeditor_replcae_element);
    })
}
function _Add_teststep(DOM){
    Add_teststep()
    var new_teststep = teststep_tr_list_savemode.querySelector('#teststep_tr_list')
    new_teststep.setAttribute('id','')
    new_teststep.setAttribute('class','gradient_teststep_list temp_teststep')
    add_teststep_btn.classList.add('hidden')
    return false
}
function _Delete_teststep(DOM){
    teststep_tr = DOM.parentNode.parentNode
    teststep_tr.classList.add('hidden')
    Add_teststep_btn_detect()
    return false
}
function _ADD_up_teststep(DOM){
    Add_teststep()
    now_tr = DOM.parentNode.parentNode
    var new_teststep = teststep_tr_list_savemode.querySelector('#teststep_tr_list')
    new_teststep.setAttribute('id','')
    new_teststep.setAttribute('class','gradient_teststep_list temp_teststep')
    teststep_tr_list_savemode.insertBefore(new_teststep,now_tr)
    new_teststep.scrollIntoView({block: "center"});
    return false
}
function _ADD_down_teststep(DOM){
    Add_teststep()
    now_tr = DOM.parentNode.parentNode
    var new_teststep = teststep_tr_list_savemode.querySelector('#teststep_tr_list')
    new_teststep.setAttribute('id','')
    new_teststep.setAttribute('class','gradient_teststep_list temp_teststep')
    insertAfter(new_teststep,now_tr)    
    new_teststep.scrollIntoView({block: "center"});
    return false
}
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function Save_teststep_todjango(){
    data_dict = {}
    gradient_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    gradient_teststep_list.forEach(teststep_element=>{
        teststep_id = teststep_element.querySelector('#id').innerHTML
        number_data = teststep_element.querySelector('#number').innerHTML
        description_data = teststep_element.querySelector('#description > .ckeditor_replace').innerHTML
        condition_data = teststep_element.querySelector('#condition >.ckeditor_replace').innerHTML
        remark_data = teststep_element.querySelector('#remark >.ckeditor_replace').innerHTML
        description_data = description_data.replaceAll('<br>', '<br />').replaceAll('<p>','').replaceAll('</p>','').replaceAll(/\n/g, '')
        condition_data = condition_data.replaceAll('<br>', '<br />').replaceAll('<p>','').replaceAll('</p>','').replaceAll(/\n/g, '')
        remark_data = remark_data.replaceAll('<br>', '<br />').replaceAll('<p>','').replaceAll('</p>','').replaceAll(/\n/g, '')
        data_dict['id_teststep_set-' + (teststep_id).toString()+'-'+(number_data).toString()+'[]']=[(number_data).toString(),description_data,condition_data,remark_data]
    })
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_teststep'] = 'save_teststep';
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function(data) {
            console.log("success");
            loading_save_teststep.classList.add('hidden')
            Edit_teststep_btn.classList.remove('hidden')
            Upload_tesstep_id(data)
            createToast(true, 'Teststep 儲存成功')
        },
        error: function(data) {
            Save_teststep_btn.classList.remove('hidden')
            loading_save_teststep.classList.add('hidden')
            console.log("error");
        }
    });
}

function Upload_tesstep_id(data){
    teststep_dict = data['teststep_dict']
    gradient_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    gradient_teststep_list.forEach(teststep_element => {
        // reset number
        number = teststep_element.querySelector('#number').innerHTML
        id_data = teststep_dict[number]['id']
        teststep_element.querySelector('#id').innerHTML = id_data
        // reset upload_btn
        filedata_list = teststep_dict[number]['filelist']
        upload_td = teststep_element.querySelector('#upload').innerHTML
        
        if (upload_td==''){
            // console.log('id_data=',id_data)
            temp_upload_td = `
            <div class="row save_upload_td">
            <div class="col">
                <a class="btn" data-bs-toggle="modal" href="#teststep_file_toggle_${id_data}" role="button"><i class="fa-solid fa-file-arrow-up" style="color: red; font-size:30px"></i></a>
                <div class="modal fade" id="teststep_file_toggle_${id_data}" aria-hidden="true" aria-labelledby="teststep_file_togglelabel_${id_data}" tabindex="-1">`
            temp_upload_td+=`
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
                        <button type="button" class="btn btn-primary upload_file_btn" onclick="return activate_upload_file_btn_element(this)">
                            上傳
                        </button>
                            <img src='/static/images/Ellipsis-2.4s-48px.svg' class="hidden loading_teststep_file_btn">
                        </div>
                    </div>
                </div>
                `
                temp_upload_td+=`
            </div>
            </div>
            <div class="col ">
            `
            if (filedata_list.length > 0 ){
                temp_upload_td +=`<a class="btn" id="teststep_showfile_link_${id_data}" data-bs-toggle="modal" href="#teststep_file_show_${id_data}" role="button"><img style="width:30px;height:auto;" src='/static/images/teststep_file.svg'></a>`
            }else{
                temp_upload_td +=`<a class="btn hidden" id="teststep_showfile_link_${id_data}" data-bs-toggle="modal" href="#teststep_file_show_${id_data}" role="button"><img style="width:30px;height:auto;" src='/static/images/teststep_file.svg'></a>`
            }
            temp_upload_td += `
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
                temp_upload_td +=`
                    <tr>
                        <td style="Vertical-align:middle;"><a class="toast_download_show" href="/media/${filepath}" target="_blank">${filename}</a></td>
                        <td class="status_show_position">${fileuploader}</td>
                        <td class="status_show_position">${filetime}</td>
                        <td class="status_show_position"><a id="upload_teststep_id_${fileid}" class="btn" onclick="delete_teststep_upload(this)"><img style="width:15px;height:auto;" src='/static/images/trash3-fill.svg'></a></td>
                    </tr>
                    `       
            }            
            temp_upload_td+=                   
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
            temp_upload_td+=
                `
                                </div>
                            </div>
                        </div>`
            teststep_element.querySelector('#upload').innerHTML = temp_upload_td
        }
    })
}

function Add_teststep_btn_detect(){
    temp_length = 0
    gradient_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    gradient_teststep_list.forEach(element=>{
        if (!element.classList.contains('hidden')){
            temp_length+=1;
        }
    })
    if (temp_length<1){
        add_teststep_btn.classList.remove('hidden')
    }
}
Add_teststep_btn_detect()



// full screen & exit full screen
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