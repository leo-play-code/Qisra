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
var csrftoken = getCookie('csrftoken')

// search button
var btn_search = document.getElementById('btn_search')
btn_search.addEventListener('click',function(e){
    e.preventDefault()
    // get setup data 
    var id_name = document.getElementById('id_name').value
    var id_assign = document.getElementById('id_assign').value
    var id_stage = document.getElementById('id_stage').value
    var id_start_date = document.getElementById('id_start_date').value
    id_start_date = new Date(id_start_date)
    var id_stop_date = document.getElementById('id_stop_date').value
    id_stop_date = new Date(id_stop_date)
    var testplan_html = document.getElementById('testplan_html').value

    var id_creator = document.getElementById('id_creator').value
    var id_is_activate = $('#is_activate').is(":checked")
    

    testplan_html = JSON.parse(testplan_html)
    var select_testplan = []
    for(var i=0 ; i<testplan_html.length ; i++){
        // testcase information
        var select_bool = false
        var pk = testplan_html[i].pk
        var testplanname = testplan_html[i].name
        var assign = testplan_html[i].assign
        var stage = testplan_html[i].stage
        var start_date = testplan_html[i].start_date
        start_date = new Date(start_date)
        var end_date = testplan_html[i].end_date
        end_date = new Date(end_date)
        var datecreated = testplan_html[i].datecreated
        var creator = testplan_html[i].creator
        var is_activate = testplan_html[i].is_activate

        pk = pk.toString()
        if (id_start_date.toString().length<30 && id_stop_date.toString().length<30){
            select_bool = true
        }else if(id_start_date.toString().length<30 && id_stop_date.toString().length>30){
            if(id_stop_date>=end_date){
                select_bool = true
            }
        }else if(id_start_date.toString().length>30 && id_stop_date.toString().length<30){
            if(id_start_date<=start_date){
                select_bool = true
            }
        }else{
            if(id_stop_date>=end_date && id_start_date<=start_date){
                select_bool = true
            }
        }
        if (select_bool == true){
            if (id_stage=='' && id_assign =='' ){
                if (testplanname.includes(id_name)){
                    select_bool = true
                }else{
                    select_bool = false
                }
            }else if(id_stage!='' && id_assign =='' ){
                if (testplanname.includes(id_name)&& stage==id_stage){
                    select_bool = true
                }else{
                    select_bool = false
                }
            }else if(id_stage=='' && id_assign !='' ){
                if (testplanname.includes(id_name)&& assign==id_assign){
                    select_bool = true
                }else{
                    select_bool = false
                }
            }else if(id_stage!='' && id_assign !='' ){
                if (testplanname.includes(id_name)&& stage==id_stage && id_assign==assign){
                    select_bool = true
                }else{
                    select_bool = false
                }
            }
        }
        if (select_bool == true){
            if (id_creator != ''){
                if (creator != id_creator){
                    select_bool = false
                }
            }
        }
        if (is_activate != id_is_activate){
            select_bool = false
        }
        if(select_bool==true){
            select_testplan.push(i)
        }
    }
    var testplan_body = document.getElementById('testplan-body')
    testplan_body.innerHTML = ``
    var creator_bool = (document.getElementById('creator_bool').value).toString()

    for(var i=0 ; i<testplan_html.length ; i++){
        if(select_testplan.includes(i)==true){
            // 輸入到innnerhtml
            var pk = testplan_html[i].pk
            var testplanname = testplan_html[i].name
            var assign = testplan_html[i].assign
            var stage = testplan_html[i].stage
            var start_date = testplan_html[i].start_date
            var end_date = testplan_html[i].end_date
            var is_activate = testplan_html[i].is_activate
            var creator = testplan_html[i].creator
            pk = pk.toString()
            if (creator_bool == 'True'){
                if (is_activate==true){
                    testplan_body.innerHTML +=`<tr>
                        <td><a href="/plan/${pk}/testplan_view/" target="_blank">${testplanname}</a></td>
                        <td>${assign}</td>
                        <td>${stage}</td>
                        <td>${creator}</td>
                        <td>${start_date}</td>
                        <td>${end_date}</td>
                        <td>${datecreated}</td>
                        <td style="color:green ;">True</td>
                        </tr>
                        `
                }else{
                    testplan_body.innerHTML +=`<tr>
                        <td><a href="/plan/${pk}/testplan_view/" target="_blank">${testplanname}</a></td>
                        <td>${assign}</td>
                        <td>${stage}</td>
                        <td>${creator}</td>
                        <td>${start_date}</td>
                        <td>${end_date}</td>
                        <td>${datecreated}</td>
                        <td style="color:red ;">False</td>
                        </tr>
                        `
                }
            }else{
                if (is_activate==true){
                    testplan_body.innerHTML +=`<tr>
                        <td><a href="/plan/${pk}/testplan_view/" target="_blank">${testplanname}</a></td>
                        <td>${assign}</td>
                        <td>${stage}</td>
                        <td>${creator}</td>
                        <td>${start_date}</td>
                        <td>${end_date}</td>
                        <td>${datecreated}</td>
                        </tr>
                        `
                }else{
                    testplan_body.innerHTML +=`<tr>
                        <td><a href="/plan/${pk}/testplan_view/" target="_blank">${testplanname}</a></td>
                        <td>${assign}</td>
                        <td>${stage}</td>
                        <td>${creator}</td>
                        <td>${start_date}</td>
                        <td>${end_date}</td>
                        <td>${datecreated}</td>
                        </tr>
                        `
                }
            }
            
            
                
  
                
        }
    }

    
})