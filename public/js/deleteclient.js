function deleteclient(id){
    $.ajax({
        url: '/clients/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
