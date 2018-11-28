module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCerts(res, mysql, context, complete){
        mysql.pool.query("SELECT c_cert_id, c_name FROM Certs", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.certs  = results;
            complete();
        });
    }

    function getCert(res, mysql, context, id, complete){
         var sql = "SELECT c_cert_id, c_name FROM Certs WHERE c_cert_id=?";
   	    var inserts = [id];
         mysql.pool.query(sql, inserts, function(error, results, fields){
             if(error){
                 res.write(JSON.stringify(error));
                 res.end();
             }
             context.certs = results[0];
             complete();
          });
     }


    /*Display all certs. Requires web based javascript to delete certs with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecert.js"];
        var mysql = req.app.get('mysql');
        getCerts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('certs', context);
            }
        }
    });

    /* Display one cert for the specific purpose of updating certs */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedcert.js", "updatecert.js"];
        var mysql = req.app.get('mysql');
        getCert(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-cert', context);
            }

        }
    });

    /* Adds a cert, redirects to the certs page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Certs (c_name) VALUES (?)";
        var inserts = [req.body.c_name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/certs');
            }
        });
    });

    /* The URI that update data is sent to in order to update a certs */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Certs SET c_name=? WHERE c_cert_id=?";
        var inserts = [req.body.c_name, req.params.c_cert_id];
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

    /* Route to delete a cert, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Certs WHERE c_cert_id = ?";
        var inserts = [req.params.c_cert_id];
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
