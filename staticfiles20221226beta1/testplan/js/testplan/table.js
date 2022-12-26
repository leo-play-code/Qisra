const testrun_table = document.getElementById('testrun_table')
function _Delete_testrun(DOM){
    testrun_tr = DOM.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    delete_modal_id = DOM.parentNode.parentNode.parentNode.parentNode.parentNode.id
    testrun_id =  DOM.parentNode.querySelector('#delete_testrun_value').value
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['id'] = testrun_id
    data_dict['delete_testrun_verify'] = 'delete_testrun_verify'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function (data) {
            console.log("success");
            $('#'+delete_modal_id).modal('hide');
            testrun_table.removeChild(testrun_tr)
            _Reset_select_testcase(data['testrun_list'])
            createToast(true, '成功刪除Testcase！')
        },
        error: function (data) {
            console.log("error");
            createToast(false, '刪除Testcase失敗！')
        }
    });
    return false
}


function _Add_testcase(DOM){
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_testcase'] = 'save_testcase'

    if ($('#select_testcase').val()==null){
        createToast(false, '沒選擇要添加的Testcase')
    }else{
        data_dict['testcase_list[]'] = $('#select_testcase').val()
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success: function () {
                console.log("success");
                window.location = '';
            },
            error: function () {
                console.log("error");
                createToast(false, '添加Testcase失敗！')
            }
        });
    }
    return false
}


function _Reset_select_testcase(data){
    if (data.length>0){
        $('#select_testcase').append('<option value="'+data[0][0]+'">'+data[0][1]+'</option>');
        $('#select_testcase').selectpicker("refresh");
    }
    
}

