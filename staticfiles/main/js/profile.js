// loading btn
const loading_update_profile = document.getElementById('loading_update_profile')

// update_profile_btn
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
var update_profile_btn = document.getElementById('update_profile_btn')
update_profile_btn.addEventListener('click',function(e){
    e.preventDefault()
    data_dict = {}
    var csrftoken = getCookie('csrftoken');
    new_password = document.getElementById('account-pass').value
    confirm_password = document.getElementById('account-confirm-pass').value
    username = document.getElementById('account-name').value
    data_dict['csrfmiddlewaretoken'] = csrftoken;
    data_dict['update_profile'] = 'update_profile'
    data_dict['password'] = new_password
    run_bool = true
    if (new_password != confirm_password || new_password == '' || confirm_password == ''){
        run_bool = false
        createToast(false, 'Password Update Fail !!') 
    }
    if (run_bool == true){
        update_profile_btn.classList.add('hidden')
        loading_update_profile.classList.remove('hidden')
        $.ajax({
            type: 'POST',
            url: '',
            data: data_dict,
            success:function(data) {
                console.log('success')
                createToast(true, 'Password Update Success !! ') 
                loading_update_profile.classList.add('hidden')
                update_profile_btn.classList.remove('hidden')
            },
            error: function(data) {
                console.log("error");
                loading_update_profile.classList.add('hidden')
                update_profile_btn.classList.remove('hidden')
            }
        });  
    }   
})



