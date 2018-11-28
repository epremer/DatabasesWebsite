function updateposition(id){
    $.ajax({
        url: '/positions/' + id,
        type: 'PUT',
        data: $('#update-position').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
