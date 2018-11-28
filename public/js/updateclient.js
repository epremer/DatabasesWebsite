function updateclient(id){
    $.ajax({
        url: '/clients/' + id,
        type: 'PUT',
        data: $('#update-client').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
