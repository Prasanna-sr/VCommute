//This is a DB utility module.. Currently it supports MongoDB but will support others soon
//todo need to refactor

var cloudfoundry = require('cloudfoundry');
var mongodb = require('mongoskin');

module.exports = {
    connect: function(dbType, dbServiceName, callback) {
        console.log(dbType);
        if (dbType == 'mongodb') {
            return mongodb.db(getMongoUrl(dbServiceName));
        }
    },
    getMongoUrl: getMongoUrl
};

function getMongoUrl(dbServiceName) {
    var mongoUrl;
    var credentials = {
        "hostname": "localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "name": "",
        "db": "test"
    }
    if (cloudfoundry.cloud && cloudfoundry.mongodb) {
        var service;
        if(dbServiceName) {
            service = cloudfoundry.mongodb[dbServiceName];
        } else {//select first one
            for( var name in cloudfoundry.mongodb) {
                service = cloudfoundry.mongodb[name];
                break;
            };
        }
        if(service) {
            credentials = service.credentials;
        }
    }
    if (credentials.username && credentials.password) {
        mongoUrl = "mongodb://" + credentials.username + ":" + credentials.password + "@" + credentials.hostname + ":" + credentials.port + "/" + credentials.db;
    } else {
        mongoUrl = "mongodb://" + credentials.hostname + ":" + credentials.port + "/" + credentials.db;
    }
    console.log("MongoUrl: " + mongoUrl);
    return mongoUrl;
}
