function delete_teststep_upload(dom){
    
    Tabel_Upload_tr = dom.parentNode.parentNode
    teststep_file_id = dom.id
    teststep_file_id = teststep_file_id.replace('upload_teststep_id_','')

    
    filename = dom.parentNode.parentNode.querySelector('td>.toast_download_show').innerText
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
                teststep_id = (table_dom.parentNode.id).replaceAll('teststep_file_table_','')
                show_file_btn = document.getElementById('teststep_showfile_link_'+teststep_id)
                show_file_btn.classList.add('hidden')
                this_modal = document.getElementById('teststep_file_showlabel_'+teststep_id).parentNode
                this_modal.querySelector('.btn-close').click()
            }
        },
        error: function(data) {
            console.log("error");
        }
    });
}
function toast_download_show_refresh(){
    var toast_download_show_list = document.querySelectorAll('.toast_download_show')
    toast_download_show_list.forEach(toast_download_show_element=>{
        toast_download_show_element.addEventListener('click',function(e){
            filename = toast_download_show_element.innerText
            createToast(true, filename+'<br>下載成功')
        })
    })
}
toast_download_show_refresh()
// refresh need to set up to every function while innerhtml change