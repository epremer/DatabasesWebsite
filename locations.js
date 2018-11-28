module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT l_location_id, l_name, address_st, address_city, address_state, address_zip FROM Locations", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations  = results;
            complete();
        });
    }

    function getLocation(res, mysql, context, id, complete){
        var sql = "SELECT l_location_id, l_name, address_st, address_city, address_state, address_zip FROM Locations WHERE l_location_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results[0];
            complete();
        });
    }

    /*Display all locations. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelocation.js"];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('locations', context);
            }
        }
    });

    /* Display one location for the specific purpose of updating locations */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedlocation.js", "updatelocation.js"];
        var mysql = req.app.get('mysql');
        getLocation(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-location', context);
            }
        }
    });

    /* Adds a location, redirects to the locations page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Locations (l_name, address_st, address_city, address_state, address_zip) VALUES (?,?,?,?,?)";
        var inserts = [req.body.l_name, req.body.address_st, req.body.address_city, req.body.address_state, req.body.address_zip];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/locations');
            }
        });
    });

    /* The URI that update data is sent to in order to update a location */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Locations SET l_name=?, address_st=?, address_city=?, address_state=?, address_zip=? WHERE l_location_id=?";
        var inserts = [req.body.l_name, req.body.address_st, req.body.address_city, req.body.address_state, req.body.address_zip, req.params.l_location_id];
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

    /* Route to delete a location, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Locations WHERE l_location_id = ?";
        var inserts = [req.params.l_location_id];
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
