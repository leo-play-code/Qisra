

function activate_upload_file_btn_element(upload_btn_element){
    upload_btn_element.parentNode.parentNode.querySelector('.modal-body>.error_upload_fail_msg').classList.add('hidden')
    title_id = upload_btn_element.parentNode.parentNode.querySelector('.modal-header>.modal-title').id
    title_id = title_id.replaceAll('teststep_file_togglelabel_','')
    var filedata = $('#teststep_file_upload_'+title_id)[0].files[0]
    bool_ajax = true
    if (!filedata) {
        bool_ajax = false
        upload_btn_element.parentNode.parentNode.querySelector('.modal-body>.error_upload_blank_msg').classList.remove('hidden')
    } else {
        upload_btn_element.parentNode.parentNode.querySelector('.modal-body>.error_upload_blank_msg').classList.add('hidden')
    }
    if (bool_ajax == true) {
        var fd = new FormData();
        var csrftoken = getCookie('csrftoken');
        fd.append('file', filedata);
        fd.append('csrfmiddlewaretoken', csrftoken)
        fd.append('id',title_id)
        fd.append('upload_file_to_teststep', 'upload_file_to_teststep')
        $.ajax({
            url: '',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            beforeSend: function () {
                upload_btn_element.classList.add('hidden')
                upload_btn_element.parentNode.querySelector('.loading_teststep_file_btn').classList.remove('hidden')
            },
            complete: function () {
                upload_btn_element.classList.remove('hidden')
                upload_btn_element.parentNode.querySelector('.loading_teststep_file_btn').classList.add('hidden')
            },
            success: function (data) {
                console.log('success')
                createToast(true, data['filename']+'<br>上傳成功')
                document.getElementById('teststep_file_upload_'+title_id).value = ''
                upload_btn_element.parentNode.parentNode.querySelector('.modal-header>.btn-close').click()
                Upload_teststep_file_Tabel(data,title_id)

            },
            error: function (data) {
                console.log('error')
                upload_btn_element.parentNode.parentNode.querySelector('.modal-body>.error_upload_fail_msg').classList.remove('hidden')
            }
        });
    }
    return false
}
function Upload_teststep_file_Tabel(data,title_id){
    id = data['id']
    path = data['path']
    filename = data['filename']
    uploader = data['uploader']
    create_date = data['upload_time']
    // show filed download btn in 附件td
    console.log('title_id',title_id)
    // 
    edit_body = document.getElementById('teststep_tr_list_editmode')
    save_body = document.getElementById('teststep_tr_list_savemode')
    // console.log(edit_body.classList.contains('hidden'))
    // console.log(save_body.classList.contains('hidden'))

    edit_body.querySelector('#teststep_showfile_link_'+title_id).classList.remove('hidden')
    save_body.querySelector('#teststep_showfile_link_'+title_id).classList.remove('hidden')


    // modal table of this teststep
    table_body_dom = document.getElementById('teststep_file_return_'+title_id).querySelector('.teststep_uploadfile_table_body')
    table_body_dom.innerHTML+=`
    <div class="divTableRow">
        <div style="Vertical-align:middle;" class="divTableCell"><a class="toast_download_show" href="/media/${path}" onclick="downloadSuccess(this)">${filename}</a></div>
        <div class="status_show_position divTableCell">${uploader}</div>
        <div class="status_show_position divTableCell">${create_date}</div>
         <div class="status_show_position divTableCell"><a id="upload_teststep_id_${id}" class="btn" onclick="delete_teststep_upload(this)"><img style="width:15px;height:auto;" src='/static/images/trash3-fill.svg'></a></div>
    </div>
    `
    
}
function downloadSuccess(dom){
    filename = dom.innerText
    createToast(true, filename+'<br>下載成功')
}


function delete_teststep_upload(dom){
    Tabel_Upload_tr = dom.parentNode.parentNode
    teststep_file_id = dom.id
    teststep_file_id = teststep_file_id.replace('upload_teststep_id_','')
    filename = dom.parentNode.parentNode.querySelector('.divTableCell > .toast_download_show').innerText
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    data_dict['delete_id'] = teststep_file_id
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['delete_teststep_file'] = 'delete_teststep_file'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            table_dom = dom.parentNode.parentNode.parentNode
            Tabel_Upload_tr.remove()
            createToast(false, filename+'<br>已刪除')
            if(!table_dom.querySelectorAll('.toast_download_show').length>0){
                teststep_id = (table_dom.parentNode.id).replaceAll('teststep_file_return_','')
                show_file_btn = document.querySelector('#teststep_tr_list_savemode').querySelector('#teststep_showfile_link_'+teststep_id)
                show_file_btn_edit = document.getElementById('teststep_tr_list_editmode').querySelector('#teststep_showfile_link_'+teststep_id)
                show_file_btn.classList.add('hidden')
                show_file_btn_edit.classList.add('hidden')
                this_modal = document.getElementById('teststep_file_showlabel_'+teststep_id).parentNode
                this_modal.querySelector('.btn-close').click()
            }
        },
        error: function(data) {
            console.log("error");
        }
    });
}



