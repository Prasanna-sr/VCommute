/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:04 PM
 * To change this template use File | Settings | File Templates.
 */


$("#page-profile").bind('pagebeforeshow', function() {

    var email =  localStorage.getItem('from_email');

    // is used for business logic
    $('#txtEmail').attr('value', email);

    $.get(VC.url + '/getlocationtimedata', function(obj) {
            $('select >option').remove();
            loadAllDropDowns(obj);
            setDefaultValues();
            populateUserData();
    });

    function populateUserData() {
        $.post(VC.url + '/getuserinfo', {"email" : email}, function(userObj) {
            if(userObj && !userObj.error) {
                //USER_INFO is used in commments page
               // USER_INFO.name=userObj.name;
                var userLocation = userObj.contact_info.location;
                if((userLocation).indexOf("San Francisco") > 0) {
                    $('#to-location').val("San Francisco Stevenson Street");
                    $('#from-location-2').val("San Francisco Stevenson Street");
                }
                $('#profile-name').text(userObj.name);
                $('#profile-mobile').val(userObj.contact_info.cell_phone);
                $('#landmark').val(userObj.landmark);
                $('#preference').val(userObj.preference);
                $('#car-desc').val(userObj.carDesc);
                $('#profile-picture').attr("src",userObj.avatars.square70);
                $('#profile-title').text(userObj.title);
                $('#profile-base-location').text(userObj.contact_info.location);
                $('#txtTemp').attr("value",null);
                $('#txtTemptime').attr("value",null);
                populateUserPreferenceData(userObj);
                refreshElements();
            } else {
                alert("Internal Server Error. Please try after some time");
            }

        });
    }

    function refreshElements(){
        $("input[type = 'checkbox']").checkboxradio("refresh");
        $('#from-location-2').selectmenu("refresh");
        $('#from-location').selectmenu("refresh");
        $('#to-location').selectmenu("refresh");
        $('#to-location-2').selectmenu("refresh");
        $('#start-time').selectmenu("refresh");
        $('#return-time').selectmenu("refresh");
        $('#profile_preference').selectmenu("refresh");
    }

    function loadAllDropDowns(obj) {
        loadDropDown("#to-location", obj.officeLocation);
        loadDropDown("#from-location-2", obj.officeLocation);
        loadDropDown("#from-location", obj.allLocation);
        loadDropDown("#to-location-2", obj.allLocation);
        loadDropDown("#start-time", obj.startTime);
        loadDropDown("#return-time",  obj.returnTime);
        loadDropDown("#profile_preference", obj.drivingPreference);

    }

    function loadDropDown(id, dataStr) {
        var value = dataStr.split(',');
        for(var i = 0; i < value.length; i++){
            $(id).append(new Option(value[i], value[i]));
        }
    }

    function setDefaultValues() {
        $('#start-time').val('08:00');
        $('#return-time').val('17:00');
    }

    function populateUserPreferenceData(userObj) {
        if(userObj.profile == 1) {
            $('#from-location').val(userObj.fromLocation1);
            $('#from-location-2').val(userObj.fromLocation2);
            $('#to-location').val(userObj.toLocation1);
            $('#to-location-2').val(userObj.toLocation2);
            $('#start-time').val(userObj.startTime);
            $('#return-time').val(userObj.departTime);
            $('#profile_preference').val(userObj.Car);
            if(userObj.hide == "hide") {
            	$('#hide').attr("checked", true);
            }
            if(userObj.notify == "notification") {
            	$('#notification').attr("checked", true);
            }
            $('#txtTemp').attr("value", userObj.fromLocation1 + "_" + userObj.toLocation1 +
                "," + userObj.fromLocation2 + "_" + userObj.toLocation2);
            $('#txtTemptime').attr("value", userObj.startTime + "," + userObj.departTime);
        }
    }

    $('#btnSubmit').off('click').on('click', function() {
        var expression = /[^0-9\s-]/;
        if ($("#profile-mobile").val() != "") {
            if ($("#landmark").val() != "") {
                if(!expression.test($("#profile-mobile").val())) {
                	setCheckboxesValue();
                    $.post(VC.url + '/saveprofile', $("#formProfile").serialize(), function(data) {
                        if(data == "Success") {
                           $.mobile.changePage('#page-home', {transition : "none"});
                        } else {
                            alert("Internal Server Error. Please try after some time");
                        }
                    });
                } else {
                    alert("Mobile number is invalid");
                }
            }
            else {
                alert("Landmark field is mandatory");
            }
        }
        else {
            alert("Mobile number is mandatory");
        }
    });
    
    function setCheckboxesValue() {
    	if($('#hide').attr("checked")) {
    		$('#hide').attr("value","hide");
    	}
    	if($('#notification').attr("checked")) {
    		$('#notification').attr("value","notification");
    	}
    }

    $('#from-location').off('click').on('change', function() {
        $("#to-location-2").val($("#from-location option:selected").text());
        $('#to-location-2').selectmenu("refresh");
    });

    $('#to-location').off('click').on('change', function() {
        $("#from-location-2").val($("#to-location option:selected").text());
        $('#from-location-2').selectmenu("refresh");
    });
});

