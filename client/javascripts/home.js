/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/28/12
 * Time: 3:39 AM
 * To change this template use File | Settings | File Templates.
 */

$("#page-home").bind('pagebeforeshow',function(){
    var tempValue_Onward = new Array();
    var tempTime_Onward = new Array();
    var tempValue_Return = new Array();
    var tempTime_Return = new Array();
    var temp1_Onward;
    var temp2_Onward;
    var temp1_Return;
    var temp2_Return;
    var journey=0;
    var result=0;
    var loc;
    var skip;
    var i =1;
     if((new Date().getHours()) < 12){
         $("#radio-choice-a").attr("checked", true).checkboxradio("refresh");
         $("#radio-choice-b").attr("checked", false).checkboxradio("refresh");
         journey = 0;
         $.post(VC.geturl()+'/getuserinfo',{"email":localStorage.getItem('from_email')},function(userObj){
             preload1();
             //localStorage.setItem('name',userObj[0].name);
             setLocationTime_Onward(userObj);
             $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                 setOnwardTime(timeObj);
                 loadDropDownList3(tempValue_Onward,tempTime_Onward);
                 generateOnwardData(skip);
             });
             $.post(VC.geturl()+'/fromLocationdetails',{"journey":journey},function(fromLocObj){
                 loadDropDownList1(fromLocObj);
             });
             $.post(VC.geturl()+'/toLocationdetails',{"journey":journey},function(toLocObj){
                loadDropDownList2(toLocObj);
             });
         });
     }
     else{

         $("#radio-choice-a").attr("checked", false).checkboxradio("refresh");
         $("#radio-choice-b").attr("checked", true).checkboxradio("refresh");
         journey = 1;
         $.post(VC.geturl()+'/getuserinfo',{"email":localStorage.getItem('from_email')},function(userObj){
             preload1();
             //localStorage.setItem('name',userObj[0].name);
             setLocationTime_Return(userObj);
             $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                 setReturnTime(timeObj);
                 loadDropDownList3(tempValue_Return,tempTime_Return);
                 generateReturnData(skip);
             });
             $.post(VC.geturl()+'/fromLocationdetails',{"journey":journey},function(fromLocObj){
                 loadDropDownList1(fromLocObj);
             });
             $.post(VC.geturl()+'/toLocationdetails',{"journey":journey},function(toLocObj){
                 loadDropDownList2(toLocObj);

             });
         });
     }

    $("#radio-choice-a").change(function() {
        if ($("#radio-choice-a").attr("checked", true)) {
            $.post(VC.geturl()+'/getuserinfo',{"email":localStorage.getItem('from_email')},function(userObj){
                preload1();
                setLocationTime_Onward(userObj);
                journey = 0;
                $.post(VC.geturl() + '/fromLocationdetails',{"journey":journey}, function (fromLocObj) {
                    loadDropDownList1(fromLocObj);
                });
                $.post(VC.geturl() + '/toLocationdetails', {"journey":journey},function (toLocObj) {
                    loadDropDownList2(toLocObj);
                    $.post(VC.geturl() + '/getTimeandCount', {"location":loc}, function (timeObj) {
                        setOnwardTime(timeObj);
                        loadDropDownList3(tempValue_Onward,tempTime_Onward);
                        generateOnwardData(skip);
                    });
                });
            });
        }
    });

    $("#radio-choice-b").change(function() {
        if ($("#radio-choice-b").attr("checked", true)) {
            $.post(VC.geturl()+'/getuserinfo',{"email":localStorage.getItem('from_email')},function(userObj){
                preload1();
                setLocationTime_Return(userObj);
                journey = 1;
                $.post(VC.geturl() + '/toLocationdetails',{"journey":journey}, function (toLocObj) {
                    loadDropDownList2(toLocObj);
                });
                $.post(VC.geturl() + '/fromLocationdetails',{"journey":journey}, function (fromLocObj) {
                    loadDropDownList1(fromLocObj);
                    $.post(VC.geturl() + '/getTimeandCount', {"location":loc}, function (timeObj) {
                        setReturnTime(timeObj);
                        loadDropDownList3(tempValue_Return,tempTime_Return);
                        generateReturnData(skip);
                    });
                });
            });
        }
    });



     $('#to-location-1').on('change',function() {
         preload2();
        if(journey==0){
            $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                setOnwardTime(timeObj);
                loadDropDownList3(tempValue_Onward,tempTime_Onward);
                generateOnwardData(skip);
            });
        }else{
            $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                setReturnTime(timeObj);
                loadDropDownList3(tempValue_Return,tempTime_Return);
                generateReturnData(skip);
            });
        }
    });

     $('#from-location-1').on('change', function() {
         preload2();
        if(journey==0){
            $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                setOnwardTime(timeObj);
                loadDropDownList3(tempValue_Onward,tempTime_Onward);
                generateOnwardData(skip);

            });
        }
        else {
            $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                setReturnTime(timeObj);
                loadDropDownList3(tempValue_Return,tempTime_Return);
                generateReturnData(skip);
            });
        }
    });

     $('#time').off('change').on('change', function() {
         preload2();
         if(journey==0) {
             $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                 setOnwardTime(timeObj);
                 loadDropDownList3(tempValue_Onward,tempTime_Onward);
                 generateOnwardData(skip);
             });
         }
         else{
             $.post(VC.geturl()+ '/getTimeandCount',{"location":loc},function(timeObj){
                 setReturnTime(timeObj);
                 loadDropDownList3(tempValue_Return,tempTime_Return);
                 generateReturnData(skip);
             });
         }
     });

    function preload1(){
        $("#list1 li").remove();
        $('#more-results').remove();
        $('#list1').listview('refresh');
        $('#to-location-1 > option').remove();
        $('#from-location-1 > option').remove();
        skip=0;
    }

    function preload2(){
        $("#list1 li").remove();
        $('#more-results').remove();
        $('#list1').listview('refresh');

        startTime= $("#time  option:selected").val();
        returnTime = $("#time  option:selected").val();
        if(journey==0){
            fromLocation = $("#from-location-1  option:selected").text();
            toLocation = $("#to-location-1  option:selected").text();
            loc = fromLocation + "_" + toLocation;

        }else{
//            toLocation = $("#from-location-1  option:selected").text();
//            fromLocation = $("#to-location-1  option:selected").text();
            fromLocation = $("#from-location-1  option:selected").text();
            toLocation = $("#to-location-1  option:selected").text();
            loc = toLocation + "_" + fromLocation;

        }
        loc = fromLocation + "_" + toLocation;

    }
    function setLocationTime_Onward(userObj){

        fromLocation=userObj[0].fromLocation1;
        toLocation=userObj[0].toLocation1;
        startTime=userObj[0].startTime;
        loc = fromLocation + "_"+ toLocation;
    }

    function setLocationTime_Return(userObj){

        fromLocation=userObj[0].fromLocation2;
        toLocation=userObj[0].toLocation2;
        returnTime=userObj[0].departTime;
        loc = fromLocation + "_"+ toLocation;
    }

     function generateOnwardData(skip){
         $("#list1").append('<li style="text-align: center"> No commuters found ! </li>');
         $('#list1').listview('refresh');
         $.post(VC.geturl()+ '/getUserDetails',{"fromLocation":fromLocation,"toLocation":toLocation,"time":startTime,"skip":skip,"type":1},function(userObj){
             if(userObj.length>0) {
                 //to clear "no commuters" tag
                 $("#list1 li").remove();
                 $('#list1').listview('refresh');

                 for(var i =0;i<userObj.length;i++){
                     $("#list1").append(getList(userObj[i]));
                 }
                 if(userObj.length>2){
                     $("#list1").append('<a href="#" data-role="link" id="more-results">More Results</a>');
                 }
                 $('#list1').listview('refresh');
             }
         });
     }

     function generateReturnData(skip){
         $("#list1").append('<li style="text-align: center"> No commuters found ! </li>');
         $('#list1').listview('refresh');
         $.post(VC.geturl()+ '/getUserDetails',{"fromLocation":fromLocation,"toLocation":toLocation,"time":returnTime,"skip":skip,"type":2},function(userObj){
             if(userObj.length>0){
                 //to clear "no commuters" tag
                 $("#list1 li").remove();
                 $('#list1').listview('refresh');
                 for(var i =0;i<userObj.length;i++){

                     $("#list1").append(getList(userObj[i]));
                     $('#list1').listview('refresh');
                 }
                 if(userObj.length>2){
                     $("#list1").append('<a href="#" data-role="link" id="more-results">More Results</a>');
                 }
             } else{
                 $("#list1").append('<li style="text-align: center"> No commuters found ! </li>');
                 $('#list1').listview('refresh');
             }
         });
     }

     $('#more-results').live('click',function(){
         fromLocation = $("#from-location-1  option:selected").text();
         toLocation = $("#to-location-1  option:selected").text();
         $("#list1 li").remove();
         $('#more-results').remove();
         if(journey==0){
           startTime= $("#time  option:selected").val();
           generateOnwardData(i);
           i++;
         }
         else{
           returnTime= $("#time  option:selected").val();
           generateReturnData(i);
           i++;
         }
     });

    function loadDropDownList1(fromLocObj){
        for(var i=0;i<fromLocObj.length;i++){
           $('#from-location-1').append(new Option(fromLocObj[i],fromLocObj[i]));
        }
        $('#from-location-1').val(fromLocation);
        $('#from-location-1').selectmenu("refresh");
    }
    function loadDropDownList2(toLocObj){

        for(var i=0;i<toLocObj.length;i++){
            $('#to-location-1').append(new Option(toLocObj[i],toLocObj[i]));
        }
        $('#to-location-1').val(toLocation);
        $('#to-location-1').selectmenu("refresh");

    }

     function loadDropDownList3(tempValue_Onward,tempTime_Onward){
         $('#time > option').remove();
         for(var i=0;i<tempTime_Onward.length;i++){
             var temp=   '<b>'+tempValue_Onward[i]+'</b>';
             $('#time').append(new Option(tempTime_Onward[i]+'('+tempValue_Onward[i]+')',tempTime_Onward[i]));
         }
           if(journey==0){
         $('#time').val(startTime);
           }else{
               $('#time').val(returnTime);
           }
         $('#time').selectmenu("refresh");
     }

    function setOnwardTime(timeObj){


        temp1_Onward = timeObj[0].t06_00AM+","+timeObj[0].t07_00AM+","+timeObj[0].t08_00AM+","+timeObj[0].t09_00AM+","+timeObj[0].t10_00AM+","+timeObj[0].t11_00AM+","+timeObj[0].t12_00PM;
        temp2_Onward = "06:00AM,07:00AM,08:00AM,09:00AM,10:00AM,11:00AM,12:00PM";
        tempValue_Onward = temp1_Onward.split(",");
        tempTime_Onward= temp2_Onward.split(",");
    }

    function setReturnTime(timeObj){
        var i = "t12_00PM";
        tempval = timeObj[0][i];
        temp1_Return = timeObj[0].t12_00PM+","+timeObj[0].t01_00PM+","+timeObj[0].t02_00PM+","+timeObj[0].t03_00PM+","+timeObj[0].t04_00PM+","+timeObj[0].t05_00PM+","+timeObj[0].t06_00PM+","+timeObj[0].t07_00PM+","+timeObj[0].t08_00PM;
        temp2_Return = "12:00PM,01:00PM,02:00PM,03:00PM,04:00PM,05:00PM,06:00PM,07:00PM,08:00PM";
        tempValue_Return = temp1_Return.split(",");
        tempTime_Return= temp2_Return.split(",");
    }

    function getList(userObj) {
        var preference=null;
        if(userObj.NoCar!=null){
            preference = userObj.NoCar;
        }
        if(userObj.Car!=null){
            if(preference!=null){
                preference = preference + ',' + userObj.Car;
            }
            else{
                preference = userObj.Car;
            }
        }
        if(userObj.DriveDays!=null){
            if(preference!=null){
                preference = preference + ','+ userObj.DriveDays;
            }
            else{
                preference = userObj.DriveDays;
            }
        }
        if(userObj.DriveWeek!=null){
            if(preference!=null){
                preference = preference +','+ userObj.DriveWeek;
            }
            else{
                preference = userObj.DriveWeek;
            }
        }
        return '<li><a href="#" id="list_details" title="'+userObj.contact_info.email+'"><image width="100" height="100" src=\"'
            + userObj.avatars.square140 +'\"><h3>'
            + userObj.name +'</h3><p><strong>'
            + userObj.title +'</strong></p></a></li>';
    }

    $('#list_details').live('click', function() {
        localStorage.setItem('to_email',$(this).attr('title'));
        location.replace("index.html#page-details");
    });
});


