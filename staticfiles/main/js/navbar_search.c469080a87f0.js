var navbar_search_all_type = document.getElementById('navbar_search_all_type')

navbar_search_all_type.addEventListener('input',function(e){
    e.preventDefault()
    if (navbar_search_all_type === document.activeElement) {
        console.log('Element has focus!');
    } else {
        console.log(`Element is not focused.`);
    }
})

