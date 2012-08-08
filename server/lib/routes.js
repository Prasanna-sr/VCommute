//routes

var mongoLib = require('./mongoLib');
var request = require('request');
var config =require('./config');

mongoLib.connect('mongodb-1');

module.exports = function routes(app) {
    app.post('/login', function (req, res) {
        request.post(getSocialcastAuthObj(req.body), function (socialcastError, socialcastResponse, socialcastData) {
            if (!socialcastError && socialcastResponse.statusCode == 200) {
                console.log('User successfully authenticated against Socialcast');
                handleSocialcastSuccess(req, res, socialcastError, socialcastResponse, socialcastData);
            } else {
                console.log('Error response code is ' + socialcastResponse.statusCode);
                handleSocialcastFailure(req, res, socialcastError, socialcastResponse, socialcastData);
            }
        });
    });

    // profile, details & info Page
    app.post('/getuserinfo', function (req, res) {
        mongoLib.getUserInfo(req.body.email, function (err, userObj) {
            if (err) {
                console.log("error at getuserinfo"+ err);
                res.send({"error":err});
            }
            else {
                if (userObj != "") {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    //userObj.error = "";
                    res.send(userObj);
                }
            }
        });
    });
    // profile page
    app.get('/getlocationtimedata', function (req, res) {
        //todo remove this in production
        res.header('Access-Control-Allow-Origin', '*');
        res.send(config);
    });

    app.post('/saveprofile', function (req, res) {
        mongoLib.updateUserDetails(req.body, function (err) {
            if (err) {
                console.log("Error at save profile"+ err);
                res.header('Access-Control-Allow-Origin', '*');
                res.send({"error":err});
            }  else {
                //update location document
                var obj = getLocationDetails(req);
                mongoLib.updateLocationCounter(obj, function (err, result) {
                    if (err) {
                        console.log("Error at save profile"+ err);
                        res.header('Access-Control-Allow-Origin', '*');
                        res.send('Error'+ err);
                    } else {
                        console.log('profile data saved successfully !')
                        //todo remove this in production
                        res.header('Access-Control-Allow-Origin', '*');
                        res.send(result);
                    }
                });
            }
        });

    });
    //for home page
    app.post('/getinfo', function (req, res) {
        mongoLib.getUserInfo(req.body.email, function (err, userObj) {
            if (err) {
                console.log("Error at getuserinfo" + err);
                res.send({"error":err});
            }
            else {
                if(userObj) {
                if (req.body.journey == 0) {
                    userObj.fromLocation =  userObj.fromLocation1;
                    userObj.toLocation = userObj.toLocation1;
                    userObj.time = userObj.startTime;
                    userObj.location = userObj.fromLocation1 + "_" + userObj.toLocation1;
                }else if (req.body.journey == 1) {
                    userObj.fromLocation =  userObj.fromLocation2;
                    userObj.toLocation = userObj.toLocation2;
                    userObj.time = userObj.departTime;
                    userObj.location = userObj.fromLocation2 + "_" + userObj.toLocation2;
                }
                userObj.skip = req.body.skip;
                getTimeDetails(req, res, userObj);
                } else {
                    console.log("Error at getinfo. No users found in DB");
                    res.send({"error":"Internal Server Error"});

                }

            }
        });
    });
    app.post('/gettimeuserdata',
        function (req, res) {
            var userObj = req.body;
            userObj.skip=0;
            getTimeDetails(req, res, userObj);
        });

    app.post('/getuserlist', function (req, res) {
        var userObj = req.body;
        userObj.skip=0;
        if (userObj.journey == 0) {
            mongoLib.getUserDetailsOnward(userObj, function (err, userObj) {
                if (err) {
                    console.log("Error at getuserlist" +err);
                    res.send({"error" : err});
                }
                else {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    userObj.error=null;
                    res.send(userObj);
                }
            });

        } else {
            mongoLib.getUserDetailsReturn(userObj, function (err, userObj) {
                if (err) {
                    console.log("Error at getuserlist" +err);
                    res.send({"error" : err});
                }
                else {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    userObj.error=null;
                    res.send(userObj);
                }
            });
        }
    });
    //Notifications
    app.post('/saveNotifications',
        function (req, res) {
            mongoLib.persistNotificationData(req.body, function (err, json) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Notification Data persisted successfully !');
                }
            });
            //todo remove this in production
            res.header('Access-Control-Allow-Origin', '*');
            res.send('successfull');
        });

    app.post('/getnotifications', function (req, res) {
        mongoLib.getNotifications(req.body, function (err, json) {
            if (err) {
                console.log(err);
            }
            else {
                //todo remove this in production
                res.header('Access-Control-Allow-Origin', '*');
                res.send(json);
            }
        });

    });

    //Info page
    app.post('/getNotificationbyID', function (req, res) {
        mongoLib.getNotificationbyID(req.body, function (err, json) {
            if (err) {
                console.log(err);
            }
            else {
                //todo remove this in production
                res.header('Access-Control-Allow-Origin', '*');
                res.send(json);
            }
        });

    });

    //todo
    //for development purpose
    //  to view data in mongodb
    app.post('/insertdata', function (req, res) {
        mongoLib.insertData(req.body, function (err, json) {
            if (err) {
                console.log(err);
            }
            else {
                res.header('Access-Control-Allow-Origin', '*');
                res.send(JSON.stringify(json));

            }
        });
    });

    function getTimeDetails(req, res, userObj) {
        var location;
        if (userObj) {

            mongoLib.getTimeDetails(userObj.location, function (err, timeObj) {
                if (err) {
                    console.log("error at gettimedetails" + err);
                    res.send({"error":err});
                }
                else {
                    getUserDetails(req, res, userObj, timeObj);
                }
            });

        } else {
            res.send({"error":"No users found"});
        }
    }

    function getUserDetails(req, res, userObj, timeObj) {
        if (req.body.journey == 0) {
            mongoLib.getUserDetailsOnward(userObj, function (err, listObj) {
                if (err) {
                    console.log("Error at get all onward user details" + err);
                    res.send({"error":err});
                }
                else {
                    var obj = { "userObj":userObj, "timeObj":timeObj, "LocObj":config, "listObj":listObj,"error" : null}
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(obj);
                }
            });
        } else if (req.body.journey == 1) {
            mongoLib.getUserDetailsReturn(userObj, function (err, listObj) {
                if (err) {
                    console.log("Error at get all return user details" + err);
                    res.send({"error":err});
                }
                else {
                    var obj = { "userObj":userObj, "timeObj":timeObj, "LocObj":config, "listObj":listObj,"error" : null}
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(obj);
                }
            });
        }
    }

    function getLocationDetails(req) {
        var locationPrevious = new Array();
        var timePrevious = new Array();

        var locationCurrentOnward = req.body.fromLocation1 + '_' + req.body.toLocation1;
        var locationCurrentReturn = req.body.fromLocation2 + '_' + req.body.toLocation2;
        var timeCurrentStart = req.body.startTime;
        var timeCurrentReturn = req.body.returnTime;

        locationPrevious = (req.body.temp).split(",");
        var locationPreviousOnward = locationPrevious[0] || null;
        var locationPreviousReturn = locationPrevious[1] || null;

        timePrevious = (req.body.temptime).split(",");
        var timePrevStart = timePrevious[0] || null;
        var timePrevReturn  = timePrevious[1] || null;

        var incObjStart = {$inc:{}};
        incObjStart["$inc"]["time." + timeCurrentStart] = 1;
        var incObjReturn = {$inc: {}};
        incObjReturn["$inc"]["time." + timeCurrentReturn] = 1;
        var decObjStart = {$inc: {}};
        decObjStart["$inc"]["time." + timePrevStart] = -1;
        var decObjReturn = {$inc: {}};
        decObjReturn["$inc"]["time." + timePrevReturn] = -1;

        return {"locationCurrentOnward" : locationCurrentOnward, "locationCurrentReturn" : locationCurrentReturn,
            "timeCurrentStart" : timeCurrentStart, "timeCurrentReturn" : timeCurrentReturn, "locationPreviousOnward" : locationPreviousOnward,
            "locationPreviousReturn" : locationPreviousReturn, "timePrevStart" : timePrevStart, "timePrevReturn" : timePrevReturn,
        "incObjStart":incObjStart, "incObjReturn" : incObjReturn, "decObjStart" : decObjStart,"decObjReturn" : decObjReturn }
    }

    //home page functions
    function getuserPreferencedetails(req, res) {
        mongoLib.getuserPreference(req, function (err, userObj) {
            if (err) {
                console.log(err);
            }
            else {
                if (userObj != "") {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(userObj);
                }
            }
        });

    }

    function persistUserProfileAndRespond(userProfile, res) {
        mongoLib.persistUserProfileData(userProfile, function (err, json) {
            res.header('Access-Control-Allow-Origin', '*');
            if (err) {
                console.log(err);
                res.send('LOGIN FAILED');
            }
            else {
                res.send('NEW USER');
            }
        });
    }

    function getSocialcastAuthObj (body) {
       return  { url:'https://vmware-com.socialcast.com/api/authentication.json', body:'email=' + body.user + '&password=' + body.password };
    }

    function handleSocialcastSuccess(req, res, socialcastError, socialcastResponse, socialcastData) {
            email = (req.body.user).toLowerCase();
            mongoLib.getUserInfo(email, function (err, userObj) {
                if (err) {
                    console.log('INTERNAL SERVER ERROR ' + err);
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send('INTERNAL SERVER ERROR');
                } else if (!userObj || (userObj && userObj.profile == 0)) {
                    persistUserProfileAndRespond(JSON.parse(socialcastData), res);
                } else if (userObj.profile == 1) {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send('ALREADY LOGGED IN');
                }
            });
    }

    function handleSocialcastFailure(req, res, socialcastError, socialcastResponse, socialcastData) {
        res.header('Access-Control-Allow-Origin', '*');
        res.send('LOGIN FAILED');
    }

}
