'use strict';

var jwt = require('jsonwebtoken')
var uuid4 = require('uuid4');
var fs = require('fs')
var request = require('request');

var REST_API_CONFIG = {
  "version": "1.0",
  "type": "rest_api",
  "private_key_id": "52b2f80a-1222-496a-b8d8-fbc0250c8952",
  "private_key": "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEINRwxmizMdBh/MZ05OReqUrhDcTol9WjAse8PbM/p3hYoAoGCCqGSM49\nAwEHoUQDQgAE1B8J0hctmNleaUVHqkrB4hhXZZRucQHPBU4V+9hItqC9rYy0Q/UE\nNWOhGbTW65iv9MmWT/SRObhUBaYpd3/Dbg==\n-----END EC PRIVATE KEY-----\n\n",
  "app_uri": "https://rest-api.high-mobility.com/auto/v1",
  "app_id": "B6FA99A2FD899DD5A4B3AA1A"
}

var payload = {
  'api_version': REST_API_CONFIG.version,
  'app_id': REST_API_CONFIG.app_id,
  'aud': REST_API_CONFIG.app_uri,
  'iat': Math.round(Date.now()/1000),
  'jti': uuid4(),
  'access_token': "83cbb849-df76-4006-b219-35f48cf5737f",
};

var privateKey = Buffer.from(REST_API_CONFIG.private_key, 'utf8')
var jwtToken = jwt.sign(payload, privateKey, { algorithm: 'ES256' })

var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var app = express();

require('./ensto/ensto')

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});
// Start the server
var configPort = process.env.PORT;
var port = (configPort !== undefined ? configPort : 3000);
var server = app.listen(port, function () {
    console.log('Listening on port ' + server.address().port);
});

app.get('/getDiagnostics', function(req, callback){
  //console.log("EQ API");
  request.get({
    url: REST_API_CONFIG.app_uri + '/diagnostics',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

app.get('/getLocation', function(req, callback){
  request.get({
    url: REST_API_CONFIG.app_uri + '/location',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

app.get('/getCharging', function(req, callback){
  request.get({
    url: REST_API_CONFIG.app_uri + '/charging',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

app.put('/startCharging', function(req, callback){
  request.put({
    url: REST_API_CONFIG.app_uri + '/charging/start',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

var stopCharging = function(req, callback){
  request.put({
    url: REST_API_CONFIG.app_uri + '/charging/stop',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
}

app.put('/setChargingLimit', function(callback,data){
  request.put({
    url: REST_API_CONFIG.app_uri + '/charging/limit',
    headers: {
      'Authorization': 'Bearer ' + jwtToken,
    },
    body: {
      'chargeLimit': data
    },
    json: true
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

app.get('/getUsage', function(req, callback){
  request.get({
    url: REST_API_CONFIG.app_uri + '/usage',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

app.get('/getNavi',function(req, callback){
  request.get({
    url: REST_API_CONFIG.app_uri + '/navi/destination',
    headers: {
      'Authorization': 'Bearer ' + jwtToken
    }
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});

app.put('/setNavi',function(callback,data){
  request.put({
    url: REST_API_CONFIG.app_uri + '/navi/destination',
    headers: {
      'Authorization': 'Bearer ' + jwtToken,
    },
    body:
    {
      'coordinates': {
        'latitude': data.latitude,
        'longitude': data.longitude
    },
      'destinationName': data.name
    },
    json: true
  }, (error, response, body) => {
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    callback.send(body);
  });
});
