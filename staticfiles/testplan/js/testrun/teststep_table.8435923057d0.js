const Edit_teststep_btn = document.getElementById('Edit_teststep_btn')
const Save_teststep_btn = document.getElementById('Save_teststep_btn')
const Cancel_teststep_btn = document.getElementById('Cancel_teststep_btn')
const loading_save_teststep = document.getElementById('loading_save_teststep')
const teststep_tr_list_savemode = document.getElementById('teststep_tr_list_savemode')
const pass_all_div = document.getElementById('pass_all_div')
function _Edit_teststep(DOM){
    // 更改按鈕狀態
    Edit_teststep_btn.classList.add('hidden')
    // 更改桌面狀態
    teststep_tr_list_savemode.querySelectorAll('.ckeditor_replace').forEach(ckeditor_element=>{
        CKEDITOR.replace(ckeditor_element);
        temp = ckeditor_element.parentNode
    })
    teststep_tr_list_savemode.querySelectorAll('.gradient_teststep_list').forEach(element=>{
        element.querySelector('#status').classList.add('hidden')
        element.querySelector('#edit_status').classList.remove('hidden')
    })
    status_to_edit_status()
    // wait unitl exist
    var checkExist = setInterval(function() {
        if (temp.querySelector('.cke_reset')) {
            Save_teststep_btn.classList.remove('hidden')
            Cancel_teststep_btn.classList.remove('hidden')
            pass_all_div.classList.remove('hidden')
            clearInterval(checkExist);
        }
    }, 100); // check every 100ms
    return false
}


function _Save_teststep(DOM){
    // 顯示狀態按鈕
    Save_teststep_btn.classList.add('hidden')
    Cancel_teststep_btn.classList.add('hidden')
    pass_all_div.classList.add('hidden')
    // 更改桌面狀態
    var ckeditor_replcae_list = teststep_tr_list_savemode.querySelectorAll('.ckeditor_replace')
    ckeditor_replcae_list.forEach(ckeditor_replcae_element=>{
        ckeditor_id = ckeditor_replcae_element.parentNode.querySelector('.cke_chrome').id
        ckeditor_id = ckeditor_id.replace('cke_','')
        ckeditor_data = CKEDITOR.instances[ckeditor_id].getData()
        ckeditor_replcae_element.innerHTML = ckeditor_data
        CKEDITOR.instances[ckeditor_id].destroy(true);
    })
    teststep_tr_list_savemode.querySelectorAll('.gradient_teststep_list').forEach(element=>{
        // hide
        element.querySelector('#status').classList.remove('hidden')
        element.querySelector('#edit_status').classList.add('hidden')
        // 同步結果
        element.querySelectorAll('#edit_status > input').forEach(status_element=>{
            if (status_element.checked==true){
                temp_id = status_element.id
                temp_id_list = temp_id.split('-')
                temp_status = temp_id_list[temp_id_list.length-1]
                temp_status_id = element.querySelector('#status > .btn-check').id
                temp_status_html = `<input type="radio" class="btn-check" name="${temp_status_id}" id="${temp_status_id}" autocomplete="off" checked >`
                if (temp_status=='Passed'){
                    temp_status_html+= `<button id="show-status-label" class="btn btn-outline-success testrun_status" for="${temp_status_id}" style="--bs-btn-disabled-opacity:1" disabled>Passed</button>`
                }else if (temp_status=='Incomplete'){
                    if (check_pass_checkbox_bool = document.getElementById('fill_passed').checked==true){
                        temp_status_html+= `<button id="show-status-label" class="btn btn-outline-success testrun_status" for="${temp_status_id}" style="--bs-btn-disabled-opacity:1" disabled>Passed</button>`
                    }else{
                        temp_status_html+= `<button id="show-status-label" class="btn btn-outline-warning testrun_status" for="${temp_status_id}" style="--bs-btn-disabled-opacity:1" disabled>Incomplete</button>`
                    }
                }else if (temp_status=='Failed'){
                    temp_status_html+= `<button id="show-status-label" class="btn btn-outline-danger testrun_status" for="${temp_status_id}" style="--bs-btn-disabled-opacity:1" disabled>Failed</button>`
                }else if (temp_status=='Blocked'){
                    temp_status_html+= `<button id="show-status-label" class="btn btn-outline-block testrun_status" for="${temp_status_id}" style="--bs-btn-disabled-opacity:1" disabled>Blocked</button>`
                }else if (temp_status=='Omitted'){
                    temp_status_html+= `<button id="show-status-label" class="btn btn-outline-omitt testrun_status" for="${temp_status_id}" style="--bs-btn-disabled-opacity:1" disabled>Omitted</button>`
                }
                element.querySelector('#status').innerHTML = temp_status_html
            }
        })
    })
    loading_save_teststep.classList.remove('hidden')
    save_teststep_todjango()
    // reset table height
    JCLRgrip_list  = document.querySelectorAll('.JCLRgrip')
    JCLRgrip_list.forEach(element=>{
        element.style.height = ($('#teststepview_table').height()).toString()+'px'
    })
    
    
    
    return false
}

function _Cancel_teststep(DOM){
    // 顯示狀態按鈕
    Save_teststep_btn.classList.add('hidden')
    Cancel_teststep_btn.classList.add('hidden')
    Edit_teststep_btn.classList.remove('hidden')
    pass_all_div.classList.add('hidden')
    // 更改桌面狀態
    // destory table ckeditor
    teststep_tr_list_savemode.querySelectorAll('.cke_chrome').forEach(element=>{
        data = element.id.replaceAll('cke_','')
        CKEDITOR.instances[data].destroy(true);
    })

    teststep_tr_list_savemode.querySelectorAll('.gradient_teststep_list').forEach(element=>{
        element.querySelector('#status').classList.remove('hidden')
        element.querySelector('#edit_status').classList.add('hidden')
    })
    status_to_edit_status()
    JCLRgrip_list  = document.querySelectorAll('.JCLRgrip')
    JCLRgrip_list.forEach(element=>{
        element.style.height = ($('#teststepview_table').height()).toString()+'px'
    })
    return false
}


function status_to_edit_status(){
    teststep_tr_list_savemode.querySelectorAll('.gradient_teststep_list').forEach(element=>{
        temp_status = element.querySelector('#status > #show-status-label').innerHTML
        temp_status_id_list = element.querySelector('#status > .btn-check ').id.split('-')
        temp_status_id = temp_status_id_list[temp_status_id_list.length-1]
        temp_edit_status_html = ``
        if (temp_status=='Passed'){
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Passed" autocomplete="off" checked>
            <label class="btn btn-outline-success testrun_status" for="id-status-${temp_status_id}-Passed">Passed</label>`
        }else{
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Passed" autocomplete="off">
            <label class="btn btn-outline-success testrun_status" for="id-status-${temp_status_id}-Passed">Passed</label>`
        }
        if (temp_status=='Failed'){
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Failed" autocomplete="off" checked>
            <label class="btn btn-outline-danger testrun_status" for="id-status-${temp_status_id}-Failed">Failed</label>`
        }else{
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Failed" autocomplete="off">
            <label class="btn btn-outline-danger testrun_status" for="id-status-${temp_status_id}-Failed">Failed</label>`
        }
        if (temp_status=='Incomplete'){
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Incomplete" autocomplete="off" checked>
            <label class="btn btn-outline-warning testrun_status" for="id-status-${temp_status_id}-Incomplete">Incomplete</label>`
        }else{
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Incomplete" autocomplete="off">
            <label class="btn btn-outline-warning testrun_status" for="id-status-${temp_status_id}-Incomplete">Incomplete</label>`
        }
        if (temp_status=='Blocked'){
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Blocked" autocomplete="off" checked>
            <label class="btn btn-outline-block testrun_status" for="id-status-${temp_status_id}-Blocked">Blocked</label>`
        }else{
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Blocked" autocomplete="off">
            <label class="btn btn-outline-block testrun_status" for="id-status-${temp_status_id}-Blocked">Blocked</label>`
        }
        if (temp_status=='Omitted'){
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Omitted" autocomplete="off" checked>
            <label class="btn btn-outline-omitt testrun_status" for="id-status-${temp_status_id}-Omitted">Omitted</label>`
        }else{
            temp_edit_status_html+=`
            <input type="radio" class="btn-check" name="id-option-${temp_status_id}" id="id-status-${temp_status_id}-Omitted" autocomplete="off">
            <label class="btn btn-outline-omitt testrun_status" for="id-status-${temp_status_id}-Omitted">Omitted</label>`
        }
        element.querySelector('#edit_status').innerHTML = temp_edit_status_html
    })
}

function save_teststep_todjango(){
    var csrftoken = getCookie('csrftoken');
    data_dict={}
    // outcome-number,status-number
    document.querySelectorAll('.gradient_teststep_list').forEach(element=>{
        number_data = element.querySelector('#number').innerHTML
        outcome_data = element.querySelector('#outcome > .ckeditor_replace').innerHTML
        outcome_data = outcome_data.replaceAll('<br>', '<br />').replaceAll('<p>','').replaceAll('</p>','').replaceAll(/\n/g, '')
        status_data = element.querySelector('#status > #show-status-label').innerHTML
        data_dict['outcome-'+number_data] = outcome_data
        data_dict['status-'+number_data] = status_data
    })
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_teststep'] = 'save_teststep';
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function(data) {
            console.log("success");
            _Refresh_progress_bar(data)
            // save teststep to django
            loading_save_teststep.classList.add('hidden')
            Edit_teststep_btn.classList.remove('hidden')
            createToast(true, '成功儲存變更！')
        },
        error: function(data) {
            console.log("error");
            loading_save_teststep.classList.add('hidden')
            Save_teststep_btn.classList.remove('hidden')
            Cancel_teststep_btn.classList.remove('hidden')
            createToast(false, '儲存變更失敗！')
        }
    });
}


function _Refresh_progress_bar(data){
    var progress_id_div = document.getElementById('progress_id')
    var templist = data['temp_value_list']
    pass_per = templist[1]/templist[5]*100
    fail_per = templist[2]/templist[5]*100
    block_per = templist[3]/templist[5]*100
    omitt_per = templist[4]/templist[5]*100
    incomplete_per = templist[0]/templist[5]*100
    finish_per = (templist[6]/templist[5]).toFixed(0)
    progress_id_div.innerHTML = `
    <div class="progress mb-3" style="float:left; width:80%;transform: translateY(4px)">
        <div class="progress-bar pass" role="progressbar" style="width: ${pass_per.toString()}%" aria-valuenow="${templist[1].toString()}" aria-valuemin="0" aria-valuemax="${templist[5].toString()}">${templist[1].toString()}</div>
        <div class="progress-bar fail" role="progressbar" style="width: ${fail_per.toString()}%" aria-valuenow="${templist[2].toString()}" aria-valuemin="0" aria-valuemax="${templist[5].toString()}">${templist[2].toString()}</div>
        <div class="progress-bar block" role="progressbar" style="width: ${block_per.toString()}%" aria-valuenow="${templist[3].toString()}" aria-valuemin="0" aria-valuemax="${templist[5].toString()}">${templist[3].toString()}</div>
        <div class="progress-bar omitted" role="progressbar" style="width:${omitt_per.toString()}%" aria-valuenow="${templist[4].toString()}" aria-valuemin="0" aria-valuemax="${templist[5].toString()}">${templist[4].toString()}</div>
        <div class="progress-bar incomplete" role="progressbar" style="width: ${incomplete_per.toString()}%" aria-valuenow="${templist[0].toString()}" aria-valuemin="0" aria-valuemax="${templist[5].toString()}">${templist[0].toString()}</div>
    </div>
    <div style="float:right; width:20%">
        <span>&nbsp&nbsp&nbsp${finish_per.toString()}%</span>
    </div>
    `
    var save_testcase_status_container = document.getElementById('save_testcase_status')
    save_testcase_status_container.innerHTML = `狀態: `
    status_data = data['status']
    if (status_data == 'Ongoing'){
        save_testcase_status_container.innerHTML +=`<button type="button" class="btn btn-sm btn-primary" style="--bs-btn-disabled-opacity:1" disabled>進行中</button>`
    }else if (status_data == 'Passed'){
        save_testcase_status_container.innerHTML +=`<button type="button" class="btn btn-sm btn-success" style="--bs-btn-disabled-opacity:1" disabled>PASS</button>`
    }else if (status_data == 'Failed'){
        save_testcase_status_container.innerHTML +=`<button type="button" class="btn btn-sm btn-danger" style="--bs-btn-disabled-opacity:1" disabled>FAIL</button>`
    }else if (status_data == 'Incomplete'){
        save_testcase_status_container.innerHTML +=`<button type="button" class="btn btn-sm btn-secondary" style="--bs-btn-disabled-opacity:1" disabled>未開始</button>`
    }
    var save_last_edit_time = document.getElementById('save_last_edit_time')
    var last_time = data['last_time']
    last_time = dateFormat(last_time,'yyyy-MM-dd hh:mm:ss')
    save_last_edit_time.innerHTML=`上次更新:
    ${last_time}
    `
}

function dateFormat(inputDate, format) {
    //parse the input date
    const date = new Date(inputDate);

    //extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();    
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second  = date.getSeconds()
    //replace the month
    format = format.replace("MM", month.toString().padStart(2,"0"));        

    //replace the year
    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2,2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2,"0"));
    // replace the time
    format = format.replace("hh" , hour.toString().padStart(2,"0"))
    format = format.replace("mm" , minute.toString().padStart(2,"0"))
    format = format.replace("ss" , second.toString().padStart(2,"0"))
    return format;
}


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