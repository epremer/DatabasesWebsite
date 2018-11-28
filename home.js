module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /*Display main menu */
    router.get('/', function(req, res){
        var context = {};
        context.jsscripts = ["deleteclient.js"];
        var mysql = req.app.get('mysql');
        res.render('home', context);
    });

    return router;
}();
