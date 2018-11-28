function deleteservice(id){
    $.ajax({
        url: '/services/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
