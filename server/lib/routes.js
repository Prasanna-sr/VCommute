//routes

var mongoLib = require('./mongoLib');
var request = require('request');

mongoLib.connect('mongodb-1');

module.exports = function routes(app) {

    var errorText;
    var errorText1;
    var login;
    var loginMessage;
    var locationNames = new Array();
    var i = 0;

    app.post('/login',
        function (req, res) {
            console.log('user' + req.body.user);
            console.log('password' + req.body.password);
            request.post({url:'https://vmware-com.socialcast.com/api/authentication.json', body:'email=' + req.body.user + '@vmware.com&password=' + req.body.password}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('login successfull');
                    req.session.user= req.body.user+'@vmware.com';
                    mongoLib.getuserPreference(req, function (err, userObj) {
                        if (err) {
                            console.log('login error ' + err);
                            //todo remove this in production
                            res.header('Access-Control-Allow-Origin', '*');
                            res.send('-2');
                        }

                        else {
                            if (userObj != "") {
                                if (userObj[0].profile == 0) {
                                    persistData(body);

                                    //todo remove this in production
                                    res.header('Access-Control-Allow-Origin', '*');
                                    res.send('0');

                                }
                                else if (userObj[0].profile == 1) {
                                    //todo remove this in production
                                    res.header('Access-Control-Allow-Origin', '*');
                                    res.send('1');
                                }

                            } else {
                                //for the first time
                                persistData(body);

                                //todo remove this in production
                                res.header('Access-Control-Allow-Origin', '*');
                                res.send('0');

                            }
                        }
                    });
                } else {

                    console.log('Error response code is ' + response.statusCode);
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send('-1');
                }
            });
        });


    // profile page

    app.get('/getlocationtimedata',
        function (req, res) {
            //todo one time storage data
            //mongoLib.storeLocationTimedata();
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

    app.get('/getuserProfile',
        function (req, res) {
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
    app.post('/updateNotifications', function (req, res) {
        mongoLib.updateNotifications(req.body, function (err, json) {
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

    app.get('/fromLocationdetails',
        function (req, res) {
            getfromLocationdetails(req, res);
        });
    app.get('/toLocationdetails',
        function (req, res) {
            gettoLocationdetails(req, res);
        });
    app.post('/getTimeandCount',
        function (req, res) {
            getTimedetails(req, res);

        });

    app.post('/getUserDetails',
        function (req, res) {
            console.log('data');

            getUserDetails(req, res);
        });

    app.get('/getPreferenceDetails',
        function (req, res) {
            getuserPreferencedetails(req, res);
        });

    app.get('/logout',
        function (req, res) {
            req.session.user = "";
            res.redirect('/');
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

    function getTimedetails(req, res) {

        mongoLib.getTimedetails(req, function (err, timeObj) {
            if (err) {
                console.log(err);
            }
            else {
                //todo remove this in production
                res.header('Access-Control-Allow-Origin', '*');
                if (timeObj != "") {
                    res.send(timeObj);
                }
                else {
                    var emptyObj =
                        [{"name":"null", "t06_00AM":0, "t07_00AM":0, "t08_00AM":0, "t09_00AM":0, "t10_00AM":0, "t11_00AM":0, "t12_00PM":0, "t01_00PM":0, "t02_00PM":0, "t03_00PM":0, "t04_00PM":0, "t05_00PM":0, "t06_00PM":0, "t07_00PM":0, "t08_00PM":0}];
              //todo remove this in production
                    // res.header('Access-Control-Allow-Origin','*');
                    res.send(emptyObj);

                }
            }
        });
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

        if (req.body.type == 1) {
            mongoLib.getUserDetails1(req, function (err, userObj) {
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

        } else {
            mongoLib.getUserDetails2(req, function (err, userObj) {
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

    }

    function getfromLocationdetails(req, res) {
        mongoLib.getfromLocation(req, function (err, fromLocObj) {
            if (err) {
                console.log(err);
            }
            else {
                if (fromLocObj!="") {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(fromLocObj);
                }
            }
        });


    }

    function gettoLocationdetails(req, res) {
        mongoLib.gettoLocation(req, function (err, toLocObj) {
            if (err) {
                console.log(err);
            }
            else {
                if (toLocObj!="") {
                    //todo remove this in production
                    res.header('Access-Control-Allow-Origin', '*');
                    res.send(toLocObj);
                }
            }
        });


    }

    function persistData(data) {

        mongoLib.persistUserprofiledata(data, function (err, json) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Data persisted successfully !');

            }
        });
    }




}