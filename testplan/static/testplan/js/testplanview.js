
// csrf token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

// Tag have selected now
var tag_choose_innertext = null
var tag_choose_value = null
var select_tag = document.getElementById('id_tag')
try{
    var tag_choose_value =  select_tag.options[0].value
    var tag_choose_innertext =  select_tag.options[0].text

}catch(e){}
select_tag.addEventListener('change', function handleChange(event) {
    //console.log(event.target.value)
    // 👇️ get selected VALUE even outside event handler
    tag_choose_value = select_tag.options[select_tag.selectedIndex].value
    // 👇️ get selected TEXT in or outside event handler
    tag_choose_innertext = select_tag.options[select_tag.selectedIndex].text
})
// add tag
var tag_list_text = document.getElementById('tag_list_text').value
var id_tag_selected = document.getElementById('id_tag_selected')
tag_list_text = JSON.parse(tag_list_text)
var tag_submit = document.getElementById('add_tag')
tag_submit.addEventListener('click',function(e){
    e.preventDefault()
    
    if (tag_list_text.includes(tag_choose_innertext)==false && tag_choose_value !=null){
        tag_list_text.push(tag_choose_innertext)
    } 
    document.getElementById('tag_list_text').value = tag_list_text

    //show tag have selected
    id_tag_selected.innerHTML = ''
    for (var i in tag_list_text){
        var item = `
                <input type="submit" class="btn btn-warning delete_tag" id="data-row-${i}" name="delete_tag" value="${tag_list_text[i]} &#215;">
                `
        id_tag_selected.innerHTML += item
    }
    for (var i in tag_list_text){
        //delete tag
        var delete_tag = document.getElementsByClassName('delete_tag')[i]
        delete_tag.addEventListener('click',(function(item){
            return function(e){
                e.preventDefault()
                TagDelete(item)
            }
        })(tag_list_text[i]))
    }
})
// delete tag
function TagDelete(item){
    delete_index = tag_list_text.indexOf(item)
    tag_list_text.splice(delete_index, 1)
    document.getElementById('tag_list_text').value = tag_list_text     
    id_tag_selected.innerHTML = ''
    for (var i in tag_list_text){
        var item = `
                <input type="submit" class="btn btn-warning delete_tag" id="data-row-${i}" name="delete_tag" value="${tag_list_text[i]} &#215;">
                `
        id_tag_selected.innerHTML += item
    }
    for (var i in tag_list_text){
        //delete tag
        var delete_tag = document.getElementsByClassName('delete_tag')[i]
        delete_tag.addEventListener('click',(function(item){
            return function(e){
                e.preventDefault()
                TagDelete(item)
            }
        })(tag_list_text[i]))
    } 
}
// search testcase
const testcase_search_button = document.getElementById('btn_search')
testcase_search_button.addEventListener('click',function(e){
    e.preventDefault()
    var testcase_seach_name = document.getElementById('id_name').value
    var testcase_table = document.getElementById('testcase_tbody')
    testcase_table.innerHTML=''
    testcase_table.innerHTML += show_testcase_answer(testcase_seach_name,tag_list_text)
    selected_button_method()
    var have_selected_length = document.getElementsByClassName('Have_selected').length
    for(i=0;i<have_selected_length;i++){
        var remove_testcase_btn = document.getElementsByClassName('remove_testcase')[i]
        remove_testcase_btn.addEventListener('click',(function(item){
            return function(e){
                e.preventDefault()
                delete_testcase(item)
            } 
        })(i))
    }
    
})
//testcase detect
function show_testcase_answer(name,tag){
    var return_innerHTML = ''
    var testcaseobject = document.getElementById('testcase_html').value
    var tag_option = $("input[type='radio'][name='option']:checked").val()
    testcaseobject = JSON.parse(testcaseobject)
    for(var i=0 ; i<testcaseobject.length ; i++){
        // testcase information
        var pk = testcaseobject[i].pk
        var testcasename = testcaseobject[i].name
        var tag_list = testcaseobject[i].tag
        var create_dated = testcaseobject[i].datecreated
        pk = pk.toString()
        if (tag_list_text.length>0){
            if (tag_option=='or'){
                for(num in tag_list){
                    if (tag_list_text.includes(tag_list[num])){
                        if (testcasename.includes(`${name}`)){
                            if (selected_testcase_list.includes(testcasename)){
                                return_innerHTML+=`<tr>
                                    <form method="POST">
                                
                                    <td><input type="submit" id="${testcasename}" class="Have_selected" value="Select"></td>
                                    </form>
                                    <td class="selected_td"><div>&#10004;</div><div class="float:right"><input type="submit" id="remove_testcase" class="btn btn-danger remove_testcase" value="remove"></div></td>`
                            }else{
                                return_innerHTML+=`<tr>
                                    <form method="POST">
                        
                                    <td><input type="submit" id="${testcasename}" class="Have_selected" value="Select"></td>
                                    </form>
                                    <td class="selected_td"><div class="float:right"><input type="hidden" id="remove_testcase" class="remove_testcase" value="remove"></td>`
                            }
                            return_innerHTML+=`
                            <td><a href="/case/${pk}/teststep/" target="_blank">${testcasename}</a></td><td style="color: rgb(255, 0, 221);">`
                            for(num in tag_list){
                                return_innerHTML+=`
                                <button type="button" class="btn btn-info">${tag_list[num]} 
                                </button>`
                            }
                            return_innerHTML+=`</td><td>${create_dated}</td></tr>`
                        }
                        break
                    }
                }  
            }else{
                var check_tag_list = true
                for(num in tag_list_text){
                    if (tag_list.includes(tag_list_text[num])){
                        
                    }else{
                        check_tag_list = false
                    }
                }
                if (check_tag_list==true){
                    if (testcasename.includes(`${name}`)){
                        if (selected_testcase_list.includes(testcasename)){
                            return_innerHTML+=`<tr>
                                <form method="POST">
                
                                <td><input type="submit" id="${testcasename}" class="Have_selected" value="Select"></td>
                                </form>
                                <td class="selected_td"><div>&#10004;</div><div class="float:right"><input type="submit" id="remove_testcase" class="btn btn-danger remove_testcase" value="remove"></div></td>`
                        }else{
                            return_innerHTML+=`<tr>
                                <form method="POST">
                        
                                <td><input type="submit" id="${testcasename}" class="Have_selected" value="Select"></td>
                                </form>
                                <td class="selected_td"><div class="float:right"><input type="hidden" id="remove_testcase" class="remove_testcase" value="remove"></td>`
                        }
                        return_innerHTML+=`
                        <td><a href="/case/${pk}/teststep/" target="_blank">${testcasename}</a></td><td style="color: rgb(255, 0, 221);">`
                        for(num in tag_list){
                            return_innerHTML+=`
                            <button type="button" class="btn btn-info">${tag_list[num]} 
                            </button>`
                        }
                        return_innerHTML+=`</td><td>${create_dated}</td></tr>`
                    }
                }
            }
        }else{
            if (testcasename.includes(`${name}`)){
                if (selected_testcase_list.includes(testcasename)){
                    return_innerHTML+=`<tr>
                        <form method="POST">
                            <td><input type="submit" id="${testcasename}" class="Have_selected" value="Select"></td>
                            </form>
                        <td class="selected_td"><div>&#10004;</div><div class="float:right"><input type="submit" id="remove_testcase" class="btn btn-danger remove_testcase" value="remove"></div></td>`
                }else{
                    return_innerHTML+=`<tr>
                        <form method="POST">
        
                        <td><input type="submit" id="${testcasename}" class="Have_selected" value="Select"></td>
                        </form>
                        <td class="selected_td"><div class="float:right"><input type="hidden" id="remove_testcase" class="remove_testcase" value="remove"></td>`
                }
                return_innerHTML+=`
                <td><a href="/case/${pk}/teststep/" target="_blank">${testcasename}</a></td><td style="color: rgb(255, 0, 221);">`
                for(num in tag_list){
                    return_innerHTML+=`
                    <button type="button" class="btn btn-info">${tag_list[num]} 
                    </button>`
                }
                return_innerHTML+=`</td><td>${create_dated}</td></tr>`
            }
        }
    }
    return return_innerHTML
}
var selected_testcase_list = document.getElementById('selected_testcase_list').value
selected_testcase_list = JSON.parse(selected_testcase_list)
selected_button_method()
function selected_button_method(){
    var have_selected_length = document.getElementsByClassName('Have_selected').length
    console.log('selected_testcase_list',selected_testcase_list)
    for(i=0;i<have_selected_length;i++){
        temp = document.getElementsByClassName('Have_selected')[i]
        temp.addEventListener('click',(function(item,num){
            return function(e){
                e.preventDefault()                    
                console.log('item=',item)
                if (selected_testcase_list.includes(item)==false){
                    selected_testcase_list.push(item)
                    check_selected_testcase(num)
                }
            }
        })(temp.id,i))
    }
}
function check_selected_testcase(i){
    temp_td = document.getElementsByClassName('selected_td')[i]
    temp_td.innerHTML = ``
    temp_td.innerHTML += `<div>&#10004;</div><div class="float:right"><input type="submit" id="remove_testcase" class="btn btn-danger remove_testcase" value="remove"></div>`
    var remove_testcase_btn = document.getElementsByClassName('remove_testcase')[i]
    remove_testcase_btn.addEventListener('click',function(e){
        e.preventDefault()
        delete_testcase(i)
    })
    
}
function delete_testcase(i){
    console.log('delete_testcase',i)
    temp = document.getElementsByClassName('Have_selected')[i]
    item = temp.id
    delete_index = selected_testcase_list.indexOf(item)
    selected_testcase_list.splice(delete_index,1)
    temp_td = document.getElementsByClassName('selected_td')[i]
    temp_td.innerHTML = ``
    temp_td.innerHTML += `<div class="float:right"><input type="hidden" id="remove_testcase" class="remove_testcase" value="remove"></div>`
    console.log(selected_testcase_list)
}
function save_fun(){
    var csrftoken = getCookie('csrftoken')
    var data_dict = {}
    var id_document = CKEDITOR.instances['id_text'].getData()
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['save'] = 'save'
    data_dict['selected_testcase_list'] = JSON.stringify(selected_testcase_list)
    data_dict['testplan_name'] = document.getElementById('id_testplanname').value
    data_dict['start_date'] = document.getElementById('id_start_date').value
    data_dict['stop_date'] = document.getElementById('id_stop_date').value
    data_dict['stage'] = document.getElementById('id_stage').value
    data_dict['assign'] = document.getElementById('id_assign').value
    data_dict['text'] = id_document
    
    
    if (data_dict['testplan_name'] == ""){
        alert("Testplan Name can't be blank")
    }else if(data_dict['start_date'].length<2 || data_dict['stop_date'].length<1){
        alert("Datetime can't be blank ")
    }
    else{
        console.log(data_dict)
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success:function() {
                console.log("success");
                window.location = '';
            },
            error: function(data) {
                console.log("error")
                alert("Testplan name has already existed ")
            }
        });
    }
}
    

// edit & save
var edit_btn = document.getElementById('edit')
edit_btn.addEventListener('click',function(e){
    e.preventDefault()
    EditMode()
})
var edit_name = document.getElementById('edit_name')
var save_name = document.getElementById('save_name')
var edit_assign = document.getElementById('edit_assign')
var save_assign = document.getElementById('save_assign')
var edit_stage = document.getElementById('edit_stage')
var save_stage = document.getElementById('save_stage')
var edit_startdate = document.getElementById('edit_startdate')
var save_startdate = document.getElementById('save_startdate')
var edit_stopdate = document.getElementById('edit_stopdate')
var save_stopdate = document.getElementById('save_stopdate')
var edit_testcase = document.getElementById('edit_testcase')
var save_testcase = document.getElementById('save_testcase')
var state = document.getElementById('state')
function EditMode(){
    edit_name.className = ('')
    save_name.className = ('hidden')
    edit_assign.className = ('')
    save_assign.className = ('hidden')
    edit_stage.className = ('')
    save_stage.className = ('hidden')
    edit_startdate.className = ('')
    save_startdate.className = ('hidden')
    edit_stopdate.className = ('')
    save_stopdate.className = ('hidden')
    edit_document.className = ('')
    save_document.className = ('hidden')
    edit_testcase.className = ('')
    save_testcase.className = ('hidden')
    // show have selected
    var testcase_intestplan = document.getElementById('testcase_intestplan').value
    testcase_intestplan = JSON.parse(testcase_intestplan)
    if (state.value == 'first'){
        for(var i=0 ; i<testcase_intestplan.length ; i++){
            // testcase information
            var pk = testcase_intestplan[i].pk
            var testcasename = testcase_intestplan[i].name
            var tag_list = testcase_intestplan[i].tag
            var create_dated = testcase_intestplan[i].datecreated
            if (selected_testcase_list.includes(testcasename)==false){
                selected_testcase_list.push(testcasename)
            }
        }
    }
    var testcase_seach_name = document.getElementById('id_name').value
    var testcase_table = document.getElementById('testcase_tbody')
    testcase_table.innerHTML=``
    testcase_table.innerHTML += show_testcase_answer(testcase_seach_name,tag_list_text)
    selected_button_method()
    var have_selected_length = document.getElementsByClassName('Have_selected').length
    for(i=0;i<have_selected_length;i++){
        var remove_testcase_btn = document.getElementsByClassName('remove_testcase')[i]
        remove_testcase_btn.addEventListener('click',(function(item){
            return function(e){
                e.preventDefault()
                delete_testcase(item)
            } 
        })(i))
    }
    state.value = 'edit'
}

// edit and save
var editsave_btn = document.getElementById('editsave')
editsave_btn.addEventListener('click',function(e){
    e.preventDefault()
    Editsave()
})

function Editsave(){
    // var id_testplanname = document.getElementById('id_testplanname').value
    // var id_assign =document.getElementById('id_assign').value
    // var id_testcase_list= selected_testcase_list
    // var id_startdate = document.getElementById('id_start_date').value
    // var id_stopdate = document.getElementById('id_stop_date').value
    // var id_stage = document.getElementById('id_stage').value
    // var testcase_show = document.getElementById('testcase_show')
    // var testcaseobject = document.getElementById('testcase_html').value
    // var id_document = CKEDITOR.instances['id_text'].getData()
    
    // testcaseobject = JSON.parse(testcaseobject)
    // edit_name.className = ('hidden')
    // save_name.className = ('')
    // save_name.innerHTML = `<p class="p_color">${id_testplanname}</p>`
    // edit_assign.className = ('hidden')
    // save_assign.className = ('')
    // save_assign.innerHTML = `<p class="p_color">${id_assign}</p>`
    // edit_stage.className = ('hidden')
    // save_stage.className = ('')
    // save_stage.innerHTML = `<p class="p_color">${id_stage}</p>`
    // edit_startdate.className = ('hidden')
    // save_startdate.className = ('')
    // save_startdate.innerHTML = `<p class="p_color">${id_startdate}</p>`
    // edit_stopdate.className = ('hidden')
    // save_stopdate.className = ('')
    // save_stopdate.innerHTML = `<p class="p_color">${id_stopdate}</p>`
    // edit_document.className = ('hidden')
    // save_document.className = ('')
    // save_document.innerHTML = `<h2 style="color: #ff0000">${id_document}</h2>`
    // edit_testcase.className = ('hidden')
    // save_testcase.className = ('')
    // temp = ``
    // for(var i=0 ; i<testcaseobject.length ; i++){
    //     // testcase information
    //     var pk = testcaseobject[i].pk
    //     var testcasename = testcaseobject[i].name
    //     var tag_list = testcaseobject[i].tag
    //     var create_dated = testcaseobject[i].datecreated
    //     pk = pk.toString()
    //     if (selected_testcase_list.includes(testcasename)){
    //         temp+=   
    //             `<tr><form method="POST"></form><td><a href="/case/${pk}/teststep/">${testcasename}</a></td><td style="color: rgb(255, 0, 221);">`
    //         for(num in tag_list){
    //             temp+=`
    //             <button type="button" class="btn btn-info">${tag_list[num]}</button>`
    //         }
    //         temp+=`</td><td>${create_dated}</td></tr>`
    //     }
    // }
    // testcase_show.innerHTML = temp
    save_fun()
}
var is_activate_checkbox = document.getElementById('is_activate')
is_activate_checkbox.addEventListener('change',function(e){
    e.preventDefault()
    var csrftoken = getCookie('csrftoken')
    var data_dict = {}
    var id_is_activate = $('#is_activate').is(":checked")
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['is_activate'] = id_is_activate
    data_dict['checkbox_ans'] = 'checkbox_ans'
    console.log(data_dict)
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
        },
        error: function(data) {
            console.log("error")
        }
    });
})