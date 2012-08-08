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
     //function for login page
    getUserInfo : function(email, callback) {
        db.collection('userdetails');
        db.bind('userdetails');
        db.userdetails.findOne({"contact_info.email" : email}, function(err, document) {
            if(err) {
                callback(err);
            } else {
                callback(null, document);
            }
        });

    },
    updateLocationCounter: function(obj, callback) {

        db.collection('locationdetails');
        db.bind('locationdetails');
        var locationdetailsOnward = { name : obj.locationCurrentOnward, time : config.time }
        var locationdetailsReturn = { name : obj.locationCurrentReturn, time : config.time }

        if(obj.locationCurrentOnward != obj.locationPreviousOnward || obj.timeCurrentStart != obj.timePrevStart) {
            updatelocation(obj.locationCurrentOnward, locationdetailsOnward, obj.incObjStart);
            db.locationdetails.update({name : obj.locationPreviousOnward}, obj.decObjStart);
        }
        if(obj.locationCurrentReturn != obj.locationPreviousReturn || obj.timeCurrentReturn != obj.timePrevReturn) {
            updatelocation(obj.locationCurrentReturn, locationdetailsReturn, obj.incObjReturn);
            db.locationdetails.update({name : obj.locationPreviousReturn}, obj.decObjReturn);
        }
         callback(null,"Success");
        function updatelocation(locationName, locationdetails, incObj) {
            db.locationdetails.find({name : locationName}, function(err, cursor) {
                if(err) {
                    callback(err);
                }  else {
                    cursor.toArray(function(err, locationList) {
                        if(locationList != "") {
                            db.locationdetails.update({name : locationName}, incObj);
                        }
                        else {
                            db.locationdetails.insert(locationdetails, function(err) {
                                if(err) {
                                    callback(err);
                                } else {
                                    console.log('location details inserted !');
                                }
                            });
                            db.locationdetails.update({name : locationName}, incObj);
                        }
                    });
                }
            });
        }
    },
    getUserDetailsOnward : function(userObj, callback){
        db.collection('userdetails');
        db.bind('userdetails');
        db.userdetails.find({"fromLocation1":userObj.fromLocation, "toLocation1":userObj.toLocation,
            "startTime":userObj.time, "Hide":null}, function(err, cursor) {
            if(err) {
                callback(err);
            } else {
               // cursor.skip(parseInt(req.body.skip)).limit(config.limitResults);
                cursor.limit(config.limitResults + parseInt(userObj.skip));
                cursor.toArray(function(err, items) {
                callback(null, items);
                });
            }
        });

    },
    getUserDetailsReturn : function(userObj, callback) {
        db.collection('userdetails');
        db.bind('userdetails');
        db.userdetails.find({"fromLocation2" : userObj.fromLocation, "toLocation2" : userObj.toLocation,
            "departTime" : userObj.time, "Hide" : null}, function(err, cursor) {
            if(err) {
                callback('find login error:', err);
            } else {
                var count;
                cursor.count(function(err, value) {
                   count = value;
                });
                //cursor.skip(parseInt(req.body.skip)).limit(config.limitResults);
                cursor.limit(config.limitResults + parseInt(userObj.skip));
                cursor.toArray(function(err, items) {
                callback(null, items);
                });
            }
        });
    },
    getTimeDetails : function(location, callback) {
        db.collection('locationdetails');
        db.bind('locationdetails');
        db.locationdetails.findOne({"name": location},{"name":false, "_id":false},function(err, document) {
            if(err) {
                callback(err);
            } else {
                if(document!=null) {
                    callback(null, document);
                } else {
                    // to show time with no commuters
                    db.locationdetails.findOne({},{"name":false,"_id":false},function(err, document) {
                        if(err) {
                            callback('location error:', err);
                        } else {
                            if(document != null) {
                                // assign all times to zero
                                for(var i in document.time) {
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
    updateUserDetails: function(data, callback){
        db.collection('userdetails');
        db.bind('userdetails');
        db.userdetails.update({"contact_info.email" : data.from_email}, {$set : {profile : 1,
            "contact_info.cell_phone" : data.mobile, landmark : data.landmark,preference : data.preference,
            location : data.location, fromLocation1 : data.fromLocation1, toLocation1 : data.toLocation1,
            startTime : data.startTime, fromLocation2 : data.fromLocation2, toLocation2 : data.toLocation2,
            departTime : data.returnTime, Car : data.profile_preference, hide : data.hide,
            carDesc : data.carDesc, notify : data.notify,
            logout : data.log_out, date:new Date().toString()}}, function(err, result) {
            if(err) {
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
            userdetails = {name: profile.name, title : profile.custom_fields[0].value,
                contact_info : profile.contact_info, avatars: profile.avatars, profile:0};
        } catch(e) {
            console.log("Error: Could not get user's profile");
            callback(e);
            return;
        }

        db.collection('userdetails');
        db.bind('userdetails');
        db.userdetails.insert(userdetails, function(err) {
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
    getNotifications : function(data,callback) {
        db.collection('notifications');
        db.bind('notifications');
        db.notifications.find({$or:[{to_email : data.email}, {from_email : data.email}]}, {}, {sort:[['_id',"-1"]]},
            function(err, cursor) {
            if(err) {
                callback(err);
            } else{
                cursor.toArray(callback);
            }
        });
    },
    getNotificationbyID : function(data, callback) {
        db.collection('notifications');
        db.bind('notifications');
        db.notifications.find({"_id" : db.bson_serializer.ObjectID.createFromHexString(data.id)}, function(err, cursor) {
            if(err) {
                callback(err);
            } else{
                cursor.toArray(callback);
            }
        });
    }

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

}