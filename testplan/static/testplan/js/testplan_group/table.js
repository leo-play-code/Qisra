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
                console.log("success");
                window.location = '';
            },
            error: function (data) {
                console.log("error");
                createToast(false, '添加Testcase失敗！')
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