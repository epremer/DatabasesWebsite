module.exports = function(){
    var express = require('express');
    var router = express.Router();

   function getClients(res, mysql, context, complete){
        mysql.pool.query("SELECT c_client_id, c_name_first, c_name_last, phone, email, address_st, address_city, address_state, address_zip, dob FROM Clients", function(error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results;
            complete();
        });
    }

   function getClient(res, mysql, context, id, complete){
        var sql = "SELECT c_client_id, c_name_first, c_name_last, phone, email, address_st, address_city, address_state, address_zip, dob FROM Clients WHERE c_client_id=?";
  	    var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results[0];
            complete();
        });
    }


    /*Display all clients. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteclient.js"];
        var mysql = req.app.get('mysql');
        getClients(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('clients', context);
            }

        }
    });


    /* Display one client for the specific purpose of updating clientS*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateclient.js"];
        var mysql = req.app.get('mysql');
        getClient(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('clients', context);
            }

        }
    });


    /* Adds a client, redirects to the clientS page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Clients (c_name_first, c_name_last, phone, email, address_st, address_city, address_state, address_zip, dob ) VALUES (?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.c_name_first, req.body.c_name_last, req.body.phone, req.body.email, req.body.address_st, req.body.address_city, req.body.address_state, req.body.address_zip, req.body.dob ];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/clients');
            }
        });
    });


    /* The URI that update data is sent to in order to update a person */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Clients SET c_name_first=?, c_name_last=?, phone=?, email=?, address_st=?, address_city=?, address_state=?, address_zip=?, dob=? WHERE c_client_id=?";
        var inserts = [req.body.c_name_first, req.body.c_name_last, req.body.phone, req.body.email, req.body.address_st, req.body.address_city, req.body.address_state, req.body.address_zip, req.body.dob, req.params.c_client_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Clients WHERE c_client_id = ?";
        var inserts = [req.params.c_client_id];
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
