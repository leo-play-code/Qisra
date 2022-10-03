const dropdown_btn_list = document.querySelectorAll('.dropdown_btn')
dropdown_btn_list.forEach(element=>{
    element.addEventListener('click',function(e){
        if (element.style.transform == "rotate(-90deg)"){
            element.style.transform = "rotate(0deg)";
        }else{
            element.style.transform = "rotate(-90deg)";
        }
    })
})

CKEDITOR.editorConfig = function( config ) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold','Italic','Underline','Strike','-'],
        ['Image'],
        ['Styles','Format','Font','FontSize'],

        ['TextColor','BGColor'],
        ['Undo','Redo']
    ];
    config.height = 180;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;

};
// loading images
const loading_save_info = document.getElementById('loading_save_info')
const loading_save_second = document.getElementById('loading_save_second')
const loading_save_teststep = document.getElementById('loading_save_teststep')


const pass_all_div = document.getElementById('pass_all_div')
const edit_save_div_teststep = document.getElementById('edit-save-div-teststep')
//Edit button
var EditButton = document.getElementById('edit_teststep')
EditButton.addEventListener('click',function(e){
    e.preventDefault()
    EditMode()
    
    
})
function EditMode(){  
    edit_save_div_teststep.innerHTML = `
        <button type="submit" class="btn btn-success" id="save_teststep" name="save_teststep">儲存結果</button>
    `
    var SaveButton = document.getElementById('save_teststep')
    SaveButton.addEventListener('click',function(e){
        e.preventDefault()
        SaveButton.classList.add('hidden')
        loading_save_teststep.classList.remove('hidden')
        save_teststep_todjango()
    })
    // teststep edit-mode
    pass_all_div.classList.remove('hidden')
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','hidden')
}
function SaveMode(){
    pass_all_div.classList.add('hidden')
    edit_save_div_teststep.innerHTML = `
        <button type="submit" class="btn btn-primary" id="edit_teststep" name="edit_teststep">更改結果</button>
    `
    var EditButton = document.getElementById('edit_teststep')
    EditButton.addEventListener('click',function(e){
        e.preventDefault()
        EditMode()
    })
    // change table to new data
    var teststep_tr_list_sample = document.getElementsByClassName('teststep_tr_list_sample').length
    check_pass_checkbox_bool = document.getElementById('fill_passed').checked
    for (i=0;i<teststep_tr_list_sample;i+=1){
        status_data=document.getElementsByClassName('teststep_tr_list_sample')[i].querySelector('#status').querySelector('input[name="id-option-'+(i+1).toString()+'"]:checked').id;
        var outcome_data = CKEDITOR.instances['id_testrun_teststep_set-'+i.toString()+'-actual_outcome'].getData().replace(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
        document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#outcome').innerHTML = `${outcome_data.replaceAll(/(\r\n|\n|\r)/gm, "").replaceAll('<p>&nbsp;</p>','')}`
        if(status_data.includes('pass')){
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').className = "btn btn-outline-success testrun_status";
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').innerHTML = `Passed`
        }else if (status_data.includes('fail')){
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').className = "btn btn-outline-danger testrun_status";
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').innerHTML = `Failed`
        }else if(status_data.includes('incomplete')){
            if (check_pass_checkbox_bool == true) {
                document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').className = "btn btn-outline-success testrun_status";
                document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').innerHTML = `Passed`
            }else{
                document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').className = "btn btn-outline-warning testrun_status";
                document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').innerHTML = `Incomplete`
            }
        }else if(status_data.includes('block')){
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').className = "btn btn-outline-block testrun_status";
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').innerHTML = `Blocked`
        }else if(status_data.includes('omitt')){
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').className = "btn btn-outline-omitt testrun_status";
            document.getElementsByClassName('gradient_teststep_list')[i].querySelector('#status > #show-status-label').innerHTML = `Omitted`
        }
    }   
    //save mode
    var teststep_tr_list_edit = document.getElementById('teststep_tr_list_editmode')
    teststep_tr_list_edit.setAttribute('class','hidden')
    var teststep_tr_list_save = document.getElementById('teststep_tr_list_savemode')
    teststep_tr_list_save.setAttribute('class','')
    // reset height table
    JCLRgrip_list  = document.querySelectorAll('.JCLRgrip')
    JCLRgrip_list.forEach(element=>{
        element.style.height = ($('#teststepview_table').height()).toString()+'px'
    })
}




function save_teststep_todjango(){
    check_pass_checkbox_bool = document.getElementById('fill_passed').checked
    var csrftoken = getCookie('csrftoken');
    data_dict={}
    var teststep_tr_list_sample = document.getElementsByClassName('teststep_tr_list_sample').length
    for (i=0;i<teststep_tr_list_sample;i+=1){
        var outcome_data = CKEDITOR.instances['id_testrun_teststep_set-'+i.toString()+'-actual_outcome'].getData().replace(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
        data_dict['outcome-'+(i+1).toString()] = outcome_data
        status_data=document.getElementsByClassName('teststep_tr_list_sample')[i].querySelector('#status').querySelector('input[name="id-option-'+(i+1).toString()+'"]:checked').id;
        if(status_data.includes('pass')){
            data_dict['status-'+(i+1).toString()] = 'Passed'
        }else if (status_data.includes('fail')){
            data_dict['status-'+(i+1).toString()] = 'Failed'
        }else if(status_data.includes('incomplete')){
            if (check_pass_checkbox_bool == true) {
                data_dict['status-' + (i + 1).toString()] = 'Passed'
            }else{
                data_dict['status-' + (i + 1).toString()] = 'Incomplete'
            }
        }else if(status_data.includes('block')){
            data_dict['status-'+(i+1).toString()] = 'Blocked'
        }else if(status_data.includes('omitt')){
            data_dict['status-'+(i+1).toString()] = 'Omitted'
        }
        
    }
    // get testcase tag_list data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_teststep'] = 'save_teststep';
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function(data) {
            console.log("success");
            SaveMode()
            _Refresh_progress_bar(data)
            loading_save_teststep.classList.add('hidden')
        },
        error: function(data) {
            console.log("error");
            var SaveButton = document.getElementById('save_teststep')
            loading_save_teststep.classList.add('hidden')
            SaveButton.classList.remove('hidden')
            
        }
    });


}


const edit_save_div_info = document.getElementById('edit-save-div-info')
var Edit_info_btn = document.getElementById('edit_info')
Edit_info_btn.addEventListener('click',function(e){
    e.preventDefault()
    Edit_info_mode()
})
var save_info_div = document.querySelectorAll('.info_savemode')
var edit_info_div = document.querySelectorAll('.info_editmode')
function Edit_info_mode(){
    edit_save_div_info.innerHTML = `
        <button type="submit" class="btn btn-sm btn-success" id="save_info" name="save_info">Save</button>
    `
    var SaveButton = document.getElementById('save_info')
    SaveButton.addEventListener('click',function(e){
        e.preventDefault()
        SaveButton.classList.add('hidden')
        loading_save_info.classList.remove('hidden')
        save_info_django()
    })
    save_info_div.forEach(element=>{
        element.classList.add('hidden')
    })
    edit_info_div.forEach(element=>{
        element.classList.remove('hidden')
    })

}
const save_name_p = document.getElementById('save_name')
const save_context_div = document.getElementById('save_context')
const save_tag_p = document.getElementById('save_tag')
const save_assign_p = document.getElementById('save_assign')
const testrun_title = document.getElementById('testrun_title')
function Save_info_mode(){
    edit_save_div_info.innerHTML = `
    <button type="submit" class="btn btn-sm btn-danger" id="edit_info" name="edit_info" value="edit_info">Edit</button>
    `
    var EditButton = document.getElementById('edit_info')
    EditButton.addEventListener('click',function(e){
        e.preventDefault()
        Edit_info_mode()
    })
    var assign = $('#edit_assign_select').val()
    var name_data = $('#id_testrunname').val()
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
    var tag_list = $('#id_tag').val()
    testrun_title.innerHTML = `${name_data}`
    save_name_p.innerHTML = `名稱: ${name_data}`
    save_context_div.innerHTML = `${context_data}<br>`
    save_tag_p.innerHTML = `標籤:`
    if (tag_list == null){
        save_tag_p.innerHTML+=` <span>無</span>`
    }else{
        for (item in tag_list){
            save_tag_p.innerHTML+=` <span style="color:#5DADE2;">${tag_list[item]}</span>`
        }
    }
    save_assign_p.innerHTML = `負責人:`
    if (assign == null){  
        save_assign_p.innerHTML += ` 未指派`
    }else{
        for (item in assign){
            if (assign[item] != "None"){
                save_assign_p.innerHTML += ` ${assign[item]}`
            }
        }
        
    }
    save_info_div.forEach(element=>{
        element.classList.remove('hidden')
    })
    edit_info_div.forEach(element=>{
        element.classList.add('hidden')
    })

}
const error_name_msg = document.getElementById('error-name')
function save_info_django(){
    error_name_msg.classList.add('hidden')
    var name_data = $('#id_testrunname').val()
    if (name_data.replaceAll(' ','')== ''){
        error_name_msg.classList.remove('hidden')
        var SaveButton = document.getElementById('save_info')
        loading_save_info.classList.add('hidden')
        SaveButton.classList.remove('hidden')
        
    }else{
        var csrftoken = getCookie('csrftoken');
        data_dict = {}
        var tag_list = $('#id_tag').val()
        var assign = $('#edit_assign_select').val()
        // get testcase tag_list data
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        data_dict['save_info'] = 'save_info';
        data_dict['testcasename'] = name_data
        data_dict['tag_list[]'] = tag_list
        data_dict['assign[]'] = assign
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success: function () {
                console.log("success");
                Save_info_mode()
                loading_save_info.classList.add('hidden')
            },
            error: function (data) {
                console.log("error");
                var SaveButton = document.getElementById('save_info')
                loading_save_info.classList.add('hidden')
                SaveButton.classList.remove('hidden')
                alert('Testcase name has existed')
            }
        });
    }
    
}
var cancel_btn = document.getElementById('cancel_edit')
var dropdown_three_dot = document.getElementById('dropdown_three_dot')
var second_box_save_div = document.getElementById('second-box-save-div')
var second_box_edit_div = document.getElementById('second-box-edit-div')
cancel_btn.addEventListener('click',function(e){
    e.preventDefault()
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.remove('hidden')
    try{
        second_box_edit_btn.classList.add('hidden')
    }catch{
        second_box_save_btn.classList.add('hidden')
    }
    try{
        Edit_info_btn.classList.add('hidden');
    }catch{
        Save_info_btn.classList.add('hidden')
    }
    //save mode
    save_info_div.forEach(element=>{
        element.classList.remove('hidden')
    })
    edit_info_div.forEach(element=>{
        element.classList.add('hidden')
    })
    cancel_btn.classList.add('hidden')
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
})
var edit_all_btn = document.getElementById('edit_all')
edit_all_btn.addEventListener('click',function(e){
    e.preventDefault()
    var Edit_info_btn = document.getElementById('edit_info')
    var Save_info_btn = document.getElementById('save_info')
    var second_box_edit_btn = document.getElementById('second-box-edit')
    var second_box_save_btn = document.getElementById('second-box-save')
    dropdown_three_dot.classList.add('hidden')
    try{
        second_box_edit_btn.classList.remove('hidden')
    }catch{
        second_box_save_btn.classList.remove('hidden')
        second_box_save_div.classList.add('hidden')
        second_box_edit_div.classList.remove('hidden')
    }
    try{
        Edit_info_btn.classList.remove('hidden');
    }catch{
        Save_info_btn.classList.remove('hidden')
        save_info_div.forEach(element=>{
            element.classList.add('hidden')
        })
        edit_info_div.forEach(element=>{
            element.classList.remove('hidden')
        })
    }
    cancel_btn.classList.remove('hidden')
})

//status button 

var testrun_status_block_btn_list = document.querySelectorAll('.testrun_status_block')
testrun_status_block_btn_list.forEach(element =>{
    element.addEventListener('click',function(e){
        e.preventDefault()
    })
})

//second-box
var second_box_edit_save_div = document.getElementById('second-box-edit-save_div')
var second_box_edit_btn = document.getElementById('second-box-edit')
// var second_box_save_btn = document.getElementById('second-box-save')
second_box_edit_btn.addEventListener('click',function(e){
    e.preventDefault()
    _edit_second_box_mode()
})
function _save_second_box_todjango(){
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
    var csrftoken = getCookie('csrftoken');
    data_dict = {}
    data_dict['context'] = context_data
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save_context_data'] = 'save'
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            _save_second_box_mode()
            loading_save_second.classList.add('hidden')
        },
        error: function(data) {
            console.log("error");
            var second_box_save_btn = document.getElementById('second-box-save')
            loading_save_second.classList.add('hidden')
            second_box_save_btn.classList.remove('hidden')
            
        }
    });
    
}
function _edit_second_box_mode(){
    second_box_edit_save_div.innerHTML=`<button type="submit" class="btn btn-sm btn-success" id="second-box-save" name="second-box-save">Save</button>`
    var second_box_save_btn = document.getElementById('second-box-save')
    second_box_save_btn.addEventListener('click',function(e){
        e.preventDefault()
        second_box_save_btn.classList.add('hidden')
        loading_save_second.classList.remove('hidden')
        _save_second_box_todjango()
    })
    second_box_save_div.classList.add('hidden')
    second_box_edit_div.classList.remove('hidden')
}
function _save_second_box_mode(){
    second_box_edit_save_div.innerHTML=`<button type="submit" class="btn btn-sm btn-danger" id="second-box-edit" name="second-box-edit">Edit</button>`
    var second_box_edit_btn = document.getElementById('second-box-edit')
    second_box_edit_btn.addEventListener('click',function(e){
        e.preventDefault()
        _edit_second_box_mode()
    })
    var context_data = CKEDITOR.instances['context'].getData().replace(/\n/g,'').replaceAll('<p>','').replaceAll('</p>','<br>')
    if(context_data == ''){
        save_context_div.classList.add('save_context_no_text')
        save_context_div.classList.remove('save_context_has_text')
        save_context_div.innerHTML = `&nbsp&nbsp&nbsp&nbsp&nbspNo description`
    }else{
        save_context_div.classList.remove('save_context_no_text')
        save_context_div.classList.add('save_context_has_text')
        save_context_div.innerHTML = `${context_data}<br>`
    }
    second_box_save_div.classList.remove('hidden')
    second_box_edit_div.classList.add('hidden')
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
    }else if (status_data == 'Not_start'){
        save_testcase_status_container.innerHTML +=`<button type="button" class="btn btn-sm btn-secondary" style="--bs-btn-disabled-opacity:1" disabled>未開始</button>`
    }
    var save_last_edit_time = document.getElementById('save_last_edit_time')
    var last_time = data['last_time']
    last_time = dateFormat(last_time,'yyyy-MM-dd hh:mm:ss')
    save_last_edit_time.innerHTML=`上次更新:
    ${last_time}
    `
}
// screen full 
var teststepview_table = document.querySelectorAll('.teststepview_table')
var fullscreen_btn = document.getElementById('fullscreen')
var smallscreen_btn = document.getElementById('smallscreen')

if ($('#teststepview_table').height()<1000){
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


//a simple date formatting function
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


//  init table set up 
function Init_teststep_table(){
    // 改為用取代要編輯的就好
    Edit_teststep_list = document.querySelectorAll('.teststep_tr_list_sample')
    Save_teststep_list = document.querySelectorAll('.gradient_teststep_list')
    console.log(Edit_teststep_list.length,Save_teststep_list.length)

    
    Save_teststep_list.forEach(function(item, i) {
        num = i ;
        // save table
        save_tr_dom = item;
        file_td_dom = save_tr_dom.querySelector('#file')
        // edit table
        edit_tr_dom = document.getElementsByClassName('teststep_tr_list_sample')[num]
        edit_file_td_dom = edit_tr_dom.querySelector('#edit_file')
        edit_file_td_dom.innerHTML = ``
        // get btn
        upload_btn = file_td_dom.querySelector('.save_upload_td > .upload_href').innerHTML
        show_btn = file_td_dom.querySelector('.save_upload_td > .show_href').innerHTML
        temp = `
            <div class="row save_upload_td">
                <div class="col upload_href">
                    `
        temp+=upload_btn
        temp+=`
                </div>
                <div class="col show_href">
                    `
        temp+=show_btn
        temp+=`
                </div>
            </div>
        `
        edit_file_td_dom.innerHTML = temp
        // change btn_name and modal_name
    });
}
Init_teststep_table()