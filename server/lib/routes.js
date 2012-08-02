//routes

var mongoLib = require('./mongoLib');
var request = require('request');
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
        //todo one time storage data
        mongoLib.getLocationTimedata(function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                //todo remove this in production
                res.header('Access-Control-Allow-Origin', '*');
                res.send(data);
            }
        });
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
        mongoLib.getuserInfo(req, function (err, userObj) {
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

    app.post('/getinfo', function (req, res) {
        var loc;
        var obj = req.body;
        mongoLib.getuserInfo(req, function (err, userObj) {
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
                            mongoLib.getLocation(req, function (err, LocObj) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (LocObj != null) {

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
                                                            "LocObj":LocObj,
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
                                                            "LocObj":LocObj,
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

                                }
                            });
                        }
                    });

                }
            }
        });

    });


    app.post('/saveProfile', validatePreferenceDetails,
        function (req, res) {
            //todo remove this in production
            res.header('Access-Control-Allow-Origin', '*');
            res.send('successfull');
            //res.redirect('/mainPage');
            console.log('save completed');
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
    app.post('/viewdata',
        function (req, res) {

            mongoLib.viewData(req.body, function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(JSON.stringify(data));

                }
            });
        });
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
    app.post('/deletedata',
        function (req, res) {
            mongoLib.deleteData(req.body, function (err, json) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Data deleted successfully !');
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(JSON.stringify(json));

                }

            });
        });


    function validatePreferenceDetails(req, res, next) {
        var mobile = req.body.mobile;
        //update user details document
        mongoLib.updateUserdetails(req, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('hey user sucess ');
            }
        });
        //update location document
        mongoLib.updateLocationCounter(req, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(' location success ');
            }
        });
        console.log('main page');
        next();
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
       return  {url:'https://vmware-com.socialcast.com/api/authentication.json', body:'email=' + body.user + '@vmware.com&password=' + body.password};
    }

    function handleSocialcastSuccess(req, res, socialcastError, socialcastResponse, socialcastData) {
            req.body.email = req.body.user + '@vmware.com';
            mongoLib.getuserInfo(req, function (err, userObj) {
                if (err) {
                    console.log('INTERNAL SERVER ERROR ' + err);
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send('INTERNAL SERVER ERROR');
                } else if (!userObj || (userObj && user.profile == 0)) {
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