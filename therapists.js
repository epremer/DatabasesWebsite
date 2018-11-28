module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getPosition(res,mysql, context, complete) {
        mysql.pool.query("SELECT p_position_id, p_name FROM Positions", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions = results;
            complete();
        });
    }

    function getCert(res,mysql, context, complete) {
        mysql.pool.query("SELECT c_cert_id, c_name FROM Certs", function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.certs = results;
            complete();
        });
    }


    function getTherapists(res, mysql, context, complete){
        mysql.pool.query("SELECT t_therapist_id, t_name_first, t_name_last FROM Therapists ORDER BY t_name_last, t_name_first", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.therapists  = results;  // all therapists
            complete();
        });
    }



    function getTherapistCert(res, mysql, context, therapist_id, cert_id, complete){
        console.log("getTherapistCert BEGIN");
        var sql = "SELECT t_therapist_id, t_name_first, t_name_last, c_cert_id, c_name, DATE_FORMAT(`date_acquired`, '%Y-%m-%d') AS `date_acquired`, DATE_FORMAT(`date_expires`, '%Y-%m-%d') AS `date_expires` FROM Therapists LEFT JOIN Therapists_certs ON t_therapist_id=tc_therapist_id LEFT JOIN Certs ON tc_cert_id=c_cert_id WHERE t_therapist_id=? AND c_cert_id=?";
        var inserts = [therapist_id, cert_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("getTherapistCert FAILS");
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log("getTherapistCert SUCCESS");
            context.therapists = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }

    function getTherapistPos(res, mysql, context, therapist_id, complete){
        var sql = "SELECT t_therapist_id, t_name_first, t_name_last, p_position_id, p_name FROM Therapists LEFT JOIN Therapists_positions ON t_therapist_id=tp_therapist_id LEFT JOIN Positions ON tp_position_id=p_position_id WHERE t_therapist_id=?";
        var inserts = [therapist_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.therapists = results[0];  // just the one therapist where t_id=?
            complete();
        });
    }

    function getTherapistsPosAndCert(res, mysql, context, complete){
        mysql.pool.query("SELECT t_therapist_id, t_name_first, t_name_last, p_name, p_position_id, c_name, c_cert_id, DATE_FORMAT(`date_acquired`, '%Y-%m-%d') AS `date_acquired`, DATE_FORMAT(`date_expires`, '%Y-%m-%d') AS `date_expires` FROM Therapists LEFT JOIN Therapists_positions ON t_therapist_id=tp_therapist_id LEFT JOIN Positions ON tp_position_id=p_position_id LEFT JOIN Therapists_certs ON t_therapist_id=tc_therapist_id LEFT JOIN Certs ON tc_cert_id=c_cert_id ORDER BY t_name_last, t_name_first, p_position_id, c_cert_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.therapistsposandcert  = results;  // all therapists
            complete();
        });
    }



    /*Display all therapists. Requires web based javascript to delete therapists with AJAX*/
    router.get('/', function(req, res){   // 'therapists/'
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletetherapist.js", "deleteposition.js", "deletecert.js"];
        var mysql = req.app.get('mysql');
        getTherapistsPosAndCert(res,mysql,context,complete);
        getTherapists(res, mysql, context, complete);
        getPosition(res, mysql, context, complete);
        getCert(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('therapists', context);  // .handlebars
            }

        }
    });



    /* Display one therapist for the specific purpose of updating therapists */
    router.get('/:id', function(req, res){    //'therapists/:id'
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedposition.js", "updatetherapist.js"];
        var mysql = req.app.get('mysql');
        getTherapistPos(res, mysql, context, req.params.id, complete);
        getPosition(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-therapist', context);
            }

        }
    });

    /* Adds a therapist, redirects to the therapists page after adding */
    router.post('/', function(req, res){
      console.log("ADDING A THERAPIST WITH POSITION");
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Therapists (t_name_first, t_name_last) VALUES (?,?)";
        var inserts = [req.body.t_name_first, req.body.t_name_last];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
      		console.log("IN POST - ERROR IN FIRST SQL STMT");
                res.write(JSON.stringify(error));
                res.end();
            }
            else{

                console.log("IN POST - FIRST ELSE STMT - POSITION: " + req.body.position);
                if(req.body.position !== undefined)
                {
                    var position = req.body.position;
                    if(!Array.isArray(req.body.position))
                    {
                          position = [req.body.position];
                    }
                    console.log("POSITION FINAL: " + position);
                    console.log("ABOUT TO INSERT INTO Therapists_positions");
                    position.forEach(function (pos) {
                          var sql2 = "INSERT INTO Therapists_positions (tp_therapist_id, tp_position_id) VALUES ((SELECT t_therapist_id FROM Therapists WHERE t_name_first=? AND t_name_last=?), ?)";
                          var inserts2 = [req.body.t_name_first, req.body.t_name_last, pos];
                          sql2 = mysql.pool.query(sql2,inserts2,function(error, results, fields){
                              if(error){
                                    res.write(JSON.stringify(error));
                                    res.end();
                                }
                                // else{
                                //     res.redirect('/therapists');
                                // }
                          });
                    });
                }
            }
            res.redirect('/therapists');
        });
    });


    /* Assign a cert to a therapist, redirects to the therapists page after adding */
    router.post('/add', function(req, res){
      console.log("ASSIGNING A CERT TO A THERAPIST");
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Therapists_certs (tc_therapist_id, tc_cert_id, date_acquired, date_expires) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.therapist, req.body.certs, req.body.date_acquired, req.body.date_expires];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
      		console.log("IN POST - ERROR IN FIRST SQL STMT");
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect('/therapists');
        });
    });

    /* The URI that update data is sent to in order to update a therapist */
    router.put('/:id', function(req, res){
        console.log("UPDATE THERAPIST AND POSITION - QUERY 1");
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Therapists SET t_name_first=?, t_name_last=? WHERE t_therapist_id=?";
        var inserts = [req.body.t_name_first, req.body.t_name_last, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log("UPDATE THERAPIST AND POSITION - QUERY 2: t_id, position: " + req.params.id + req.body.position);
                if(req.body.position !== undefined) // at least one pos is selected
                {
                    var position = req.body.position;
                    if(!Array.isArray(req.body.position)) // if it's not an array, only 1 pos is selected
                    {
                          position = [req.body.position]; // make it an array
                          var sql2 = "DELETE FROM Therapists_positions WHERE tp_therapist_id=?";
                          var inserts2 = [req.params.id];
                          sql2 = mysql.pool.query(sql2,inserts2,function(error, results, fields){
                              if(error){
                                    res.write(JSON.stringify(error));
                                    res.end();
                                }else{
                                  res.status(200);
                                  res.end();
                                }
                          });
                    }
                    console.log("POSITION FINAL: " + position);
                    position.forEach(function (pos) {
                          console.log("ABOUT TO INSERT INTO Therapists_positions: " + pos);
                          var sql3 = "INSERT INTO Therapists_positions (tp_therapist_id, tp_position_id) VALUES (?,?)";
                          var inserts3 = [req.params.id, pos];
                          sql3 = mysql.pool.query(sql3,inserts3,function(error, results, fields){
                              if(error){
                                    console.log("POSITION NOT INSERTED: " + position);
                                    res.write(JSON.stringify(error));
                                    res.end();
                                }else{
                                  res.status(200);
                                  res.end();
                                }
                          });
                    });
                }else{
                    var sql4 = "DELETE FROM Therapists_positions WHERE tp_therapist_id=?";
                    var inserts4 = [req.params.id];
                    sql4 = mysql.pool.query(sql4,inserts4,function(error, results, fields){
                        if(error){
                              res.write(JSON.stringify(error));
                              res.end();
                          }else{
                            res.status(200);
                            res.end();
                          }
                    });
                }
                // res.status(200);
                // res.end();
            }
        });
    });

    /* The URI that update data is sent to in order to update a therapist's certification */
    router.put('/:therapist_id/c/:cert_id', function(req, res){
        console.log("UPDATE THERAPIST CERT INFO - acquired, expires, t_id, c_id: " + req.body.date_acquired + req.body.date_expires + req.params.therapist_id + req.params.cert_id);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Therapists_certs SET date_acquired=?, date_expires=? WHERE tc_therapist_id=? AND tc_cert_id=?";
        var inserts = [req.body.date_acquired, req.body.date_expires, req.params.therapist_id, req.params.cert_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("ERROR in Updating Therapist's Cert (PUT)");
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log("UPDATE THERAPIST CERT INFO: STATUS 200");
                res.status(200);
                res.end();
            }
        });
    });

    /* Display the therapist's certification on update-therapist-cert */
    router.get('/:therapist_id/c/:cert_id', function(req, res){
        console.log("DISPLAY THERAPIST CERT INFO");
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatetherapistcert.js"];
        var mysql = req.app.get('mysql');
        getTherapistCert(res, mysql, context, req.params.therapist_id, req.params.cert_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log("HERE 03");
                res.render('update-therapist-cert', context);
            }
        }
    });


    /* Route to delete a therapist, simply returns a 202 upon success. Ajax will handle this. */
    /* delete entire therapist and all associations with that one therapist */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Therapists WHERE t_therapist_id=?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    /* 'delete position from this therapist' button */
    router.delete('/:therapist_id/p/:position_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Therapists_positions WHERE tp_therapist_id = ? AND tp_position_id=?";
        var inserts = [req.params.therapist_id, req.params.position_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    /* 'delete cert from this therapist' button */
    router.delete('/:therapist_id/c/:cert_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Therapists_certs WHERE tc_therapist_id=? AND tc_cert_id=?";
        var inserts = [req.params.therapist_id, req.params.cert_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })


    return router;
}();
