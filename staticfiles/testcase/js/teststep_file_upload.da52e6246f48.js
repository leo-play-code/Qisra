// const upload_file_btn_element = document.querySelectorAll('.upload_file_btn')
// upload_file_btn_element.forEach(upload_btn_element=>{
//     upload_btn_element.addEventListener('click',function(e){
//         e.preventDefault()
//         activate_upload_file_btn_element(upload_btn_element)
//     })
// })

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
    document.getElementById('teststep_showfile_link_'+title_id).classList.remove('hidden')
    table_body_dom = document.getElementById('teststep_file_table_'+title_id).querySelector('.teststep_uploadfile_table_body')
    table_body_dom.innerHTML+=`
    <tr>
        <td style="Vertical-align:middle;"><a class="toast_download_show" href="/media/${path}" target="_blank">${filename}</a></td>
        <td class="status_show_position">${uploader}</td>
        <td class="status_show_position">${create_date}</td>
        <td class="status_show_position" ><a id="upload_teststep_id_${id}" onclick="delete_teststep_upload(this)" class="btn"><img style="width:15px;height:auto;" src='/static/images/trash3-fill.svg'></a></td>
    </tr>
    `
    teststep_file_table = document.getElementById('teststep_file_table_'+title_id)
    var toast_download_show_list = teststep_file_table.querySelectorAll('.toast_download_show')
    toast_download_show_list.forEach(toast_download_show_element=>{
        toast_download_show_element.addEventListener('click',function(e){
            filename = toast_download_show_element.innerText
            createToast(true, filename+'<br>下載成功')
        })
    })
}

