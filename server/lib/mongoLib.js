var dbUtil = require('./cloudFoundryUtil');
var config =require('./config');

var conn;
var db;
module.exports = {
    connect: function(dbServiceName) {
        db = dbUtil.connect('mongodb', dbServiceName);
        db.open(function(err, connection) {
            if (err || !connection) {
                console.log('Could not connect to MongoDB');
            } else {
                console.log('Connected to MongoDB successfully');
                conn = connection;
            }
        });
    },

    updateLocationCounter: function(req, callback) {
        var tempLoc=new Array();
        var time = new Array();
        var locationName1 = req.body.fromLocation1 + '_' + req.body.toLocation1;
        var locationName2 = req.body.fromLocation2 + '_' + req.body.toLocation2;
        var time1 =req.body.startTime;
        var time2 =req.body.returnTime;
        tempLoc = (req.body.temp).split(",");
        var locationTemp1=tempLoc[0] || null;
        var locationTemp2=tempLoc[1] || null;

        time = (req.body.temptime).split(",");
        var start = time[0] || null;
        var ret  = time[1] || null;
        var incObj1 = {$inc:{}};
        incObj1["$inc"]["time."+time1] = 1;
        var incObj2 = {$inc: {}};
        incObj2["$inc"]["time."+time2] = 1;
        //$inc:{time:1}
        db.collection('locationdetails');
        db.bind('locationdetails');

        var locationdetails1 = { name : locationName1, time : config.time }
        var locationdetails2 = { name : locationName2, time : config.time }
        if(locationName1 != locationTemp1 || time1!=start) {
            updatelocation(locationName1,locationdetails1,incObj1);
            var decObj1 = {$inc: {}};
            decObj1["$inc"]["time."+start] = -1;
            db.locationdetails.update({name:locationTemp1},decObj1);
        }
        if(locationName2 != locationTemp2 || time2!=ret) {
            updatelocation(locationName2,locationdetails2,incObj2);
            var decObj2 = {$inc: {}};
            decObj2["$inc"]["time."+ret] = -1;
            db.locationdetails.update({name:locationTemp2},decObj2);
        }
        function updatelocation(locationName, locationdetails, incObj) {
            db.locationdetails.find({name : locationName},function(err, cursor) {
                if(err) {
                    callback(err);
                }
                cursor.toArray(function(err, json) {
                    if(json != "") {
                        db.locationdetails.update({name : locationName}, incObj);
                    }
                    else {
                        db.locationdetails.insert(locationdetails, function(err) {
                            if(err) { console.log(err);
                            } else {
                                console.log('location details inserted 1 successfully');
                            }
                        });
                        db.locationdetails.update({name:locationName}, incObj);
                    }
                });
            });
        }
    },
    getUserDetails1 : function(req, callback){

        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.find({"fromLocation1":req.body.fromLocation, "toLocation1":req.body.toLocation, "startTime":req.body.time, "Hide":null}, function(err, cursor) {
            if(err) {
                callback(err);
            }
            cursor.skip(parseInt(req.body.skip)).limit(3);
            cursor.toArray(callback);
        });

    },
    getUserDetails2 : function(req, callback) {
        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.find({"fromLocation2":req.body.fromLocation,"toLocation2":req.body.toLocation,"departTime":req.body.time,"Hide":null},function(err, cursor) {
            if(err) {
                callback('find login error:', err);
            }
            cursor.skip(parseInt(req.body.skip)).limit(3);
            cursor.toArray(callback);
        });
    },
    getLocation : function(req, callback) {
        db.collection('locationtimedata');
        db.bind('locationtimedata');
        db.locationtimedata.findOne({},{"officeLocation":true, "allLocation":true}, function(err, document) {
            if(err) {
                callback(err);
            } else{
                callback(null, document);
            }
        });
    },

    getTimedetails : function(req, callback) {
        db.collection('locationdetails');
        db.bind('locationdetails');
        db.locationdetails.findOne({"name":req.body.location},{"name":false, "_id":false},function(err, document) {
            if(err) {
                callback(err);
            } else {
                if(document!=null){
                    callback(null, document);
                } else {
                    // to show time with no commuters
                    db.locationdetails.findOne({},{"name":false,"_id":false},function(err, document) {
                        if(err) {
                            callback('location error:', err);
                        } else {
                            if(document != null) {
                                // assign all times to zero
                                for(var i in document.time){
                                    document.time[i] = 0;
                                }
                                callback(null, document);
                            }

                        }
                    });
                }
            }
        });
    },
    updateUserdetails: function(req, callback){
        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.update({"contact_info.email":req.body.from_email},{$set:{profile:1,"contact_info.cell_phone":req.body.mobile,landmark:req.body.landmark,preference:req.body.preference,location:req.body.location,fromLocation1:req.body.fromLocation1,toLocation1:req.body.toLocation1,startTime:req.body.startTime,fromLocation2:req.body.fromLocation2,toLocation2:req.body.toLocation2,departTime:req.body.returnTime,Car:req.body.profile_preference,NoCar:req.body.Nocar,DriveDays:req.body.DriveDays,DriveWeek:req.body.DriveWeek,hide:req.body.hide,carDesc:req.body.carDesc,notify:req.body.notify,logout:req.body.log_out,date:new Date().toString()}},function(err,result){
            if(err)       {
                callback(err);

            } else {
                callback(null);
            }

        });

    },
    persistUserProfileData : function(userProfileData, callback) {
        var profile, userdetails;
        try{
            profile = userProfileData.communities[0].profile;
            userdetails = {name: profile.name, title : profile.title,
                contact_info : profile.contact_info, avatars: profile.avatars, profile:0};
        } catch(e) {
            console.log("Error: Could not get user's profile");
            callback(e);
            return;
        }

        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.insert(userdetails, function(err) {
            if(err) {
                callback(err);
            }
            else{
                callback(null);
            }
        });
    },

    persistNotificationData  : function(data, callback) {
        db.collection('notifications');
        db.bind('notifications');
        var row = {from_name : data.fromName, from_email : data.fromEmail, to_name : data.toName,to_email : data.toEmail, message : data.message,
            unread:1, timestamp:new Date().toString()};
        db.notifications.insert(row,function(err) {
            if(err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    },
    getuserInfo : function(req, callback) {
        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.findOne({"contact_info.email" : req.body.email}, function(err,document) {
            if(err) {
                callback(err);
            }
            callback(null, document);
        });

    },
    getNotifications : function(data,callback) {
        db.collection('notifications');
        db.bind('notifications');
        db.notifications.find({$or:[{to_email : data.email}, {from_email : data.email}]}, {}, {sort:[['_id',"-1"]]},
            function(err, cursor) {
            if(err) {
                callback(err);
            }
            cursor.toArray(callback);
        });
    },
    getNotificationbyID : function(data, callback) {
        db.collection('notifications');
        db.bind('notifications');
        db.notifications.find({"_id" : db.bson_serializer.ObjectID.createFromHexString(data.id)}, function(err, cursor) {
            if(err) {
                callback(err);
            }
            cursor.toArray(callback);
        });
    },

    //notifications unread
//    updateNotifications: function(data,callback){
//        db.collection('notifications');
//        db.bind('notifications');
//        db.notifications.update({from_email:data.email},{$set:{unread:0}},function(err,result){
//            if(err) {
//                console.log('error occured while updating');
//                callback(err);
//            }else{
//                console.log('---user details update successfull---');
//                callback(null);
//
//            }
//
//        });
//
//    },
    //todo
    //for testing purpose

    insertData: function(data,callback){
        if(data.value=="data"){
            db.collection('locationtimedata');
            db.bind('locationtimedata');
            db.locationtimedata.insert(data.d,function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"insertion success");
                }
            });
        }
        if(data.value=="location"){
            db.collection('locationdetails');
            db.bind('locationdetails');
            db.locationdetails.insert(data.d,function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"insertion success");
                }
            });
        }
        if(data.value=="user"){
            db.collection('userdatabase');
            db.bind('userdatabase');
            db.userdatabase.insert(data.d,function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"insertion success");
                }
            });
        }
        if(data.value=="notifications"){
            db.collection('notifications');
            db.bind('notifications');
            db.notifications.remove({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"success");
                }
            });
        }

    }


}