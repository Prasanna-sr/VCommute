/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */

$("#page-profile").bind('pagebeforeshow', function() {

    var loc = new Array();
    var loc1 = new Array();
    var startTime = new Array();
    $('#txtEmail').attr('value',localStorage.getItem('from_email'));
    $.get(VC.geturl()+'/getlocationtimedata',function(data){
        loc = data[0].Loc.split(',');
        loc1 = data[0].Loc1.split(',');
        startTime = data[0].FromTime.split(',');
        returnTime = data[0].ToTime.split(',');
        $('select >option').remove();

        loaddropdown("#to-location",loc);
        loaddropdown("#from-location-2",loc);
        loaddropdown("#to-location-2",loc1);
        loaddropdown("#from-location",loc1);
        loaddropdown("#start-time",startTime);
        loaddropdown("#return-time",returnTime);

        function loaddropdown(id,value){
            for(var i=0;i<value.length;i++){
                $(id).append(new Option(value[i],value[i]));
            }
        }
        $('#start-time').val('08:00AM');
        $('#return-time').val('05:00PM');

        $.post(VC.geturl()+'/getuserInfo',{"email":localStorage.getItem('from_email')},function(user){
            var ll= user[0].contact_info.location;
            if((ll).indexOf("San Francisco")!=-1) {
                $('#to-location').val("San Francisco Stevenson Street");
                $('#from-location-2').val("San Francisco Stevenson Street");
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
                $('#txtTemp').attr("value",user[0].fromLocation1+"_"+user[0].toLocation1+","+user[0].fromLocation2+"_"+user[0].toLocation2);
                $('#txtTemptime').attr("value",user[0].startTime+","+user[0].departTime);
                if(user[0].Car!=null){
                    $('#Car').attr("checked",true);
                }
                if(user[0].NoCar!=null){
                    $('#Nocar').attr("checked",true);
                }
                if(user[0].DriveDays!=null){
                    $('#DriveDays').attr("checked",true);
                }
                if(user[0].DriveWeek!=null){
                    $('#DriveWeek').attr("checked",true);
                }
                if(user[0].hide!=null){
                    $('#hide').attr("checked",true);
                }
            }
           $("input[type='checkbox']").checkboxradio("refresh");
            $('select').selectmenu("refresh");
        });
    });

    $('#btnSubmit').off('click').on('click', function() {
        var expression = /[^0-9\s-]/;
        if($("#landmark").val()!=""){
            if ($("#profile-mobile").val() != "") {
                if(!expression.test($("#profile-mobile").val())) {
                    $.post(VC.geturl()+'/saveProfile',$("#formProfile").serialize(),function(data){
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

    $('#from-location').off('click').on('change', function() {
        $("#to-location-2").val($("#from-location option:selected").text());
        $('#to-location-2').selectmenu("refresh");
    });
    $('#to-location').off('click').on('change', function() {
        $("#from-location-2").val($("#to-location option:selected").text());
        $('#from-location-2').selectmenu("refresh");
    });
});

