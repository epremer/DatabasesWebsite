function updatetherapistcert(therapist_id, cert_id){
    console.log("In updatetherapistcert.js");
    $.ajax({
        url: '/therapists/' + therapist_id + '/c/' + cert_id,
        type: 'PUT',
        data: $('#update-therapist-cert').serialize(),
        success: function(result){
            window.location.replace("./../../");
        }
    })
};
