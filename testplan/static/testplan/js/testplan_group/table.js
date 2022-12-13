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



function _Add_testplan(DOM){
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_testplan'] = 'save_testplan'
    if ($('#new_testplan_name').val()==''){
        createToast(false, '添加Testplan 失敗')
    }else{
        data_dict['name'] = $('#new_testplan_name').val()
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success: function (data) {
                if (data['error']){
                    createToast(false, '添加Test Plan 失敗！此Testplan 名稱已經被使用')
                }else{
                    console.log("success");
                    window.location = '';
                }
                
            },
            error: function (data) {
                console.log("error");
                createToast(false, '添加Test Plan 失敗！')
            }
        });
    }
    return false
}





const Edit_table_btn = document.getElementById('Edit_table_btn')
const Save_table_btn = document.getElementById('Save_table_btn')
const Cancel_table_btn = document.getElementById('Cancel_table_btn')
const add_table_div = document.getElementById('add_table_div')
const table_td_edit = document.querySelectorAll('.table_td_edit')
const table_td_save = document.querySelectorAll('.table_td_save')
// btn 
function _Edit_table2(DOM){
    var testplan_testcase_checkbox = document.querySelectorAll('.testplan_testcase_checkbox')
    var testcase_check_all = document.querySelectorAll('.testcase_check_all')
    var testplan_check_all = document.querySelectorAll('.testplan_check_all')
    
    testcase_check_all.forEach(element=>{
        element.classList.remove('hidden')
    })
    testplan_check_all.forEach(element=>{
        element.classList.remove('hidden')
    })
    table_td_edit.forEach(element=>{
        element.classList.remove('hidden')
    })
    table_td_save.forEach(element=>{
        element.classList.add('hidden')
    })

    add_table_div.classList.remove('hidden')
    Edit_table_btn.classList.add('hidden')
    Save_table_btn.classList.remove('hidden')
    Cancel_table_btn.classList.remove('hidden')
    testplan_testcase_checkbox.forEach(element=>{
        element.disabled = false
    })
    return false
}
function _Cancel_table(DOM){
    var testplan_testcase_checkbox = document.querySelectorAll('.testplan_testcase_checkbox')
    var testcase_check_all = document.querySelectorAll('.testcase_check_all')
    var testplan_check_all = document.querySelectorAll('.testplan_check_all')
    testcase_check_all.forEach(element=>{
        element.checked = false
        element.classList.add('hidden')
    })
    testplan_check_all.forEach(element=>{
        element.checked = false
        element.classList.add('hidden')
    })

    table_td_edit.forEach(element=>{
        element.classList.add('hidden')
    })
    table_td_save.forEach(element=>{
        element.classList.remove('hidden')
    })

    add_table_div.classList.add('hidden')
    Save_table_btn.classList.add('hidden')
    Cancel_table_btn.classList.add('hidden')
    Edit_table_btn.classList.remove('hidden')
    testplan_testcase_checkbox.forEach(element=>{
        element.checked = false
        element.disabled = true
    })
    return false
}
function _Save_table(DOM){
    var loading_save_table = document.getElementById('loading_save_table')
    Save_table_btn.classList.add('hidden')
    Cancel_table_btn.classList.add('hidden')
    loading_save_table.classList.remove('hidden')
    // Edit_table_btn.classList.remove('hidden')
    _Save_testcase_django()
    
    
    return false
}

function _Save_testcase_django(){
    var testplan_testcase_checkbox = document.querySelectorAll('.testplan_testcase_checkbox')
    data_dict = {}
    id_list = []
    testplan_testcase_checkbox.forEach(element=>{
        if (element.checked == true){
            id_list.push(element.id)
        }
    })
    var csrftoken = getCookie('csrftoken');
    data_dict['testrun[]'] = id_list
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['create_testrun'] = 'create_testrun'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function (data) {
            console.log("success");
            createToast(true, '添加Testcase成功！')
            window.location = '';
        },
        error: function (data) {
            console.log("error");
            createToast(false, '添加Testcase失敗！')
            Edit_table_btn.classList.add('hidden')
            Save_table_btn.classList.remove('hidden')
            Cancel_table_btn.classList.remove('hidden')
            testplan_testcase_checkbox.forEach(element=>{
                element.disabled = false
            })
        }
    });
}


function _check_all(DOM){
    id = DOM.parentNode.querySelector('#checkbox_id').value
    if (DOM.classList.contains('testcase_check_all') == true){
        class_id = 'testcase_checkbox_'+id.toString()
    }else{
        class_id = 'testplan_checkbox_'+id.toString()
    }
    document.querySelectorAll('.'+class_id).forEach(element=>{
        element.checked=DOM.checked
    })
}
const testrun_table = document.getElementById('teststep_tr_list_savemode')
function _Delete_testcase(DOM){
    testcase_id =  DOM.parentNode.querySelector('#delete_testcase_value').value
    delete_modal_id = 'delete_toggle_'+testcase_id
    testcase_tr = document.getElementById('testcase_row_'+testcase_id)
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['id'] = testcase_id
    data_dict['delete_testcase'] = 'delete_testcase'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function (data) {
            console.log("success");
            $('#'+delete_modal_id).modal('hide');
            testrun_table.removeChild(testcase_tr)
            _Reset_select_testcase(data['testcase_list'])
            createToast(true, '成功刪除Testcase！')
        },
        error: function (data) {
            console.log("error");
            createToast(false, '刪除Testcase失敗！')
        }
    });
    return false
}

function _Delete_testplan(DOM){
    testplan_id =  DOM.parentNode.querySelector('#delete_testplan_value').value
    console.log(testplan_id)
    delete_modal_id = 'delete_TP_toggle_'+testplan_id
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['id'] = testplan_id
    data_dict['delete_testplan'] = 'delete_testplan'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success: function (data) {
            console.log("success");
            $('#'+delete_modal_id).modal('hide');
            createToast(true, '成功刪除Test Plan！')
            window.location= ''
        },
        error: function (data) {
            console.log("error");
            createToast(false, '刪除Test Plan失敗！')
        }
    });
    return false
}

function _Reset_select_testcase(data){
    if (data.length>0){
        $('#select_testcase').append('<option value="'+data[0][0]+'">'+data[0][1]+'</option>');
        $('#select_testcase').selectpicker("refresh");
    }
}
