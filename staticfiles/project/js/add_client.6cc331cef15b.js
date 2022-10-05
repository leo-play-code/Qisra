// renew create tag
function _Create_Client(DOM){
    // set up dom 
    const Client_Modal = DOM.parentNode.parentNode
    new_name_input = Client_Modal.querySelector('#new_client_name')
    new_name = Client_Modal.querySelector('#new_client_name').value
    error_msg = Client_Modal.querySelector('#error-client-name')
    loading_img = Client_Modal.querySelector('#loading_create_client')
    add_btn = Client_Modal.querySelector('#add_client_btn')
    // run code
    error_msg.classList.add('hidden')
    if (new_name.replaceAll(' ','')==''){
        createToast(false, '客戶欄位不可空白')
    }else{
        add_btn.classList.add('hidden')
        loading_img.classList.remove('hidden')
        var csrftoken = getCookie('csrftoken');
        data_dict = {}
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        data_dict['add_client'] = 'add_client';
        data_dict['client_name'] = new_name;
        $.ajax({
            type: 'GET',
            url: '/project/new_client/',
            data: data_dict,
            success: function (data) {
                console.log("success");
                if (data['status']=='pass'){
                    _Finish_Add_Client(Client_Modal,data)
                    new_name_input.value = ''
                    createToast(true, 'Client 名稱 '+data['name']+' 已成功建立!')
                }else{
                    createToast(false, 'Client 名稱 '+data['name']+' 已被命名了!')
                }
                loading_img.classList.add('hidden')
                add_btn.classList.remove('hidden')
            },
            error: function (data) {
                console.log("error");
            }
        });
    }
}
function _Finish_Add_Client(Client_Modal,data){
    $('#'+Client_Modal.parentNode.parentNode.id).modal('hide');
    new_client_name = data['name']
    new_client_id = data['id']
    // reset selectpicker
    $("#id_client").append('<option value="'+new_client_name+'">'+new_client_name+'</option>');
    $("#id_client").selectpicker('val', new_client_name);
    $("#id_client").selectpicker("refresh");
}
