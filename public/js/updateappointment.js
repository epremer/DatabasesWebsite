function updateappointment(id){
    $.ajax({
        url: '/appointments/' + id,
        type: 'PUT',
        data: $('#update-appointment').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
