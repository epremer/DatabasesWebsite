function updatecert(id){
    $.ajax({
        url: '/certs/' + id,
        type: 'PUT',
        data: $('#update-cert').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
