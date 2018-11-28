module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getServices(res, mysql, context, complete){
        mysql.pool.query("SELECT s_service_id, s_name FROM Services", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.services = results;
            complete();
        });
    }

    function getService(res, mysql, context, id, complete){
        var sql = "SELECT s_service_id, s_name FROM Services WHERE s_service_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.services = results[0];
            complete();
        });
    }

    /*Display all services. Requires web based javascript to delete servies with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteservice.js"];
        var mysql = req.app.get('mysql');
        getServices(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('services', context);
            }
        }
    });

    /* Display one service for the specific purpose of updating services */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedservice.js", "updateservice.js"];
        var mysql = req.app.get('mysql');
        getService(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-service', context);
            }
        }
    });

    /* Adds a service, redirects to the services page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Services (s_name) VALUES (?)";
        var inserts = [req.body.s_name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/services');
            }
        });
    });

    /* The URI that update data is sent to in order to update a service */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Services SET s_name=? WHERE s_service_id=?";
        var inserts = [req.body.s_name, req.params.s_service_id];
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

    /* Route to delete a service, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Services WHERE s_service_id = ?";
        var inserts = [req.params.s_service_id];
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
