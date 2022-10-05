// renew create tag
function _Create_Tag(DOM){
    // set up dom 
    const Tag_Modal = DOM.parentNode.parentNode
    new_tag_name_input = Tag_Modal.querySelector('#new_tag_name')
    new_tag_name = Tag_Modal.querySelector('#new_tag_name').value
    error_msg = Tag_Modal.querySelector('#error-tag-name')
    loading_tag_img = Tag_Modal.querySelector('#loading_create_tag')
    add_tag_btn = Tag_Modal.querySelector('#add_tag_btn')
    // run code
    error_msg.classList.add('hidden')
    if (new_tag_name.replaceAll(' ','')==''){
        createToast(false, '標籤欄位不可空白')
    }else{
        add_tag_btn.classList.add('hidden')
        loading_tag_img.classList.remove('hidden')
        var csrftoken = getCookie('csrftoken');
        data_dict = {}
        data_dict['csrfmiddlewaretoken'] = csrftoken;
        data_dict['add_tag'] = 'add_tag';
        data_dict['tag_name'] = new_tag_name;
        $.ajax({
            type: 'GET',
            url: '/testcase/new_tag',
            data: data_dict,
            success: function (data) {
                console.log("success");
                if (data['status']=='pass'){
                    _Finish_Add_Tag(Tag_Modal)
                    new_tag_name_input.value = ''
                    createToast(true, 'Tag 名稱 '+data['name']+' 已成功建立!')
                }else{
                    createToast(false, 'Tag 名稱 '+data['name']+' 已被命名了!')
                }
                loading_tag_img.classList.add('hidden')
                add_tag_btn.classList.remove('hidden')
            },
            error: function (data) {
                console.log("error");
                // alert('此標籤名稱已被使用')
            }
        });
    }
}
function _Finish_Add_Tag(Tag_Modal){
    $('#'+Tag_Modal.parentNode.parentNode.id).modal('hide');
    select_tag = Tag_Modal.parentNode.parentNode.parentNode
    select_tag.querySelectorAll('.selectpicker').forEach(element=>{
        if (element.id.includes('tag')){
            select_id = '#'+element.id
        }
    })
    
    console.log(Tag_Modal.parentNode.parentNode.parentNode)

    // reset selectpicker
    var tag_list = $(select_id).val()
    var new_tag_list = []
    for (item in tag_list){
        new_tag_list.push(tag_list[item])
    }
    $(select_id).append('<option value="'+new_tag_name+'">'+new_tag_name+'</option>');
    new_tag_list.push(new_tag_name)
    $(select_id).selectpicker('val', new_tag_list);
    $(select_id).selectpicker("refresh");
}
