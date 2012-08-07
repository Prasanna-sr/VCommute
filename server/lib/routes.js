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

    // profile page
    app.get('/getlocationtimedata', function (req, res) {
        //todo remove this in production
        res.header('Access-Control-Allow-Origin', '*');
        res.send(config);
    });

    app.get('/getuserProfile', function (req, res) {
        mongoLib.getuserProfile(req, function (err, userObj) {
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
    });

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
                    userObj.error=null;
                    res.send(userObj);
                }
            }
        });
    });

    app.post('/getinfo', function (req, res) {
        var loc;
        var obj = req.body;
        mongoLib.getUserInfo(req, function (err, userObj) {
            if (err) {
                console.log(err);
            }
            else {
                if (userObj != "") {
                    if (obj.journey == 0) {
                        loc = userObj.fromLocation1 + "_" + userObj.toLocation1;

                    } else if (obj.journey == 1) {
                        loc = userObj.fromLocation2 + "_" + userObj.toLocation2;
                    }
                    req.body.location = loc;
                    mongoLib.getTimedetails(req, function (err, timeObj) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if (req.body.journey == 0) {
                                req.body.fromLocation = userObj.fromLocation1;
                                req.body.toLocation = userObj.toLocation1;
                                req.body.time = userObj.startTime;
                                mongoLib.getUserDetails1(req, function (err, listObj) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        if (listObj != "") {
                                            var obj = {
                                                "userObj":userObj,
                                                "timeObj":timeObj,
                                                "LocObj":config,
                                                "listObj":listObj
                                            }
                                            //todo remove this in production
                                            res.header('Access-Control-Allow-Origin', '*');
                                            res.send(obj);
                                        }
                                    }
                                });

                            } else if (req.body.journey == 1) {
                                req.body.fromLocation = userObj.fromLocation2;
                                req.body.toLocation = userObj.toLocation2;
                                req.body.time = userObj.departTime;
                                mongoLib.getUserDetails2(req, function (err, listObj) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        if (listObj != "") {
                                            var obj = {
                                                "userObj":userObj,
                                                "timeObj":timeObj,
                                                "LocObj":config,
                                                "listObj":listObj
                                            }
                                            //todo remove this in production
                                            res.header('Access-Control-Allow-Origin', '*');
                                            res.send(obj);
                                        }
                                    }
                                });
                            }
                        }
                    });

                }
            }
        });

    });


    app.post('/saveprofile', function (req, res) {
        mongoLib.updateUserDetails(req.body, function (err) {
            if (err) {
                console.log("Error at save profile"+ err);
                res.header('Access-Control-Allow-Origin', '*');
                res.send('Error'+ err);
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

    app.post('/getNotifications', function (req, res) {
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

    //unread
//    app.post('/updateNotifications', function (req, res) {
//        mongoLib.updateNotifications(req.body, function (err, json) {
//            if (err) {
//                console.log(err);
//            }
//            else {
//                //todo remove this in production
//                res.header('Access-Control-Allow-Origin', '*');
//                res.send(json);
//
//            }
//
//        });
//
//    });

    app.post('/Locationdetails',
        function (req, res) {
            mongoLib.getLocation(req, function (err, LocObj) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (LocObj != null) {
                        //todo remove this in production
                        res.header('Access-Control-Allow-Origin', '*');
                        res.send(LocObj);
                    }

                }
            });
        });

    app.post('/getTimeUserData',
        function (req, res) {
            mongoLib.getTimedetails(req, function (err, timeObj) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (req.body.journey == 0) {
                        mongoLib.getUserDetails1(req, function (err, listObj) {
                            if (err) {
                                console.log(err);
                            } else {
                                var obj = {"listObj":listObj,
                                    "timeObj":timeObj};

                                //todo remove this in production
                                res.header('Access-Control-Allow-Origin', '*');
                                res.send(obj);
                            }
                        });
                    } else {
                        mongoLib.getUserDetails2(req, function (err, listObj) {
                            if (err) {
                                console.log(err);
                            } else {
                                var obj = {"listObj":listObj,
                                    "timeObj":timeObj};

                                //todo remove this in production
                                res.header('Access-Control-Allow-Origin', '*');
                                res.send(obj);
                            }
                        });
                    }

                }
            });
        });

    app.post('/getUserDetails',
        function (req, res) {
            getUserDetails(req, res);
        });

    app.get('/getPreferenceDetails',
        function (req, res) {
            getuserPreferencedetails(req, res);
        });


    //todo
    //store data
    app.get('/storedata', function (req, res) {
        mongoLib.storeLocationTimedata(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.send(JSON.stringify(data));

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

    function getUserDetails(req, res) {

        if (req.body.journey == 0) {
            mongoLib.getUserDetails1(req, function (err, userObj) {
                if (err) {
                    console.log(err);
                }
                else {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(userObj);
                }
            });

        } else {
            mongoLib.getUserDetails2(req, function (err, userObj) {
                if (err) {
                    console.log(err);
                }
                else {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(userObj);
                }
            });
        }
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
       return  { url:'https://vmware-com.socialcast.com/api/authentication.json', body:'email=' + body.user + '@vmware.com&password=' + body.password };
    }

    function handleSocialcastSuccess(req, res, socialcastError, socialcastResponse, socialcastData) {
            email = (req.body.user).toLowerCase() + '@vmware.com';
            mongoLib.getUserInfo(email, function (err, userObj) {
                if (err) {
                    console.log('INTERNAL SERVER ERROR ' + err);
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send('INTERNAL SERVER ERROR');
                } else if (!userObj || (userObj && userObj.profile == 0)) {
                    console.log(JSON.parse(socialcastData));
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
};