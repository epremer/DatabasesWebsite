function deleteappointment(id){
    $.ajax({
        url: '/appointments/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
