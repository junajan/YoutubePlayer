var express = require("express");
var app = express();

var sys = require("sys"),  
	fs = require("fs");  


var config = require('./config/config')(express, app);
//var mysql = new require('./lib/mysql')( config.databaseMySQL );

common = require ( "./lib/common");
_ = require('underscore');

//var Mongo = require('mongojs').connect(config.mongo.uri+"/" + config.mongo.dbName, ["msg"]);

appListen = app.listen(config.port)

global = {
    app     : appListen,
//    DB      : mysql,
    config  : config
}

console.log("Listening on port " + config.port);

app.use(common.createLocals);
//app.use(common.testLogin);

// set routers
var routers = require(__dirname + "/routers/routers.js")(app, global);
