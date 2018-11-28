module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAppointment(res, mysql, context, id, complete){
        console.log("getAppointment - BEGIN");
        var sql = "SELECT SELECT a_visit_id, a_client_id, date, time, a_therapist_id, a_service_id, a_location_id FROM Appointments WHERE a_client_id=? AND a_visit_id=?";
        var inserts = [id]; // should be id because of the id param
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }

    function getAppointments(res, mysql, context, complete){
        console.log("getAppointments - BEGIN");
        mysql.pool.query("SELECT a_visit_id, a_client_id, date, time, a_therapist_id, a_service_id, a_location_id FROM Appointments", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results;  // all therapists
            complete();
        });
    }

    function getClients(res,mysql, context, complete) {
        console.log("getClients - BEGIN");
        mysql.pool.query("SELECT c_client_id, c_name_first, c_name_last FROM Clients", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results;
            complete();
        });
    }

    function getTherapists(res,mysql, context, complete) {
        console.log("getTherapists - BEGIN");
        mysql.pool.query("SELECT t_therapist_id, t_name_first, t_name_last FROM Therapists", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.therapists = results;
            complete();
        });
    }

    function getServices(res,mysql, context, complete) {
        console.log("getServices - BEGIN");
        mysql.pool.query("SELECT s_service_id, s_name FROM Services", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.services = results;
            complete();
        });
    }

    function getLocations(res,mysql, context, complete) {
        console.log("getLocations - BEGIN");
        mysql.pool.query("SELECT l_location_id, l_name FROM Locations", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    function getTherapist(res, mysql, context, id, complete){
        console.log("getTherapist - BEGIN");
        var sql = "SELECT t_therapist_id, t_name_first, t_name_last FROM Therapists WHERE t_therapist_id=?";
        var inserts = [id]; // should be id because of the id param
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.therapists = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }

    function getClient(res, mysql, context, id, complete){
        console.log("getClient - BEGIN");
        var sql = "SELECT c_client_id, c_name_first, c_name_last FROM Clients WHERE c_client_id=?";
        var inserts = [id]; // should be id because of the id param
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }
    function getService(res, mysql, context, id, complete){
        console.log("getService - BEGIN");
        var sql = "SELECT s_service_id, s_name FROM Services WHERE s_service_id=?";
        var inserts = [id]; // should be id because of the id param
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.services = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }

    function getLocation(res, mysql, context, id, complete){
        console.log("getLocation - BEGIN");
        var sql = "SELECT l_location_id, l_name FROM Locations WHERE l_location_id=?";
        var inserts = [id]; // should be id because of the id param
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }



    /*Display all appointments. Requires web based javascript to delete appts with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        console.log("GET ALL APPOINTMENTS - BEGIN");
        context.jsscripts = ["deleteappointment.js"];
        var mysql = req.app.get('mysql');
        getAppointment(res, mysql, context, complete);
        getClient(res, mysql, context, complete);
        getTherapist(res, mysql, context, complete);
        getService(res, mysql, context, complete);
        getLocation(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 5){
                res.render('appointments', context);
            }
        }
    });

    /* Display one appointment for the specific purpose of updating appointments */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedclient.js", "selectedtherapist.js", "selectedservice.js", "selectedlocation.js", "updateappointment.js"];
        var mysql = req.app.get('mysql');
        getAppointment(res, mysql, context, req.params.id, complete);
        getClient(res, mysql, context, req.params.id,  complete);
        getTherapist(res, mysql, context, req.params.id,  complete);
        getService(res, mysql, context, req.params.id,  complete);
        getLocation(res, mysql, context, req.params.id,  complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 5){
                res.render('update-appointment', context);
            }

        }
    });

    // Adds an appointment redirects to the appointmnets page after adding
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Appointments (date, time) VALUES (?,?)";
        var inserts = [req.body.date, req.body.time];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/appointments');
            }
        });
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Appointments (date, time) VALUES (?,?)";
        var inserts = [req.body.date, req.body.time];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
          console.log("IN POST - ERROR IN FIRST SQL STMT");
                res.write(JSON.stringify(error));
                res.end();
            }
            else{
          console.log("IN POST - FIRST ELSE STMT - CLIENT: " + req.body.client);
                var sql2 = "INSERT INTO Therapists_positions (tp_therapist_id, tp_position_id) VALUES ((SELECT t_therapist_id FROM Therapists WHERE t_name_first=? AND t_name_last=?), ?)";
                var inserts2 = [req.body.t_name_first, req.body.t_name_last, req.body.position];
                sql2 = mysql.pool.query(sql2,inserts2,function(error, results, fields){
                  if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                     else{
                console.log("IN POST - SECOND ELSE STMT - CERTS: " + req.body.certs);
                      var sql3 = "INSERT INTO Therapists_certs (tc_therapist_id, tc_cert_id, date_acquired, date_expires) VALUES ((SELECT t_therapist_id FROM Therapists WHERE t_name_first=? AND t_name_last=?), ?, ?, ?)";

                      var inserts3 = [req.body.t_name_first, req.body.t_name_last, req.body.certs, req.body.date_acquired, req.body.date_expires];
                      sql3 = mysql.pool.query(sql3,inserts3,function(error, results, fields){
                        if(error){
                              res.write(JSON.stringify(error));
                              res.end();
                          }
                          // else{
                          //     res.redirect('/therapists');
                          // }
                      });
                    }
                });
            }
            res.redirect('/appointments');
        });
    });



    return router;
}();
