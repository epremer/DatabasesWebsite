function updatePerson(id){
    $.ajax({
        url: '/client/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
