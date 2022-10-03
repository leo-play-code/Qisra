var dashboard_testplan_tr_list = document.querySelectorAll('.dashboard_testplan_tr')
dashboard_testplan_tr_list.forEach(tr_element=>{
    // today date time 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = new Date(yyyy + '-' + mm + '-' + dd);

    // testrun status filter
    try{
        var enddate = tr_element.querySelector('.pagination_end_date').innerHTML
        enddate = new Date(enddate)
    }catch{}

    // testplan  status filter
    try{
        var status_data = tr_element.querySelector('.pagination_testplan_status>button').innerHTML
        if (status_data == '進行中' && enddate<today){
            tr_element.style.backgroundColor = "#FADBD8";
        }
    }catch{}

    // testcase filter
    try{
        var status_data = tr_element.querySelector('.pagination_testrun_status>button').innerHTML
        if (status_data == '進行中' || status_data=='未開始' ){
            if (enddate<today){
                tr_element.style.backgroundColor = "#FADBD8";
            }
        }
    }catch{

    }
})