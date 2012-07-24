var dbUtil = require('./cloudFoundryUtil');

var conn;
var db;
module.exports = {
    connect: function(dbServiceName) {
        db = dbUtil.connect('mongodb', dbServiceName,
            function(err, connection) {
                if (err || !connection) {
                    console.log('Could not connect to MongoDB');
                } else {
                    console.log('Connected to MongoDB successfully');
                    conn = connection;
                }
            });
    },
    storeLocationTimedata: function(){
        db.collection('locationtimedata');
        db.bind('locationtimedata');
        db.locationtimedata.insert({Loc:"Palo " +
                "Alto Building A,Palo Alto Building B,Palo Alto Vmware deer creek,San Francisco Stevenson Street",
                Loc1:"San Jose,San Mateo,Park Merced,SF Downtown,SunnyVale,Cupertino,Mountain View,Fremont," +
                    "Red Wood City,Dally City",FromTime:"06:00AM,07:00AM,08:00AM,09:00AM,10:00AM,11:00AM,12:00PM,01:00PM",
                ToTime:"02:00PM,03:00PM,04:00PM,05:00PM,06:00PM,07:00PM,08:00PM"},
            function(err) {
                if(err) {
                    return console.log('insert error', err);
                }
                //callback(null,data);

            });
    },

    getLocationTimedata: function(callback){
        db.collection('locationtimedata');
        db.bind('locationtimedata');
        db.locationtimedata.find({},function(err, cursor) {
            if(err) {
                callback(err);
            } else {
                cursor.toArray(callback);
            }
        });
    },

    updateLocationCounter: function(req,callback){
        var tempLocs=new Array();
        var times = new Array();
        var locationName1 = req.body.fromLocation1+'_'+req.body.toLocation1;
        var locationName2 = req.body.fromLocation2+'_'+req.body.toLocation2;
        if(req.body.temp!=""){
            tempLocs = (req.body.temp).split(",");
            var locationTemp1=tempLocs[0];
            var locationTemp2=tempLocs[1];
        }
        else{
            var locationTemp1=null;
            var locationTemp2=null;
        }
            if(req.body.temptime!=""){
                times = (req.body.temptime).split(",");
                var start = times[0];
                start = 't' + start.replace(":","_");
                var ret  = times[1];
                ret =  't' + ret.replace(":","_");
            }
        else{
                var start=null;
                var ret=null;
            }
        var time1 = 't'+req.body.startTime.replace(":","_");
        var incObj1 = {$inc: {}};
        incObj1["$inc"][time1] = 1;
        var time2 = 't'+req.body.returnTime.replace(":","_");
        var incObj2 = {$inc: {}};
        incObj2["$inc"][time2] = 1;
        $inc:{time:1}
        console.log('time =' + time1);
        db.collection('locationDetails');
        db.bind('locationDetails');
        var locationDetails1 = {name:locationName1,t06_00AM:0,t07_00AM:0,t08_00AM:0,t09_00AM:0,t10_00AM:0,t11_00AM:0,t12_00PM:0,t01_00PM:0,t02_00PM:0,
            t03_00PM:0,t04_00PM:0,t05_00PM:0,t06_00PM:0,t07_00PM:0,t08_00PM:0};
        var locationDetails2 = {name:locationName2,t06_00AM:0,t07_00AM:0,t08_00AM:0,t09_00AM:0,t10_00AM:0,t11_00AM:0,t12_00PM:0,t01_00PM:0,t02_00PM:0,
            t03_00PM:0,t04_00PM:0,t05_00PM:0,t06_00PM:0,t07_00PM:0,t08_00PM:0};

        if(locationName1 != locationTemp1 || time1!=start)
        {
            db.locationDetails.find({name:locationName1},function(err,cursor) {
                if(err) {
                    return console.log('location error:', err);
                }
                cursor.toArray(function(err,json){
                    if(json!="") {
                        db.locationDetails.update({name:locationName1},incObj1);
                        console.log('--location details updated successfully 1--');
                    }
                    else{
                        db.locationDetails.insert(locationDetails1,function(err){
                            if(err){ console.log(err);
                            }
                            else{
                                console.log('--location details inserted 1 successfully--');
                            }
                        });

                        db.locationDetails.update({name:locationName1},incObj1);
                    }
                });

            });

            if(locationTemp1!=""){
                var decObj1 = {$inc: {}};
                decObj1["$inc"][start] = -1;
                db.locationDetails.update({name:locationTemp1},decObj1);
            }
        }

        if(locationName2 != locationTemp2 || time2!=ret){
            db.locationDetails.find({name:locationName2},function(err,cursor) {
                if(err) {
                    return console.log('location error:', err);
                }
                cursor.toArray(function(err,json){
                    console.log('testjson='+JSON.stringify(json));
                    if(json!="") {
                        db.locationDetails.update({name:locationName2},incObj2);
                        console.log('--location details updated successfully 2--');
                    }
                    else {
                        db.locationDetails.insert(locationDetails2,function(err){
                            if(err){ console.log(err);
                            }
                            else{
                                console.log('--location details inserted 2 successfully--');
                            }
                        });

                        db.locationDetails.update({name:locationName2},incObj2);
                    }
                });

            });
            if(locationTemp2!=""){
                var decObj2 = {$inc: {}};
                decObj2["$inc"][ret] = -1;
                db.locationDetails.update({name:locationTemp2},decObj2);
            }
        }
        if(locationName1 != locationTemp1 || time1!=start) {
            console.log('update decrement successfull 1');
        }
        if(locationName2 != locationTemp2 || time2!=ret){
            console.log('update decrement successfull 2');
        }
    },
    getUserDetails1 : function(req,callback){
        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.find({"fromLocation1":req.body.fromLocation,"toLocation1":req.body.toLocation,"startTime":req.body.time,"Hide":null},function(err, cursor) {
            if(err) {
                return console.log('find login error:', err);
            }
            cursor.skip(parseInt(req.body.skip)).limit(3);
            cursor.toArray(callback);
        });

    },
    getUserDetails2 : function(req,callback){
        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.find({"fromLocation2":req.body.fromLocation,"toLocation2":req.body.toLocation,"departTime":req.body.time,"Hide":null},function(err, cursor) {
            if(err) {
                return console.log('find login error:', err);
            }
            cursor.skip(parseInt(req.body.skip)).limit(3);
            cursor.toArray(callback);
        });

    },




    getLocation : function(req,callback) {
        db.collection('locationtimedata');
        db.bind('locationtimedata');
        db.locationtimedata.find({},{"Loc1":true,"Loc":true},function(err,cursor) {
                if(err) {
                    return console.log('location error:', err);
                }
                cursor.toArray(callback);
        });
    },

//        getfromLocation : function(req,callback) {
//        db.collection('userdatabase');
//        db.bind('userdatabase');
//        if(req.body.journey==0){
//            //todo after release
//            db.userdatabase.distinct("fromLocation1",{"fromLocation1":{$exists:true}},function(err,cursor) {
//                if(err) {
//                    return console.log('location error:', err);
//                }
//                callback(null,cursor);
//            });
//
//        }  else if(req.body.journey==1) {
//            db.userdatabase.distinct("fromLocation2",{"fromLocation2":{$exists:true}},function(err,cursor) {
//                if(err) {
//                    return console.log('location error:', err);
//                }
//                callback(null,cursor);
//            });
//
//        }
//    },
//    gettoLocation : function(req,callback) {
//        db.collection('userdatabase');
//        db.bind('userdatabase');
//        if(req.body.journey==0){
//            db.userdatabase.distinct("toLocation1",{"toLocation1":{$exists:true}},function(err,cursor) {
//                if(err) {
//                    return console.log('location error:', err);
//                }
//                callback(null,cursor);
//            });
//        }    else if(req.body.journey==1) {
//            db.userdatabase.distinct("toLocation2",{"toLocation2":{$exists:true}},function(err,cursor) {
//                if(err) {
//                    return console.log('location error:', err);
//                }
//                callback(null,cursor);
//            });
//        }
//    },

    getTimedetails : function(req,callback) {
        db.collection('locationDetails');
        db.bind('locationDetails');
        console.log('location for time = '+ req.body.location);
        db.locationDetails.find({"name":req.body.location},function(err,cursor) {
            if(err) {
                return console.log('location error:', err);
            }
            cursor.toArray(callback);
        });

    },
    updateUserdetails: function(req,callback){
        db.collection('userdatabase');
        db.bind('userdatabase');
        console.log('hide'+req.body.hide);
        db.userdatabase.update({"contact_info.email":req.body.from_email},{$set:{profile:1,"contact_info.cell_phone":req.body.mobile,landmark:req.body.landmark,preference:req.body.preference,location:req.body.location,fromLocation1:req.body.fromLocation1,toLocation1:req.body.toLocation1,startTime:req.body.startTime,fromLocation2:req.body.fromLocation2,toLocation2:req.body.toLocation2,departTime:req.body.returnTime,Car:req.body.Car,NoCar:req.body.Nocar,DriveDays:req.body.DriveDays,DriveWeek:req.body.DriveWeek,hide:req.body.hide,carDesc:req.body.carDesc,notify:req.body.notify,logout:req.body.log_out,date:new Date().toString()}},function(err,result){
            if(err)       {
                console.log('error occured while updating');
                callback(err);

            }else{
                console.log('---user details update successfull---');
                callback(null);

            }

        });

    },
    persistUserprofiledata : function(data,callback){
        db.collection('userdatabase');
        db.bind('userdatabase');
        var userdetails = {name:data.communities[0].profile.name, title:data.communities[0].profile.title, contact_info:data.communities[0].profile.contact_info,avatars:data.communities[0].profile.avatars,profile:0};
        db.userdatabase.insert(userdetails,function(err) {
            if(err) {
                callback(err);

            }
            else{
                callback(null);
            }
        });
    },

    persistNotificationData  : function(data,callback) {
        db.collection('notification');
        db.bind('notification');
        var row = {from_name:data.fromName,from_email:data.fromEmail,to_name:data.toName,to_email:data.toEmail,message:data.message,unread:1,timestamp:new Date().toString()};
        db.notification.insert(row,function(err) {
            if(err) {
                callback(err);

            }
            else{
                callback(null);
            }
        });
    },
    getuserInfo : function(req,callback)
    {
        db.collection('userdatabase');
        db.bind('userdatabase');
        db.userdatabase.find({"contact_info.email":req.body.email},function(err,cursor) {
            if(err) {
                return console.log('location error:', err);
            }
            cursor.toArray(callback);
        });

    },
    getNotifications : function(data,callback){
        db.collection('notification');
        db.bind('notification');
        db.notification.find({$or:[{to_email:data.email},{from_email:data.email}]},{},{"sort":"_id"},function(err,cursor) {
              if(err) {
                return console.log('location error:', err);
            }
            cursor.toArray(callback);
        });
    },
    getNotificationbyID : function(data,callback){
        db.collection('notification');
        db.bind('notification');
        console.log('id id '+data.id);
        db.notification.find({"_id":db.bson_serializer.ObjectID.createFromHexString(data.id)},function(err,cursor) {
            if(err) {
                return console.log('location error:', err);
            }
            cursor.toArray(callback);
        });
    },

    //notification unread
//    updateNotifications: function(data,callback){
//        db.collection('notification');
//        db.bind('notification');
//        db.notification.update({from_email:data.email},{$set:{unread:0}},function(err,result){
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
    viewData: function(data,callback){
        if(data.value=="data"){

            db.collection('locationtimedata');
            db.bind('locationtimedata');
            db.locationtimedata.find({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                cursor.toArray(callback);
            });
        }
        if(data.value=="location"){
            db.collection('locationDetails');
            db.bind('locationDetails');
            db.locationDetails.find({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                cursor.toArray(callback);
            });

        }

        if(data.value=="user"){
            db.collection('userdatabase');
            db.bind('userdatabase');
            db.userdatabase.find({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                cursor.toArray(callback);
            });

        }
        if(data.value=="notification"){
            db.collection('notification');
            db.bind('notification');
            db.notification.find({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                cursor.toArray(callback);
            });

        }
    },
    deleteData: function(data,callback){
        if(data.value=="data"){
            db.collection('locationtimedata');
            db.bind('locationtimedata');
            db.locationtimedata.remove({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"success");
                }
            });
        }
        if(data.value=="location"){
            db.collection('locationDetails');
            db.bind('locationDetails');
            db.locationDetails.remove({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"success");
                }
            });
        }
        if(data.value=="user"){
            db.collection('userdatabase');
            db.bind('userdatabase');
            db.userdatabase.remove({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"success");
                }
            });
        }
        if(data.value=="notification"){
            db.collection('notification');
            db.bind('notification');
            db.notification.remove({},function(err, cursor) {
                if(err) {
                    return console.log('login details error:', err);
                }
                else {
                    callback(null,"success");
                }
            });
        }
},

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
            db.collection('locationDetails');
            db.bind('locationDetails');
            db.locationDetails.insert(data.d,function(err, cursor) {
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
        if(data.value=="notification"){
            db.collection('notification');
            db.bind('notification');
            db.notification.remove({},function(err, cursor) {
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