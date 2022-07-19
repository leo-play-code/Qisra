var dropdown_btn = document.getElementById('dropdown_btn');
dropdown_btn.addEventListener('click',function(e){
    if (dropdown_btn.style.transform == "rotate(-90deg)"){
        dropdown_btn.style.transform = "rotate(0deg)";
    }else{
        dropdown_btn.style.transform = "rotate(-90deg)";
    }
})
var dropdown_btn2 = document.getElementById('dropdown_btn2');
dropdown_btn2.addEventListener('click',function(e){
    if (dropdown_btn2.style.transform == "rotate(-90deg)"){
        dropdown_btn2.style.transform = "rotate(0deg)";
    }else{
        dropdown_btn2.style.transform = "rotate(-90deg)";
    }
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
CKEDITOR.editorConfig = function( config ) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold','Italic','Underline','Strike','-'],
        ['Image'],
        ['Styles','Format','Font','FontSize'],

        ['TextColor','BGColor'],
        ['Undo','Redo'],
    ];
    config.width = 670;
    config.height = 180;
};

