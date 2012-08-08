/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/28/12
 * Time: 3:39 AM
 * To change this template use File | Settings | File Templates.
 */

$("#page-home").bind('pagebeforeshow',function() {
    var journey=0;
    var email = localStorage.getItem('from_email');

    if((new Date().getHours()) < 12) {
        $("#radio-choice-a").attr("checked", true).checkboxradio("refresh");
        $("#radio-choice-b").attr("checked", false).checkboxradio("refresh");
        journey = 0;
        loadPage(0);
    } else {
        $("#radio-choice-a").attr("checked", false).checkboxradio("refresh");
        $("#radio-choice-b").attr("checked", true).checkboxradio("refresh");
        journey = 1;
        loadPage(0);
    }

    $("#radio-choice-a").change(function() {
        if ($("#radio-choice-a").attr("checked", true)) {
            journey=0;
        }   loadPage(0);
    });

    $("#radio-choice-b").change(function() {
        if ($("#radio-choice-b").attr("checked", true)) {
            journey=1;
            loadPage(0);
        }
    });

    $('#to-location-1').on('change',function() {
        var selectedValueObj=selectDropDownValues();
        $.post(VC.url + '/gettimeuserdata', {"journey":journey,"location":selectedValueObj.loc,"toLocation":selectedValueObj.toLocation,"fromLocation":selectedValueObj.fromLocation,"time":selectedValueObj.time},function(Obj){
        createTimeMenu(Obj.timeObj,selectedValueObj.time);
        generateListData(Obj.listObj);
        });
    });

    $('#from-location-1').on('change', function() {
        var selectedValueObj=selectDropDownValues();
        $.post(VC.url + '/gettimeuserdata', {"journey":journey, "location":selectedValueObj.loc, "toLocation":selectedValueObj.toLocation, "fromLocation":selectedValueObj.fromLocation, "time":selectedValueObj.time},function(Obj){
        createTimeMenu(Obj.timeObj,selectedValueObj.time);
        generateListData(Obj.listObj);
        });
    });

    $('#time').on('change', function() {
        var selectedValueObj=selectDropDownValues();
        $.post(VC.url + '/getuserlist', {"journey":journey, "toLocation":selectedValueObj.toLocation, "fromLocation":selectedValueObj.fromLocation,"time":selectedValueObj.time},function(Obj){
         generateListData(Obj);
        });
       // $('#time').selectmenu("refresh");
    });

    function loadDropDownList(ID,ObjLoc) {
        for(var i=0;i<ObjLoc.length;i++){
            $(ID).append(new Option(ObjLoc[i],ObjLoc[i]));
        }
    }

    function loadPage(skip) {
        $.post(VC.url+'/getinfo',{"email":email,"journey":journey,"skip":skip}, function(Obj) {
            if(!Obj.error) {
                clearAllList();
                var selectedValueObj = setLocationTime(Obj.userObj);
                createTimeMenu(Obj.timeObj,selectedValueObj.time);
                generateListData(Obj.listObj);
                loadLocationDropDown(Obj,selectedValueObj.fromLocation,selectedValueObj.toLocation);
            } else {
                alert("Internal server error");
            }

        });
    }

    function clearAllList() {
       // $("#list1 li").remove();
        $('#list-next').remove();
        $('#list1').listview('refresh');
        $('#to-location-1 > option').remove();
        $('#from-location-1 > option').remove();
    }

    function selectDropDownValues() {
        var fromLocation;
        var toLocation;
        var time;
        var loc;
        $('#list-next').remove();
        time = $("#time  option:selected").val();
        if(journey == 0){
            fromLocation = $("#from-location-1  option:selected").text();
            toLocation = $("#to-location-1  option:selected").text();
        } else {
            fromLocation = $("#from-location-1  option:selected").text();
            toLocation = $("#to-location-1  option:selected").text();

        }
        loc = fromLocation + "_" + toLocation;

        return {"loc":loc,"fromLocation":fromLocation,"toLocation":toLocation,"time":time};
    }

    function setLocationTime(userObj) {
        var fromLocation;
        var toLocation;
        var time;
        if(journey == 0) {
            fromLocation = userObj.fromLocation1;
            toLocation = userObj.toLocation1;
            time = userObj.startTime;
        } else if(journey == 1) {
            fromLocation = userObj.fromLocation2;
            toLocation = userObj.toLocation2;
            time  = userObj.departTime;
        }
        loc = fromLocation + "_"+ toLocation;
        return {'fromLocation':fromLocation,'toLocation':toLocation,'time':time};
    }

    function loadLocationDropDown(Obj,fromLocation,toLocation) {
        var fromLocObj = new Array();
        fromLocObj = Obj.LocObj.allLocation.split(",");
        var toLocObj = new Array();
        toLocObj = Obj.LocObj.officeLocation.split(",");
        if(journey == 0){
            loadDropDownList("#to-location-1",toLocObj);
            loadDropDownList("#from-location-1",fromLocObj);
        } else {
            loadDropDownList("#from-location-1",toLocObj);
            loadDropDownList("#to-location-1",fromLocObj);
        }
        $("#from-location-1").val(fromLocation);
        $("#to-location-1").val(toLocation);
        $("#from-location-1").selectmenu("refresh");
        $("#to-location-1").selectmenu("refresh");
    }

    function generateListData(listObj) {
        $("#list1 li").remove();
        $('#list-next').remove();
        if(listObj.length > 0) {
            listObj.count = listObj.count - listObj.length;
            for(var i = 0; i < listObj.length; i ++) {
                $("#list1").append(getList(listObj[i]));
            }
            if(listObj.length > 2) {
                $("#list1").append('<a href="#" id="list-next" data-role="button">More</a>');
                $('#list-next').button();
            }
        } else {
            $("#list1").append('<li style="text-align: center"> No commuters found ! </li>');
        }
        $('#list1').listview('refresh');
    }

    $('#list-next').live('click',function() {
        $.post(VC.url+'/getinfo',{"email" : email, "journey" : journey, "skip" : 1}, function(obj) {

            generateListData(obj.listObj)
        });

        });

    function createTimeMenu(timeObj, timeToDisplay) {
        $('#time > option').remove();
        for(var time in timeObj.time){
            $('#time').append(new Option(time +' (' + timeObj.time[time]+ ')', time));
        }
        $('#time').val(timeToDisplay);
        $('#time').selectmenu("refresh");
    }

    function loadDropDownList3(tempValue,tempTime) {
         if(tempValue != null){
             $('#time > option').remove();
             for(var i=0; i<tempTime.length; i++){
                 var temp=   '<b>' +tempValue[i]+ '</b>';
                 $('#time').append(new Option(tempTime[i]+' ('+tempValue[i]+')', tempTime[i]));
             }
             $('#time').val(timeToDisplay);
             $('#time').selectmenu("refresh");
         }  else {

         }

    }

    function getList(userObj) {
        return '<li><a href="#" id="list_details" data-identity="'+userObj.contact_info.email+'"><image width="100" height="100" src=\"'
            + userObj.avatars.square140 +'\"><h3>'
            + userObj.name +'</h3><p><strong>'
            + userObj.title +'</strong></p></a></li>';
    }

    $('#list_details').live('click', function() {
        USER_INFO.to_email = $(this).attr('data-identity');
        $.mobile.changePage("#page-details", {transition : "none"});
    });
});


