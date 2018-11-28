function deletetherapist(id){
    $.ajax({
        url: '/therapists/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
