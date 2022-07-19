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
}catch (e){

}
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
                            return_innerHTML+=`<tr>
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
                        return_innerHTML+=`<tr>
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
                return_innerHTML+=`<tr>
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


var delete_btn = document.getElementById('delete')
delete_btn.addEventListener('click',function(e){
    e.preventDefault()
    var checkboxes = document.querySelectorAll('input[name="checkdelete"]:checked');
    var values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    // send ajax
    var data_dict ={}
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['delete_testcase'] = JSON.stringify(values);
    // JSON.stringify
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function() {
            console.log("success");
            window.location = '';
        },
        error: function(data) {
            console.log("error");
        }
    });
})


var checkall_bool = document.querySelector('#check-all')
checkall = document.getElementById('check-all')

checkall.addEventListener('change',function(e){
    e.preventDefault()
    console.log(checkall_bool.checked)
    if (checkall_bool.checked == true){
        var checkboxes = document.querySelectorAll('input[name="checkdelete"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
    } else{
        var checkboxes = document.querySelectorAll('input[name="checkdelete"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    }
})