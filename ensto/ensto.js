'use strict';

var request = require('request');
var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var app = express();
var cron = require('node-cron');


var chargeBookHours = [
	{
		day: '22/07/2018', bookedHours : [
			{hour: '19', rfid : 'aaa', chargingPoint: 7},
			{hour :'20', rfid: 'bbbb', chargingPoint: 6}
		]
	}
]

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json())

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

app.get('/getParentPermissions/:id', function (req, res) {
	request.get({
	  url: REST_API_CONFIG.URL + '/idTag' + req.params.id,
	  headers: {
		'Authorization': req.get('Authorization')
	  }
	}, (error, response, body) => {
	  res.send(body)
	});
});

app.get('/bookedHours', function (req, res) {
	res.send(chargeBookHours)
});

app.push('/chargingPoint/:id', function (req, res) {
	request.post({
	  url: REST_API_CONFIG.URL + 'idTag/' + req.params.id + '/chargingPoint',
	  headers: {
		'Authorization': req.get('Authorization')
		},
		body: req.body,
    json: true
	}, (error, response, body) => {
		console.log(body)
	});
});

app.post('/bookedHours', function(req, res){
	var body = req.body;
	
	var found = false;
	for (var i = 0; i < chargeBookHours.length; i++){
		if (chargeBookHours[i].date == body.date){
			chargeBookHours[i].bookedHours.push(	{hour: body.hour+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint})
			chargeBookHours[i].bookedHours.push(	{hour: (body.hour+1)+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint})
			chargeBookHours[i].bookedHours.push(	{hour: (body.hour+2)+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint})
			chargeBookHours[i].bookedHours.push(	{hour: (body.hour+3)+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint})
		}
	}
	if (!found){
		chargeBookHours.push({
			day: body.date,
			bookedHours : [
					{hour: body.hour+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint},
					{hour: (body.hour+1)+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint},
					{hour: (body.hour+2)+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint},
					{hour: (body.hour+3)+"", rfid : body.rfid, chargingPoint: req.body.chargingPoint}
				]

		})		
	}

	var startDate = new Date();
	startDate.setDate(body.date.split('/')[0]);
	startDate.setMonth(parseInt(body.date.split('/')[1])-1);
	startDate.setFullYear(body.date.split('/')[2]);
	startDate.setHours(body.hour);


	var obj = {
		"value" : body.rfid,
		"updated" : new Date().getTime(),
		"startDate" : startDate.getTime(),
		"endDate" : startDate.getTime()+10
	}
	console.log(obj)

	request.post({
	  url: REST_API_CONFIG.URL + 'idTag/' + body.id + '/value',
	  headers: {
		'Authorization': req.get('Authorization')
		},
		body: obj,
    json: true
	}, (error, response, body) => {
		console.log(body)
	});

	console.log(req.body);
})

//cron.schedule('*/5 * * * *', () => {
  //disableChargingPoints();
//});

function disableChargingPoints(){
	var date = new Date();
	var month = date.month() + 1;
	month = month < 10 ? '0' + month : month;
	var mask = date.date() + '/' + month + '/' + date.year();

	chargeBookHours.forEach(function(chargebookhour){
		if (chargebookhour.date == mask){
			chargebookhour.bookedHours.forEach(function(hours){
				if (hours.hour == date.getHours()){
					// /api/v1/chargingPoint/{identifier}/{connectorId}/statusinoperative
					request.get({
						url: REST_API_CONFIG.URL + '/chargingPoint/' + hours.chargingPoint,
						headers: {
						'Authorization': req.get('Authorization')
						}
					}, (error, response, body) => {
						body.connectors.forEach(function(connector){
							if (connector.status == 'Available'){
								request.get({
									url: REST_API_CONFIG.URL + '/chargingPoint/' + body.identifier + '/0/statusinoperative',
									headers: {
									'Authorization': req.get('Authorization')
									}
								}, (error, response, body) => {
								});
								break;
							} else if (connector.status == 'SuspendedEV'){
								request.get({
									url: REST_API_CONFIG.URL + '/chargingPoint/' + body.identifier + '/0/statusoperative',
									headers: {
									'Authorization': req.get('Authorization')
									}
								}, (error, response, body) => {
								});
								break;
							}
						})
					});
				}
			})
		}
	})
}
