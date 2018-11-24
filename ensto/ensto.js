'use strict';

var request = require('request');
var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
	next();
});

// Start the server
var configPort = process.env.PORT;
var port = (configPort !== undefined ? configPort : 8888);
var server = app.listen(port, function () {
    console.log('Listening on port ' + server.address().port);
});

var REST_API_CONFIG = {
	URL : 'https://junctionev.enstoflow.com/api/v1/'
}

app.get('/chargingPoint', function (req, res) {
	request.get({
	  url: REST_API_CONFIG.URL + '/chargingPoint',
	  headers: {
		'Authorization': req.get('Authorization')
	  }
	}, (error, response, body) => {
	  res.send(body)
	});
});

app.get('/chargingPoint/:id', function (req, res) {
	request.get({
	  url: REST_API_CONFIG.URL + '/chargingPoint/' + req.params.id,
	  headers: {
		'Authorization': req.get('Authorization')
	  }
	}, (error, response, body) => {
	  res.send(body)
	});
});