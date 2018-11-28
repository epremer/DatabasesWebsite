module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getPositions(res, mysql, context, complete){
        mysql.pool.query("SELECT p_position_id, p_name FROM Positions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions = results;
            complete();
        });
    }

    function getPosition(res, mysql, context, id, complete){
        var sql = "SELECT p_position_id, p_name FROM Positions WHERE p_position_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions = results[0];
            complete();
        });
    }

    /*Display all positions. Requires web based javascript to delete positions with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteposition.js"];
        var mysql = req.app.get('mysql');
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('positions', context);
            }
        }
    });

    /* Display one position for the specific purpose of updating positions */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedposition.js", "updateposition.js"];
        var mysql = req.app.get('mysql');
        getPosition(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-position', context);
            }

        }
    });

    /* Adds a position, redirects to the positions page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Positions (p_name) VALUES (?)";
        var inserts = [req.body.p_name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/positions');
            }
        });
    });

    /* The URI that update data is sent to in order to update a position */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Positions SET p_name=? WHERE p_position_id=?";
        var inserts = [req.body.p_name, req.params.p_position_id];
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

    /* Route to delete a position, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Positions WHERE p_position_id = ?";
        var inserts = [req.params.p_position_id];
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
