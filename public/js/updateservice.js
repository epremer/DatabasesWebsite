function updateservice(id){
    $.ajax({
        url: '/services/' + id,
        type: 'PUT',
        data: $('#update-service').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
