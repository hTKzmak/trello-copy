tinymce.init({
    selector: 'textarea#card_description',
    license_key: 'gpl',
    statusbar: false,
    promotion: false,
    menubar: true,
    language: 'ru',
    plugins: 'lists emoticons',
    // forced_root_block: 'div',
    // newline_behavior: 'linebreak',
    toolbar: 'fontfamily fontsize | bold italic underline | alignleft aligncenter alignright alignjustify | emoticons | backcolor forecolor removeformat | bullist numlist outdent indent | undo redo',
    mobile: {
        toolbar_mode: 'floating'
    }
})