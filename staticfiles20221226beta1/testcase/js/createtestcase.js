//  error import excel msg
const error_upload_blank_msg = document.getElementById('error_upload_blank_msg')
const error_upload_fail_msg = document.getElementById('error_upload_fail_msg')
const error_title_fail_msg = document.getElementById('error_title_fail_msg')
const error_file_fail_msg = document.getElementById('error_file_fail_msg')
const error_class_list = document.querySelectorAll('.error_msg')

// teststep button
var add_teststepform = document.getElementById('add_teststepform')
add_teststepform.addEventListener('click', AddTeststep)
CKEDITOR.editorConfig = function (config) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-'],
        ['Image'],
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['Undo', 'Redo', 'lineheight'],
    ];
    // config.width = 670;
    config.height = 180;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;
};
function AddTeststep(event) {
    try {
        event.preventDefault()
    } catch { }
    // detect the biggest number
    var max_number = 0
    var teststep_tr_list_sample_list = document.querySelectorAll('.gradient_teststep_list')
    teststep_tr_list_sample_list.forEach(element=>{
        if (max_number<parseInt(element.id.replace('teststep_tr_list-',''))){
            max_number = parseInt(element.id.replace('teststep_tr_list-',''))
        }
    })



    var teststep_tr_list = document.getElementById('teststep_tr_list').cloneNode(true)
    var formset_teststep = document.getElementById('formset-teststep')
    var length_teststep_list = document.getElementsByClassName('gradient_teststep_list').length
    teststep_tr_list.setAttribute('class', 'gradient_teststep_list')
    teststep_tr_list.setAttribute('id', 'teststep_tr_list-' + (max_number+1).toString())
    // description
    // teststep_tr_list.querySelector('#description >#id_description').setAttribute('id', 'id_teststep_set-' + String(length_teststep_list) + '-description')
    editorId_description = 'id_teststep_set-' + String(max_number+1) + '-description'
    teststep_tr_list.querySelector('#description > .django-ckeditor-widget > #id_description').setAttribute('id', editorId_description)
    delete_description_main = teststep_tr_list.querySelector('#description > .django-ckeditor-widget')
    temp = teststep_tr_list.querySelector('#description > .django-ckeditor-widget > #cke_id_description')
    delete_description_main.removeChild(temp)
    // condition 
    editorId_condition = 'id_teststep_set-' + String(max_number+1) + '-condition'
    teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #id_condition').setAttribute('id', editorId_condition)
    delete_condition_main = teststep_tr_list.querySelector('#condition > .django-ckeditor-widget')
    temp = teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #cke_id_condition')
    delete_condition_main.removeChild(temp)
    // remark
    editorId_remark = 'id_teststep_set-' + String(max_number+1) + '-remark'
    teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #id_remark').setAttribute('id', editorId_remark)
    delete_remark_main = teststep_tr_list.querySelector('#remark > .django-ckeditor-widget')
    temp = teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #cke_id_remark')
    delete_remark_main.removeChild(temp)

    // delete button 
    teststep_tr_list.querySelector('#number').innerHTML += `
    <button type="button" class="btn add-teststep-up"><img src='/static/images/arrow-90deg-up.svg'></button>
    <br>
    <br>
    <br>
    <br><button type="button" style="color:red" class="btn delete-teststep"><img src='/static/images/trash.svg'></button>
    <br>
    <br>
    <br>
    <br><button type="button" class="btn add-teststep-down"><img src='/static/images/arrow-90deg-down.svg'></button>
    `
    formset_teststep.append(teststep_tr_list)
    var delete_teststep_button = document.getElementsByClassName('delete-teststep')[length_teststep_list]
    delete_teststep_button.addEventListener('click', (function (item) {
        return function (e) {
            e.preventDefault()
            delete_teststep(item)
        }
    })(max_number+1))

    var addteststepup = document.getElementsByClassName('add-teststep-up')[length_teststep_list]
    addteststepup.addEventListener('click', (function (item) {
        return function (e) {
            e.preventDefault()
            add_up(item)
        }
    })(max_number+1))
    var addteststepdwown = document.getElementsByClassName('add-teststep-down')[length_teststep_list]
    addteststepdwown.addEventListener('click', (function (item) {
        return function (e) {
            e.preventDefault()
            add_down(item)
        }
    })(max_number+1))
    CKEDITOR.replace(editorId_description,
        {
            removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                }
            }
        })
    CKEDITOR.replace(editorId_condition,
        {
            removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                }
            }
        })
    CKEDITOR.replace(editorId_remark,
        {
            removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                }
            }
        })
    show_addteststep_btn()
}

function delete_teststep(num) {
    var formset_teststep = document.getElementById('formset-teststep')
    var delete_teststep_target = formset_teststep.querySelector('#teststep_tr_list-' + num.toString())
    formset_teststep.removeChild(delete_teststep_target)
    show_addteststep_btn()
}


function add_up(num) {
    var orignal_teststep = document.getElementById('teststep_tr_list-' + num.toString())
    AddTeststep()
    var length_teststep_list = document.getElementsByClassName('gradient_teststep_list').length - 1
    var new_teststep = document.getElementsByClassName('gradient_teststep_list')[length_teststep_list]
    var parentDiv = new_teststep.parentNode;
    parentDiv.insertBefore(new_teststep, orignal_teststep)
    new_teststep.scrollIntoView({ block: "center" });
}

function add_down(num) {
    var orignal_teststep = document.getElementById('teststep_tr_list-' + num.toString())
    AddTeststep()
    var length_teststep_list = document.getElementsByClassName('gradient_teststep_list').length - 1
    var new_teststep = document.getElementsByClassName('gradient_teststep_list')[length_teststep_list]
    insertAfter(new_teststep, orignal_teststep)
    new_teststep.scrollIntoView({ block: "center" });
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}


function show_addteststep_btn() {
    var add_teststepform = document.getElementById('add_teststepform')
    var length_teststep_list = document.getElementsByClassName('gradient_teststep_list').length
    if (length_teststep_list == 0) {
        add_teststepform.classList.remove("hidden");
    } else {
        add_teststepform.classList.add("hidden");
    }
}



var loading_img = document.getElementById('loading_img')
// button 匯入 Testcase
var import_testcase_btn = document.getElementById('upload_testcase_btn')

import_testcase_btn.addEventListener('click', function (e) {
    e.preventDefault()
    bool_ajax = true
    error_upload_fail_msg.classList.add('hidden')
    var filedata = $('#id_file')[0].files[0]
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
        fd.append('upload_testcase_btn', 'upload_testcase_btn')
        $.ajax({
            url: '',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            beforeSend: function () {
                $("#upload_testcase_btn").hide();
                loading_img.classList.remove('hidden')
            },
            complete: function () {
                $("#upload_testcase_btn").show();
                loading_img.classList.add('hidden')
            },
            success: function (data) {
                choose_sheet(data)
            },
            error: function (data) {
                console.log('error')
                error_upload_fail_msg.classList.remove('hidden')
            }
        });
    }

})
var choose_sheet_body = document.getElementById('choose_sheet_body')
// upload finish code 
function choose_sheet(data, path, name) {
    var sheet_option = data['sheet_list']
    var path = data['filepath']
    var name = data['testcase_name']
    var upload_div = document.querySelectorAll('.upload_div')
    upload_div.forEach(element => {
        element.classList.add('hidden')
    });

    temp = `<select class="form-select" aria-label="Default select example"  style="float: right;" id="select_sheet">`
    for (num in sheet_option) {
        temp += `
        <option value="${sheet_option[num]}">${sheet_option[num]}</option>
        `
    }
    temp += `</select>`
    choose_sheet_body.innerHTML = temp
    choose_sheet_body.innerHTML += `
    <input type="hidden" id="filepath" value=${path}>
    <input type="hidden" id="testcase_name" value="${name}">
    `
    var choose_sheet_div = document.querySelectorAll('.choose_sheet_div')
    choose_sheet_div.forEach(element => {
        element.classList.remove('hidden')
    });
}

// upload_sheet_btn
var upload_sheet_btn = document.getElementById('upload_sheet_btn')
upload_sheet_btn.addEventListener('click', function (e) {
    e.preventDefault()
    error_title_fail_msg.classList.add('hidden')
    var select_sheet = document.getElementById('select_sheet')
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['select_sheet'] = select_sheet.value;
    data_dict['filepath'] = document.getElementById('filepath').value
    data_dict['get_sheetname'] = 'get_sheetname'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        beforeSend: function () {
            $("#upload_sheet_btn").hide();
            loading_img.classList.remove('hidden')
        },
        complete: function () {
            $("#upload_sheet_btn").show();
            loading_img.classList.add('hidden')
        },
        success: function (data) {
            console.log("success", data);
            accurate_title(data)
        },
        error: function (data) {
            console.log("error", 'tile');
            error_title_fail_msg.classList.remove('hidden')
        }
    });
})
var accurate_title_body = document.getElementById('accurate_title')
var import_testcase_toggle = document.getElementById('import_testcase_toggle')
function accurate_title(data) {
    var sheet_name = data['sheet_name']
    var count_header = data['count_header']
    try {
        document.getElementById('sheet_name').value = sheet_name
        document.getElementById('count_header').value = count_header
    } catch {
        choose_sheet_body.innerHTML += `
        <input type="hidden" id="sheet_name" value="${sheet_name}">
        <input type="hidden" id="count_header" value="${count_header}">
        `
    }

    var choose_sheet_div = document.querySelectorAll('.choose_sheet_div')
    choose_sheet_div.forEach(element => {
        element.classList.add('hidden')
    });

    accurate_title_body.innerHTML = ``
    title_list_title = data['title_list_title']
    title_list = data['title_list']
    temp = ``
    for (title_title in title_list_title) {
        temp += ` <td><select id=${title_list_title[title_title][1]}_title>`
        for (title in title_list) {
            if (title_list_title[title_title][2] == title_list[title][1]) {
                temp += `<option value="${title_list[title]}" selected>${title_list[title][1]}</option> `
            } else {
                temp += `<option value="${title_list[title]}">${title_list[title][1]}</option> `
            }
        }
    }
    accurate_title_body.innerHTML = temp
    import_testcase_toggle.classList.add('modal-lg')
    var accurate_title_div = document.querySelectorAll('.accurate_title_div')
    accurate_title_div.forEach(element => {
        element.classList.remove('hidden')
    });
}

var upload_title_btn = document.getElementById('upload_title_btn')
upload_title_btn.addEventListener('click', function (e) {
    error_file_fail_msg.classList.add('hidden')
    e.preventDefault()
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['sheet_name'] = document.getElementById('sheet_name').value;
    data_dict['filepath'] = document.getElementById('filepath').value
    data_dict['testcase_name'] = document.getElementById('testcase_name').value
    data_dict['count_header'] = document.getElementById('count_header').value
    data_dict['number'] = document.getElementById('number_title').value.split(",")
    data_dict['description'] = document.getElementById('description_title').value.split(",")
    data_dict['condition'] = document.getElementById('condition_title').value.split(",")
    data_dict['remark'] = document.getElementById('remark_title').value.split(",")
    console.log(data_dict)
    data_dict['save_data'] = 'save_data'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        beforeSend: function () {
            $("#upload_title_btn").hide();
            loading_img.classList.remove('hidden')
        },
        complete: function () {
            $("#upload_title_btn").show();
            loading_img.classList.add('hidden')
        },
        success: function (data) {
            console.log("success");
            var input_file = document.getElementById('id_file')
            input_file.value = ''
            _Put_data_on_table(data)
        },
        error: function (data) {
            console.log("error");
            error_file_fail_msg.classList.remove('hidden')
        }
    });
})
function _Put_data_on_table(data) {
    var accurate_title_div = document.querySelectorAll('.accurate_title_div')
    accurate_title_div.forEach(element => {
        element.classList.add('hidden')
    });
    import_testcase_toggle.classList.remove('modal-lg')
    var accurate_title_div = document.querySelectorAll('.upload_div')
    accurate_title_div.forEach(element => {
        element.classList.remove('hidden')
    });
    $('#import_testcase_toggle').modal('hide');
    // reset all 
    var teststep_length = document.getElementsByClassName('gradient_teststep_list').length
    for (i = 0; i < teststep_length; i++) {
        delete_teststep(i)
    }

    // put data into create testcasepage
    var id_testcasename = document.getElementById('id_testcasename')
    if (id_testcasename.value == ''){
        id_testcasename.value = document.getElementById('testcase_name').value
    }
        
    data_list = data['data_list']
    for (num in data_list) {
        _Add_exists_teststep(num, data_list[num])
    }
    createToast(true, '成功匯入Testcase！')
    show_addteststep_btn()
}




function _Add_exists_teststep(num, data_list) {
    var teststep_tr_list = document.getElementById('teststep_tr_list').cloneNode(true)
    var formset_teststep = document.getElementById('formset-teststep')
    var length_teststep_list = document.getElementsByClassName('gradient_teststep_list').length
    teststep_tr_list.setAttribute('class', 'gradient_teststep_list')
    teststep_tr_list.setAttribute('id', 'teststep_tr_list-' + length_teststep_list.toString())
    // description
    // teststep_tr_list.querySelector('#description >#id_description').setAttribute('id', 'id_teststep_set-' + String(length_teststep_list) + '-description')
    editorId_description = 'id_teststep_set-' + String(length_teststep_list) + '-description'
    teststep_tr_list.querySelector('#description > .django-ckeditor-widget > #id_description').setAttribute('id', editorId_description)
    delete_description_main = teststep_tr_list.querySelector('#description > .django-ckeditor-widget')
    temp = teststep_tr_list.querySelector('#description > .django-ckeditor-widget > #cke_id_description')
    delete_description_main.removeChild(temp)
    // condition 
    editorId_condition = 'id_teststep_set-' + String(length_teststep_list) + '-condition'
    teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #id_condition').setAttribute('id', editorId_condition)
    delete_condition_main = teststep_tr_list.querySelector('#condition > .django-ckeditor-widget')
    temp = teststep_tr_list.querySelector('#condition > .django-ckeditor-widget > #cke_id_condition')
    delete_condition_main.removeChild(temp)
    // remark
    editorId_remark = 'id_teststep_set-' + String(length_teststep_list) + '-remark'
    teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #id_remark').setAttribute('id', editorId_remark)
    delete_remark_main = teststep_tr_list.querySelector('#remark > .django-ckeditor-widget')
    temp = teststep_tr_list.querySelector('#remark > .django-ckeditor-widget > #cke_id_remark')
    delete_remark_main.removeChild(temp)
    // delete button 
    teststep_tr_list.querySelector('#number').innerHTML += `
    <button type="button" class="btn add-teststep-up"><img src='/static/images/arrow-90deg-up.svg'></button>
    <br>
    <br>
    <br>
    <br><button type="button" style="color:red" class="btn delete-teststep"><img src='/static/images/trash.svg'></button>
    <br>
    <br>
    <br>
    <br><button type="button" class="btn add-teststep-down"><img src='/static/images/arrow-90deg-down.svg'></button>
    `
    formset_teststep.append(teststep_tr_list)
    var delete_teststep_button = document.getElementsByClassName('delete-teststep')[length_teststep_list]
    delete_teststep_button.addEventListener('click', (function (item) {
        return function (e) {
            e.preventDefault()
            delete_teststep(item)
        }
    })(length_teststep_list))
    var addteststepup = document.getElementsByClassName('add-teststep-up')[length_teststep_list]
    addteststepup.addEventListener('click', (function (item) {
        return function (e) {
            e.preventDefault()
            add_up(item)
        }
    })(length_teststep_list))
    var addteststepdwown = document.getElementsByClassName('add-teststep-down')[length_teststep_list]
    addteststepdwown.addEventListener('click', (function (item) {
        return function (e) {
            e.preventDefault()
            add_down(item)
        }
    })(length_teststep_list))
    CKEDITOR.replace(editorId_description,
        {
            removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                }
            }
        })
    CKEDITOR.replace(editorId_condition,
        {
            removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                }
            }
        })
    CKEDITOR.replace(editorId_remark,
        {
            removePlugins: "exportpdf",
            on: {
                instanceReady: function (evt) {
                    evt.editor.document.getBody().setStyles({ color: 'black', 'font-size': '9px', 'font-family': 'Verdana' })
                }
            }
        })
    // var temp_description = document.getElementById('teststep_tr_list-' + length_teststep_list.toString())
    // temp_description.querySelector('#id_teststep_set-' + String(length_teststep_list) + '-description').value = data_list[1]
    temp_description = data_list[1].replaceAll(/\n/g, '</br>')
    temp_condition = data_list[2].replaceAll(/\n/g, '</br>')
    temp_remark = data_list[3].replaceAll(/\n/g, '</br>')
    CKEDITOR.instances[editorId_description].setData(temp_description);
    CKEDITOR.instances[editorId_condition].setData(temp_condition);
    CKEDITOR.instances[editorId_remark].setData(temp_remark);
}

var error_name_msg = document.getElementById('error-name')
var Save_btn = document.getElementById('Save_btn')
Save_btn.addEventListener('click', function (e) {
    e.preventDefault()
    _Save_all()
})
const loading_save_testcase = document.getElementById('loading_save_testcase')
function _Save_all() {

    error_name_msg.classList.add('hidden')
    var testcasename = document.getElementById('id_testcasename').value
    // if testcase name is empty
    console.log('testcasename', testcasename, testcasename.replaceAll(' ', ''))
    if (testcasename.replaceAll(' ', '') == '') {
        error_name_msg.classList.remove('hidden')
        Save_btn.classList.remove('hidden')
        loading_save_testcase.classList.add('hidden')
    } else {
        Save_btn.classList.add('hidden')
        loading_save_testcase.classList.remove('hidden')
        var tag_list = $('#id_tag').val()
        var csrftoken = getCookie('csrftoken');
        data_dict = {}
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        var teststep_length = document.getElementsByClassName('gradient_teststep_list').length
        for (i = 0; i < teststep_length; i++) {
            target_id = document.getElementsByClassName('gradient_teststep_list')[i].id
            target_num = target_id.replaceAll('teststep_tr_list-','')
            var description_data = CKEDITOR.instances['id_teststep_set-' + target_num + '-description'].getData()
            var condition_data = CKEDITOR.instances['id_teststep_set-' + target_num + '-condition'].getData()
            var remark_data = CKEDITOR.instances['id_teststep_set-' + target_num + '-remark'].getData()
            data_dict['id_teststep_set-' + target_num + '-description'] = description_data.replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
            data_dict['id_teststep_set-' + target_num + '-condition'] = condition_data.replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
            data_dict['id_teststep_set-' + target_num + '-remark'] = remark_data.replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        }
        data_dict['name'] = testcasename
        data_dict['tag_list[]'] = tag_list
        data_dict['save_testcase'] = 'save_testcase'
        data_dict['content'] = CKEDITOR.instances['content'].getData().replaceAll(/\n/g, '').replaceAll('<p>', '').replaceAll('</p>', '<br>')
        console.log(data_dict)
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success: function (data) {
                console.log("success pk = ", data);
                
                if (data['error']){
                    Save_btn.classList.remove('hidden')
                    loading_save_testcase.classList.add('hidden')
                    createToast(false, '此名稱已存在！')
                }else{
                    window.location = '/testcase/' + data['pk'] + '/teststep/';
                }
                
            },
            error: function (data) {
                console.log("error");
                Save_btn.classList.remove('hidden')
                loading_save_testcase.classList.add('hidden')
                createToast(false, '檔案格式內容有不符合的格式或內容')
            }
        });
    }
}

var create_testcase_table = document.getElementById('create_testcase_table')
var fullscreen_btn = document.getElementById('fullscreen')
var smallscreen_btn = document.getElementById('smallscreen')
fullscreen_btn.addEventListener('click', function (e) {
    e.preventDefault()
    fullscreen_btn.classList.add('hidden')
    smallscreen_btn.classList.remove('hidden')
    create_testcase_table.classList.remove('create_testcase_table', 'tableFixHead')
})
smallscreen_btn.addEventListener('click', function (e) {
    e.preventDefault()
    fullscreen_btn.classList.remove('hidden')
    smallscreen_btn.classList.add('hidden')
    create_testcase_table.classList.add('create_testcase_table', 'tableFixHead')
})


// import excel last page
const last_page_btn = document.getElementById('last_page_btn')
last_page_btn.addEventListener('click', function (e) {
    e.preventDefault()
    var choose_sheet_div = document.getElementsByClassName('choose_sheet_div')[0]
    var accurate_title_div = document.getElementsByClassName('accurate_title_div')[0]
    var upload_div = document.getElementsByClassName('upload_div')[0]
    if (!choose_sheet_div.classList.contains('hidden')) {
        var input_file = document.getElementById('id_file')
        input_file.value = ''
        var choose_sheet_div = document.querySelectorAll('.choose_sheet_div')
        choose_sheet_div.forEach(element => {
            element.classList.add('hidden')
        });
        var upload_div = document.querySelectorAll('.upload_div')
        upload_div.forEach(element => {
            element.classList.remove('hidden')
        });
    } else if (!accurate_title_div.classList.contains('hidden')) {
        var accurate_title_div = document.querySelectorAll('.accurate_title_div')
        accurate_title_div.forEach(element => {
            element.classList.add('hidden')
        });
        var choose_sheet_div = document.querySelectorAll('.choose_sheet_div')
        choose_sheet_div.forEach(element => {
            element.classList.remove('hidden')
        });
    } else if (!upload_div.classList.contains('hidden')) {
        $('#import_testcase_toggle').modal('hide');
        var input_file = document.getElementById('id_file')
        input_file.value = ''
    }
    import_testcase_toggle.classList.remove('modal-lg')

})

// cancel import excel
const cancel_import_btn = document.getElementById('cancel_import')
cancel_import_btn.addEventListener('click', function (e) {
    e.preventDefault()
    _reset_import()

})

// close_import_modal
const close_import_modal = document.getElementById('close_import_modal')
close_import_modal.addEventListener('click', function (e) {
    _reset_import()
})


function _reset_import() {
    var choose_sheet_div = document.querySelectorAll('.choose_sheet_div')
    choose_sheet_div.forEach(element => {
        element.classList.add('hidden')
    });
    var accurate_title_div = document.querySelectorAll('.accurate_title_div')
    accurate_title_div.forEach(element => {
        element.classList.add('hidden')
    });
    import_testcase_toggle.classList.remove('modal-lg')
    var upload_div = document.querySelectorAll('.upload_div')
    upload_div.forEach(element => {
        element.classList.remove('hidden')
    });
    error_class_list.forEach(element => {
        element.classList.add('hidden')
    })
    $('#import_testcase_toggle').modal('hide');
    var input_file = document.getElementById('id_file')
    input_file.value = ''
}

