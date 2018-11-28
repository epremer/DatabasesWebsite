function updatetherapist(id){
    $.ajax({
        url: '/therapists/' + id,
        type: 'PUT',
        data: $('#update-therapist').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
