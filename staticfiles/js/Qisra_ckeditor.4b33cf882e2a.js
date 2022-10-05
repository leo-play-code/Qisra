CKEDITOR.editorConfig = function (config) {
    config.toolbar = [
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-'],
        ['Image'],
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['Undo', 'Redo']
    ];
    config.width = 500;

    config.height = 180;
    // config.autoParagraph = false;
    config.fillEmptyBlocks = false;
    config.enterMode = CKEDITOR.ENTER_BR;

};