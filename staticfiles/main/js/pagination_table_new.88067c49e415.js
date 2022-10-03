


var Pagination_class_dict = {}
class Pagination_class {
    constructor(element) {
        // 初始設定
        this.element = element
        this.dashboard_testplan_tr = element.querySelectorAll('.dashboard_testplan_tr');
        this.pagination_link_list = element.querySelector('#pagination_link_list');
        this.testplan_creator_page = 1
        this.max_select = element.querySelector("#testplan_creator_max_show")
        this.max_number = element.querySelector("#testplan_creator_max_show").value
    }
}
var pagination_table_list = document.querySelectorAll('.pagination_table')
pagination_table_list.forEach(table_element => {
    Pagination_class_dict[table_element.id] = new Pagination_class(table_element);
    // 初始設定
    _reset_page_link_list(table_element, Pagination_class_dict[table_element.id].max_select.value)
    _reset_page_link_show(table_element, Pagination_class_dict[table_element.id].testplan_creator_page)
    Pagination_class_dict[table_element.id].max_select.onchange = (event) => {
        var inputText = event.target.value;
        Pagination_class_dict[table_element.id].max_number = inputText
        Pagination_class_dict[table_element.id].testplan_creator_page = 1
        _testplan_creator_table(table_element)
        _reset_page_link_list(table_element, inputText)
    }
    _testplan_creator_table(table_element)


    // Table sorted method
    // Get table 
 
    // make title can be sort
    title_sort = table_element.querySelectorAll('.pagination-sort-title')
    title_sort.forEach(title_element =>{
        if (title_element.classList.contains('pagination-sort-title-disable')){
            original_title_innerHTML = title_element.innerHTML
            title_element.innerHTML = `
            <a href="#" style="color: black;" class="pagination-sort-link disabled-link ">
                <div class="row">
                    <div class="col-8">
                        <div style="float: left;">
                            ${original_title_innerHTML}
                        </div>
                    </div>
                    <div class="col-4" >
                    </div>
                </div>
            </a>
        `
        }else{
            original_title_innerHTML = title_element.innerHTML
            title_element.innerHTML = `
            <a href="#" style="color: black;" class="pagination-sort-link">
                <div class="row">
                    <div class="col-8">
                        <div style="float: left;">
                            ${original_title_innerHTML}
                        </div>
                    </div>
                    <div class="col-4" >
                        <i class="fa fa-sort" style="font-size:14px;color:#BDC3C7;float:right;transform: translateY(6px);"></i>
                    </div>
                </div>
            </a>
        `
        }
    })
    var pagination_sort_link_link = table_element.getElementsByClassName('pagination-sort-link').length
    for (i = 0; i < pagination_sort_link_link; i++) {
        var pagination_sort_link = table_element.getElementsByClassName('pagination-sort-link')[i]
        pagination_sort_link.addEventListener('click', (function (item) {
            return function (e) {
                
                e.preventDefault()
                // change icon of sorting
                temp = table_element.getElementsByClassName('pagination-sort-link')[item]
                if (temp.querySelector('.fa').classList.contains('fa-sort')){
                    temp.querySelector('.col-4').innerHTML = `
                        <i class="fa fa-sort-asc" style="font-size:14px;color:black;float:right;transform: translateY(6px);"></i>
                    `
                    getColumn(table_element.querySelector('table'), item, 'increase', Pagination_class_dict[table_element.id].max_number, table_element)
                    
                } else if (temp.querySelector('.fa').classList.contains('fa-sort-asc')) {
                    temp.querySelector('.col-4').innerHTML = `
                        <i class="fa fa-sort-desc" style="font-size:14px;color:black;float:right;transform: translateY(6px);"></i>
                    `
                    getColumn(table_element.querySelector('table'), item, 'decrease', Pagination_class_dict[table_element.id].max_number, table_element)
                } else if (temp.querySelector('.fa').classList.contains('fa-sort-desc')) {
                    temp.querySelector('.col-4').innerHTML = `
                        <i class="fa fa-sort-asc" style="font-size:14px;color:black;float:right;transform: translateY(6px);"></i>
                    `
                    getColumn(table_element.querySelector('table'), item, 'increase', Pagination_class_dict[table_element.id].max_number, table_element)
                }
                // reset all sort icon
                var pagination_sort_link_link = table_element.getElementsByClassName('pagination-sort-link').length
                for (j = 0; j < pagination_sort_link_link; j++) {
                    temp_2 = document.getElementsByClassName('pagination-sort-link')[j]
                    if (j != item && !temp_2.classList.contains('disabled-link')){
                        temp_2.querySelector('.col-4').innerHTML=`
                        <i class="fa fa-sort" style="font-size:14px;color:#BDC3C7;float:right;transform: translateY(6px);"></i>
                        `
                    }
                }
            }
        })(i))
    }



})

function _reset_page_link_list(table_element, max_item) {
    Pagination_class_dict[table_element.id].pagination_link_list.innerHTML = `
    <li class="page-item">
        <a class="page-link" href="#" aria-label="First">
        <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    `
    for (i = 0; i < Math.ceil(Pagination_class_dict[table_element.id].dashboard_testplan_tr.length / max_item); i += 1) {
        Pagination_class_dict[table_element.id].pagination_link_list.innerHTML += `
        <li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`
    }
    Pagination_class_dict[table_element.id].pagination_link_list.innerHTML += `
    <li class="page-item">
        <a class="page-link" href="#" aria-label="Final">
        <span aria-hidden="true">&raquo;</span>
        </a>
    </li>
    `

    var page_link_list = Pagination_class_dict[table_element.id].element.querySelectorAll('.page-item')
    var page_link_length = Pagination_class_dict[table_element.id].element.querySelectorAll('.page-item').length
    page_link_list.forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault()
            page_link_value = element.querySelector('.page-link').innerHTML
            new_page_link_value = parseInt(page_link_value)
            if (isNaN(new_page_link_value)) {
                new_page_link_value = element.querySelector('.page-link').getAttribute("aria-label")
                if (new_page_link_value == 'Final') {
                    testplan_creator_page = page_link_length - 2
                    _reset_page_link_show(table_element, testplan_creator_page)
                } else {
                    testplan_creator_page = 1
                    _reset_page_link_show(table_element, testplan_creator_page)
                }
            } else {
                testplan_creator_page = new_page_link_value
                _reset_page_link_show(table_element, new_page_link_value)
            }
        })
    })
}
function _reset_page_link_show(table_element, item) {
    limit = 5;
    num = 0
    var page_link_length = Pagination_class_dict[table_element.id].element.querySelectorAll('.page-item').length
    var page_link_list = Pagination_class_dict[table_element.id].element.querySelectorAll('.page-item')
    page_link_list.forEach(element => {
        if (num < 1 || num > (page_link_length - 2)) {
            element.classList.remove('hidden')
        } else {
            if (item <= (limit - 1) / 2) {
                if (num >= 1 && num <= 1 + limit - 1) {
                    element.classList.remove('hidden')
                } else {
                    element.classList.add('hidden')
                }
            } else if (item >= (page_link_length - (limit - 1) / 2) - 1) {
                if (num >= page_link_length - limit - 1) {
                    element.classList.remove('hidden')
                } else {
                    element.classList.add('hidden')
                }
            } else {
                if (item - (limit - 1) / 2 <= num && num <= item + (limit - 1) / 2) {
                    element.classList.remove('hidden')
                } else {
                    element.classList.add('hidden')
                }
            }
        }
        num += 1
    })
    Pagination_class_dict[table_element.id].testplan_creator_page = item
    _testplan_creator_table(table_element)
}
function _testplan_creator_table(table_element) {
    testplan_creator_max_number = parseInt(Pagination_class_dict[table_element.id].max_select.value)
    testplan_creator_page = parseInt(Pagination_class_dict[table_element.id].testplan_creator_page)
    // console.log(testplan_creator_max_number, testplan_creator_page)
    for (i = 0; i < Pagination_class_dict[table_element.id].dashboard_testplan_tr.length; i += 1) {
        if (i < testplan_creator_page * testplan_creator_max_number && i >= testplan_creator_page * testplan_creator_max_number - testplan_creator_max_number) {
            Pagination_class_dict[table_element.id].dashboard_testplan_tr[i].classList.remove('hidden')

        } else {
            Pagination_class_dict[table_element.id].dashboard_testplan_tr[i].classList.add('hidden')
        }
    }
}







//  get table result
function getColumn(table, col, sort_method, max_number, table_element) {
    var tab = table
    n = tab.rows.length;
    array = []
    row = 0;
    for (row = 1; row < n; ++row) {
        array.push({
            date: tab.rows[row].cells[col].innerText,
            html: tab.rows[row]
        })
    }
    if (sort_method == 'increase') {
        array.sort(function (a, b) {
            var dateA = new Date(a.date)
            var dateB = new Date(b.date)
            return dateA - dateB
        });
    } else if (sort_method == 'decrease') {
        array.sort(function (a, b) {
            var dateA = new Date(a.date)
            var dateB = new Date(b.date)
            return dateB - dateA 
        });
    } else {}

    table.querySelector('tbody').innerHTML = ``
    count = 1
    for (item in array){
        tr = array[item].html
        tr.classList.remove('hidden')
        if (count > parseInt(max_number)){
            tr.classList.add('hidden')
            table.querySelector('tbody').appendChild(tr)
        }else{
            table.querySelector('tbody').appendChild(tr)
        }
        count+=1
        
    }
    Pagination_class_dict[table_element.id].dashboard_testplan_tr = table_element.querySelectorAll('.dashboard_testplan_tr');
}


