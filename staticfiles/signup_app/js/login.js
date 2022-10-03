// loading 
const loading_reset_password = document.getElementById('loading_reset_password')
// error div login
var login_username_error = document.getElementById('login_username_error')
var login_password_error = document.getElementById('login_password_error')
// error msg register
var register_email_error = document.getElementById('register_email_error')
var register_password_error = document.getElementById('register_password_error')
var register_repeat_password_error = document.getElementById('register_repeat_password_error')
// email verify code error msg
var reset_email_code_error = document.getElementById('reset_email_code_error')
// password error
var error_password_not_same = document.getElementById('error_password_not_same')
// login wait
var register_success_wait = document.getElementById('register_success_wait')
var login_success_wait = document.getElementById('login_success_wait')
register_success_wait.classList.add('hidden')
login_success_wait.classList.add('hidden')
var login_btn = document.getElementById('login_btn')
login_btn.addEventListener('click',function(e){
    e.preventDefault()
    login_username_error.classList.add('hidden')
    login_password_error.classList.add('hidden')
    if (bool_login_mode() == true){
        login_btn.innerHTML = `<img src="/static/images/Spinner-login.svg" >`
        _send_data('login')
    }
})


var register_btn = document.getElementById('register_btn')
register_btn.addEventListener('click',function(e){
    e.preventDefault()
    register_email_error.classList.add('hidden')
    register_password_error.classList.add('hidden')
    register_repeat_password_error.classList.add('hidden')
    if (bool_register_mode() == true){
        _send_data('register')
    }
})
var login_page_register = document.getElementById('login_page_register')
login_page_register.addEventListener('click',function(e){
    e.preventDefault()
    console.log('login_page_register')
    var pills_register_div = document.getElementById('pills-register')
    var pills_login_div = document.getElementById('pills-login')
    var tab_login = document.getElementById('tab-login')
    var tab_register = document.getElementById('tab-register')
    pills_register_div.className = 'tab-pane fade show active'
    pills_login_div.className = 'tab-pane fade'
    tab_login.classList.remove('active')
    tab_register.classList.add('active')
    login_username_error.classList.add('hidden')
    login_password_error.classList.add('hidden')
})

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
function _send_data(mode){
    data_dict = {}
    if (mode == 'login'){
        var csrftoken = getCookie('csrftoken');
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        var username = document.getElementById('loginName').value
        var password1 = document.getElementById('loginPassword').value
        data_dict['username'] = username
        data_dict['password1'] = password1
        data_dict['login'] = 'login'


    }else{
        var csrftoken = getCookie('csrftoken');
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        var email = document.getElementById('registerEmail').value
        var password1 = document.getElementById('registerPassword').value
        var password2 = document.getElementById('registerRepeatPassword').value
        data_dict['email'] = email
        data_dict['password1'] = password1
        data_dict['password2'] = password2
        data_dict['register'] = 'register'
    }
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function(data) {
            if (data['error']){
                if(data['error'] == 'email'){
                    register_email_error.classList.remove('hidden')
                    register_email_error.innerHTML = `Email 已被使用`
                }else if(data['error'] == 'email_invalid'){
                    register_email_error.classList.remove('hidden')
                    register_email_error.innerHTML = `Email is invalid , Need to be @Qisda.com`
                }else if(data['error'] == 'loginerror'){
                    login_username_error.classList.remove('hidden')
                    login_username_error.innerHTML = `Email或密碼錯誤`
                    login_btn.innerHTML = `Sign in`
                }else if(data['error'] == 'wait_accept'){
                    register_success_wait.classList.remove('hidden')
                }else if(data['error'] == 'is_not_active'){
                    login_success_wait.classList.remove('hidden')
                }
                login_btn.innerHTML = `Sign in`
            }else{
                console.log('success')
                window.location = '/';
            }
        },
        error: function(data) {
            console.log("error");
            if (mode == 'login'){
                login_username_error.classList.remove('hidden')
                login_username_error.innerHTML = `帳號或密碼錯誤`
                login_btn.innerHTML = `Sign in`
            }
        }
    });
}
function bool_login_mode(){
    bool = true
    var username = document.getElementById('loginName').value
    var password1 = document.getElementById('loginPassword').value
    if (username == ''){
        login_username_error.classList.remove('hidden')
        login_username_error.innerHTML = `Username 不可空白`
        bool = false
    }
    if (password1 == ''){
        login_password_error.classList.remove('hidden')
        login_password_error.innerHTML = `Password 不可空白`
        bool = false
    }
    return bool
}
function bool_register_mode(){
    bool = true
    var registerEmail = document.getElementById('registerEmail').value
    var registerPassword = document.getElementById('registerPassword').value
    var registerRepeatPassword = document.getElementById('registerRepeatPassword').value

    // email
    if (registerEmail.includes('@')==false && registerEmail != ''){
        console.log('register email',false)
        _register_email_error('format')
        bool = false
    }else if (registerEmail == ''){
        _register_email_error('blank')
        bool = false
    }
    //password
    
    if (registerPassword == ''){
        _register_password_error('blank')
        bool = false
    }else{
        if (registerPassword != registerRepeatPassword ){
            console.log('register pass' , false)
            _register_repeatpassword_error()
            bool = false
        }
    }
    return bool
}

function _register_email_error(mode){
    register_email_error.classList.remove('hidden')
    if (mode == 'format'){
        register_email_error.innerHTML = `Email 形式錯誤 請確認輸入正確`
    }else if(mode == 'blank'){
        register_email_error.innerHTML = `Email 不可空白`
    }else if(mode == 'reuse'){
        register_email_error.innerHTML = `Email 已被使用`
    }

}
function _register_password_error(mode){
    register_password_error.classList.remove('hidden')
    if (mode == 'blank'){
        register_password_error.innerHTML = `Password 不可為空白`
    }
}


function _register_repeatpassword_error(){
    register_repeat_password_error.classList.remove('hidden')
}



var tab_login_btn = document.getElementById('tab-login')
tab_login_btn.addEventListener('click',function(e){
    register_email_error.classList.add('hidden')
    register_password_error.classList.add('hidden')
    register_repeat_password_error.classList.add('hidden')
})

var tab_register_btn = document.getElementById('tab-register')
tab_register_btn.addEventListener('click',function(e){
    login_username_error.classList.add('hidden')
    login_password_error.classList.add('hidden')
})


// 重設密碼驗證碼
var reset_email_btn = document.getElementById('reset_email_btn')
reset_email_btn.addEventListener('click',function(e){
    e.preventDefault()
    _send_verify_code()
    
    
})

function countdown_verify_code(){
    reset_email_btn.className = 'btn btn-sm btn-secondary'
    reset_email_btn.disabled = true
    var counter = 30;
    intervalId = setInterval(function(){
        counter--
        reset_email_btn.innerText = counter +'秒後重發'
        if (counter === 0) {
            reset_email_btn.className = 'btn btn-sm btn-warning'
            reset_email_btn.innerText = '重新獲取驗證碼'
            reset_email_btn.disabled = false
            clearInterval(intervalId);
        }
        
    }, 1000);
}



function _send_verify_code(){
    countdown_verify_code()
    data_dict = {}
    reset_email_code_error.classList.add('hidden')
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['get_verify_code'] = 'get_verify_code'
    data_dict['email'] = document.getElementById('reset_email').value

    var reset_email_error = document.getElementById('reset_email_error')
    reset_email_error.classList.add('hidden')
    if (data_dict['email'] == ''){
        reset_email_error.classList.remove('hidden')
        reset_email_error.innerHTML = `&nbsp;&nbsp;Email不可為空白`
    }else if(data_dict['email'].includes('@')==false){
        reset_email_error.classList.remove('hidden')
        reset_email_error.innerHTML = `&nbsp;&nbsp;Email格式錯誤`
    }else{
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success:function(data) {
                console.log('success')
                var save_reset_email = document.getElementById('save_reset_email')
                save_reset_email.innerHTML= `
                <input type="hidden" id="now_email" name="now_email" value="${data_dict['email']}" >
                `
                var reset_email_code = document.getElementById('reset_email_code')
                reset_email_code.classList.remove('hidden')
                
            },
            error: function(data) {
                console.log("error");
                reset_email_error.classList.remove('hidden')
                reset_email_error.innerHTML = `&nbsp;&nbsp;此Email尚未註冊`
            }
        }); 
    }
   
}


var verify_email_mode = document.querySelectorAll('.verify_email_mode')
var reset_password_mode = document.querySelectorAll('.reset_password_mode')
var accurate_verify_code_btn = document.getElementById('accurate_verify_code')
accurate_verify_code_btn.addEventListener('click',function(e){
    accurate_verify_code_btn.classList.add('hidden')
    loading_reset_password.classList.remove('hidden')
    e.preventDefault()
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['accurate_verify_code'] = 'accurate_verify_code'
    data_dict['email'] = document.getElementById('now_email').value
    data_dict['code'] = document.getElementById('reset_email_code').value
    $.ajax({
        type: 'POST',
        url: '',
        data: data_dict,
        success:function(data) {
            console.log('success',data)
            if (data['code'] == 'True'){
                verify_email_mode.forEach(element=>{
                    element.classList.add('hidden')
                })
                reset_password_mode.forEach(element=>{
                    element.classList.remove('hidden')
                })
                
            }else if (data['code'] == 'False'){
                reset_email_code_error.classList.remove('hidden')
            }
            loading_reset_password.classList.add('hidden')
            accurate_verify_code_btn.classList.remove('hidden')
            
        },
        error: function(data) {
            console.log("error");
            reset_email_code_error.classList.remove('hidden')
            loading_reset_password.classList.add('hidden')
            accurate_verify_code_btn.classList.remove('hidden')
        }
    });  
})

// reset password mode

// reset password button
var reset_password_btn = document.getElementById('reset_password_btn')
var reset_new_password = document.getElementById('reset_new_password')
var reset_new_password_repeat = document.getElementById('reset_new_password_repeat')
reset_password_btn.addEventListener('click',function(e){
    e.preventDefault()
    error_password_not_same.classList.add('hidden')
    if (reset_new_password.value != reset_new_password_repeat.value){
        error_password_not_same.classList.remove('hidden')
    }else{
        reset_password_btn.classList.add('hidden')
        loading_reset_password.classList.remove('hidden')
        data_dict = {}
        var csrftoken = getCookie('csrftoken');
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        data_dict['new_password'] = reset_new_password.value
        data_dict['email'] = document.getElementById('now_email').value
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success:function(data) {
                console.log('success')
                window.location = '/';
            },
            error: function(data) {
                console.log("error");
                loading_reset_password.classList.add('hidden')
                reset_password_btn.classList.remove('hidden')
                
            }
        });   
    }
})


// login email verify first