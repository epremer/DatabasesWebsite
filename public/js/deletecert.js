function deletecert(therapist_id, cert_id){
    $.ajax({
        url: '/therapists/' + therapist_id + '/c/' + cert_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
