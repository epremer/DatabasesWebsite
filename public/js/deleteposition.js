function deleteposition(therapist_id, position_id){
    $.ajax({
        url: '/therapists/' + therapist_id + '/p/' + position_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
