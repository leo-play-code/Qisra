const error_upload_blank_msg = document.getElementById('error_upload_blank_msg')
const upload_teststep_file_btn = document.getElementById('upload_teststep_file_btn')
const error_upload_fail_msg = document.getElementById('error_upload_fail_msg')
const loading_teststep_file_btn = document.getElementById('loading_teststep_file_btn')
const five_box_data = document.getElementById('five-box-data')

upload_teststep_file_btn.addEventListener('click',function(e){
    e.preventDefault()
    error_upload_fail_msg.classList.add('hidden')
    var filedata = $('#id_file_upload')[0].files[0]
    bool_ajax = true
    if (!filedata) {
        bool_ajax = false
        error_upload_blank_msg.classList.remove('hidden')
    } else {
        error_upload_blank_msg.classList.add('hidden')
    }
    if (bool_ajax == true) {
        var fd = new FormData();
        var csrftoken = getCookie('csrftoken');
        fd.append('file', filedata);
        fd.append('csrfmiddlewaretoken', csrftoken)
        fd.append('upload_file_to_testcase', 'upload_file_to_testcase')
        $.ajax({
            url: '',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            beforeSend: function () {
                $("#upload_teststep_file_btn").hide();
                loading_teststep_file_btn.classList.remove('hidden')
            },
            complete: function () {
                $("#upload_teststep_file_btn").show();
                loading_teststep_file_btn.classList.add('hidden')
            },
            success: function (data) {
                console.log('success')
                var input_file = document.getElementById('id_file_upload')
                input_file.value = ''
                $('#file_upload_toggle').modal('hide');
                
                Upload_Tabel(data);
                createToast(true, data['filename']+'<br>上傳成功')
            },
            error: function (data) {
                console.log('error')
                error_upload_fail_msg.classList.remove('hidden')
            }
        });
    }
})
function Upload_Tabel(data){
    var uploadfile_table_body = document.getElementById('uploadfile_table_body')
    id = data['id']
    path = data['path']
    filename = data['filename']
    uploader = data['uploader']
    create_date = data['upload_time']
    uploadfile_table_body.innerHTML+=`
    <tr>
        <td style="Vertical-align:middle;"><a class="toast_download_show" href="/media/${path}" target="_blank">${filename}</a></td>
        <td class="status_show_position">${uploader}</td>
        <td class="status_show_position">${create_date}</td>
        <td class="status_show_position" ><a id="upload_id_${id}" onclick="delete_upload(this)" class="btn"><img style="width:15px;height:auto;" src='/static/images/trash3-fill.svg'></a></td>
    </tr>
    `
    testcase_file_table=uploadfile_table_body.querySelectorAll('.toast_download_show')
    testcase_file_table.forEach(toast_download_show_element=>{
        toast_download_show_element.addEventListener('click',function(e){
            filename = toast_download_show_element.innerText
            createToast(true, filename+'<br>下載成功')
        })
    })

    if($('#dropdown_btn4').attr("aria-expanded")=='false'){
        $('#dropdown_btn4').click()
    }
}

function delete_upload(DOM){
    Tabel_Upload_tr = DOM.parentNode.parentNode
    delete_id = DOM.id
    filename = DOM.parentNode.parentNode.querySelector('td>.toast_download_show').innerText
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    delete_id = delete_id.replace('upload_id_','')
    data_dict['delete_id'] = delete_id
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['delete_upload_file'] = 'delete_upload_file'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            Tabel_Upload_tr.remove()
            createToast(false, filename+'<br>已刪除')
        },
        error: function(data) {
            console.log("error");
        }
    });

}
