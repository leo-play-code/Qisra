function createToast(bool, text) {
    if (bool == true){
        color = '#2ECC71'
    }else{
        color = '#E74C3C'
    }
    let id = new Date().getTime();
    let html = `
    <div class="toast fade" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="4000" id="${id}">
        <div class="toast-header">
            <svg class="bd-placeholder-img rounded me-2" width="20" height="20"  aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill=${color}></rect></svg>
            <strong class="me-auto">Qisra</strong>
            <small class="text-muted">Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${text}
        </div>
    </div>`;
    document.getElementById('toast-container').innerHTML = html;
    $(`#${id}`).toast('show');
}