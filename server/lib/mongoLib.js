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
        db.userdetails.find({"fromLocation1" : userObj.fromLocation, "toLocation1" : userObj.toLocation,
            "startTime" : userObj.time, "hide" : null}, function(err, cursor) {
            if(err) {
                callback(err);
            } else {
               // cursor.skip(parseInt(req.body.skip)).limit(config.limitResults)
               	var limitResults = parseInt(userObj.skip);
               	if(limitResults != 0) {
               		 cursor.limit(limitResults);
               	} else {
               		 cursor.limit(config.limitResults);
               	}
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
            "departTime" : userObj.time, "hide" : null}, function(err, cursor) {
            if(err) {
                callback('find login error:', err);
            } else {
                var count;
                cursor.count(function(err, value) {
                   count = value;
                });
                //cursor.skip(parseInt(req.body.skip)).limit(config.limitResults);
                var limitResults = parseInt(userObj.skip);
               	if(limitResults != 0) {
               		 cursor.limit(limitResults);
               	} else {
               		 cursor.limit(config.limitResults);
               	}
                //cursor.limit(config.limitResults + parseInt(userObj.skip));
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
        console.log('data'+JSON.stringify(data));
        db.userdetails.update({"contact_info.email" : data.from_email}, {$set : {profile : 1,
            "contact_info.cell_phone" : data.mobile, landmark : data.landmark,preference : data.preference,
            location : data.location, fromLocation1 : data.fromLocation1, toLocation1 : data.toLocation1,
            startTime : data.startTime, fromLocation2 : data.fromLocation2, toLocation2 : data.toLocation2,
            departTime : data.returnTime, Car : data.profile_preference, hide : data.hide,
            carDesc : data.carDesc, notify : data.notification,
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
        var currentTime = new Date().getTime();
        var messages = [{"data" : data.message, "ts" : currentTime, "from" : data.fromEmail}];
        var row = {from_email : data.fromEmail, from_name : data.fromName, from_picture : data.fromPic,
        	       to_email : data.toEmail, to_name : data.toName,  to_picture : data.toPic, message : data.message, 
        	       "messages" : messages, unread:1, updated : currentTime};
        	       
        db.notifications.findOne(
        	{$and: 
        		[{ $or : [ { "from_email" : data.fromEmail } , { "to_email" : data.fromEmail } ] }, 
  				 { $or : [ { "from_email" : data.toEmail } , { "to_email" : data.toEmail } ] }] },  				 
  				  function(err, result) {		
  				  	
  		if(result) {
  					updateNotifications(data.message, result, callback);
  		} else {
  			  db.notifications.insert(row, function(err) {
            if(err) {
                callback(err);
            }
            else {
                callback(null);
            }});
  		}});		              
    },
         
    updateNotifications : function(data,callback) {
    	var result = updateNotifications(data.message, data, callback);
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
    
    getMessages : function(data, callback) {
    	db.collection('notifications');
        db.bind('notifications');
    	db.notifications.findOne(
        	{$and: 
        		[{ $or : [ { "from_email" : data.fromEmail } , { "to_email" : data.fromEmail } ] }, 
  				 { $or : [ { "from_email" : data.toEmail } , { "to_email" : data.toEmail } ] }]
  			}, function(err, document) {
  				  	if(err) {
  				  		callback(err);
  				  	} else {
  				  		console.log('document');
  				  		callback(null, document);
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
   }

    function updateNotifications(message, result, callback) {    	
    	var currentTime = new Date().getTime();
    	db.notifications.update({from_email : result.from_email, to_email : result.to_email}, 
  			  {$set : {"updated" : currentTime, message : message}, 
  			  $push : {messages : {data : message, ts : currentTime, from : result.from_email}}}, function(err) {	
         if(err) {
               	callback(err);
            } else {
                callback("notification updated successfully");
            }
            });    	
    }