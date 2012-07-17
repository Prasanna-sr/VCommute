/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */

//var url="http://vcommute.cloudfoundry.com";
var url="localhost:3000";

$("#page-profile").bind('pageinit', function() {
    var loc = new Array();
    var loc1 = new Array();
    var startTime = new Array();
    //logged in user
    $('#txtEmail').attr('value',localStorage.getItem('from_email'));
    $.get(url+'/getlocationtimedata',function(data){
        loc = data[0].Loc.split(',');
        loc1 = data[0].Loc1.split(',');
        startTime = data[0].FromTime.split(',');
        returnTime = data[0].ToTime.split(',');
        $('#to-location > option').remove();
        $('#from-location-2 > option').remove();
        for(var i=0;i<loc.length;i++){
            $('#to-location').append(new Option(loc[i],loc[i]));
            $('#from-location-2').append(new Option(loc[i],loc[i]));
            $('#to-location').selectmenu("refresh");
            $('#from-location-2').selectmenu("refresh");
        }
        $('#to-location-2 > option').remove();
        $('#from-location > option').remove();
        for(var i=0;i<loc1.length;i++){
            $('#to-location-2').append(new Option(loc1[i],loc1[i]));
            $('#from-location').append(new Option(loc1[i],loc1[i]));
            $('#to-location-2').selectmenu("refresh");
            $('#from-location').selectmenu("refresh");
        }

        $('#start-time > option').remove();
        for(var i=0;i<startTime.length;i++){
            $('#start-time').append(new Option(startTime[i],startTime[i]));
            $('#start-time').val('08:00AM');
            $('#start-time').selectmenu("refresh");
        }
        $('#return-time > option').remove();
        for(var i=0;i<returnTime.length;i++) {
            $('#return-time').append(new Option(returnTime[i],returnTime[i]));
            $('#return-time').val('05:00PM');
            $('#return-time').selectmenu("refresh");
        }

        $.post(url+'/getuserInfo',{"email":localStorage.getItem('from_email')},function(user){
            var ll= user[0].contact_info.location;
            if((ll).indexOf("San Francisco")!=-1) {
                $('#to-location').val("San Francisco Stevenson Street");
                $('#from-location-2').val("San Francisco Stevenson Street");
                $('#to-location').selectmenu("refresh");
                $('#from-location-2').selectmenu("refresh");
            }
            $('#profile-name').text(user[0].name);
            $('#profile-mobile').val(user[0].contact_info.cell_phone);
            $('#landmark').val(user[0].landmark);
            $('#preference').val(user[0].preference);
            $('#car-desc').val(user[0].carDesc);
            $('#profile-picture').attr("src",user[0].avatars.square70);
            $('#profile-title').text(user[0].title);
            $('#profile-base-location').text(user[0].contact_info.location);
            $('#txtTemp').attr("value",null);
            $('#txtTemptime').attr("value",null);
            if(user[0].profile==1) {
                $('#from-location').val(user[0].fromLocation1);
                $('#from-location-2').val(user[0].fromLocation2);
                $('#to-location').val(user[0].toLocation1);
                $('#to-location-2').val(user[0].toLocation2);
                $('#start-time').val(user[0].startTime);
                $('#return-time').val(user[0].departTime);
                $('#to-location').selectmenu("refresh");
                $('#from-location-2').selectmenu("refresh");
                $('#to-location-2').selectmenu("refresh");
                $('#from-location').selectmenu("refresh");
                $('#start-time').selectmenu("refresh");
                $('#return-time').selectmenu("refresh");
                $('#txtTemp').attr("value",user[0].fromLocation1+"_"+user[0].toLocation1+","+user[0].fromLocation2+"_"+user[0].toLocation2);
                $('#txtTemptime').attr("value",user[0].startTime+","+user[0].departTime);
                if(user[0].Car!=null){
                    $('#Car').attr("checked",true).checkboxradio("refresh");
                }
                if(user[0].NoCar!=null){
                    $('#Nocar').attr("checked",true).checkboxradio("refresh");
                }
                if(user[0].DriveDays!=null){
                    $('#DriveDays').attr("checked",true).checkboxradio("refresh");
                }
                if(user[0].DriveWeek!=null){
                    $('#DriveWeek').attr("checked",true).checkboxradio("refresh");
                }
                if(user[0].hide!=null){
                    $('#hide').attr("checked",true).checkboxradio("refresh");
                }
            }
        });
    });

    $('#btnSubmit').live('click', function() {
        var expression = /[^0-9\s-]/;
        if($("#landmark").val()!=""){
            if ($("#profile-mobile").val() != "") {
                if(!expression.test($("#profile-mobile").val())) {
                    $.post(url+'/saveProfile',$("#formProfile").serialize(),function(data){
                        location.replace('index.html#page-home');
                    });
                } else{
                    alert("mobile number is invalid");
                }
            }
            else{
                alert("mobile number is mandatory");
            }
        }
        else{
            alert("landmark field is mandatory");
        }
    });

    $('#from-location').live('change', function() {
       $("#to-location-2").val($("#from-location option:selected").text());
       $('#to-location-2').selectmenu("refresh");
    });

       $('#to-location').live('change', function() {
        $("#from-location-2").val($("#to-location option:selected").text());
        $('#from-location-2').selectmenu("refresh");
    });
});

