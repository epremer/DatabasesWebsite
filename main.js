var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));

//app.use(express.static("public"));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 9110);
app.set('mysql', mysql);


/* The pages to be visited by user */
app.use('/', require('./home.js'));
app.use('/people', require('./people.js'));
app.use('/clients', require('./clients.js'));
app.use('/therapists', require('./therapists.js'));
app.use('/services', require('./services.js'));
app.use('/appointments', require('./appointments.js'));
app.use('/locations', require('./locations.js'));
app.use('/positions', require('./positions.js'));
app.use('/certs', require('./certs.js'));


app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log('Your website is currently live on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
