/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/16/12
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */


$("#page-info").bind('pagebeforeshow', function() {
    var temp = new Array();
    var params = new Array();
    var temp =   document.location.search.split("=");
    var params = decodeURIComponent(temp[1]).split(",");
    $.post(VC.url + '/getuserinfo',{"email" : params[0]}, function(userObj) {
        $('#profile_name').text(userObj.name);
        $('#email_ID').text(userObj.contact_info.email);
        $('#mobile_Number').text(userObj.contact_info.cell_phone);
        $('#pic').attr("src",userObj.avatars.square140);
        $('#title_name').text(userObj.title);
        $('#base-location').text(userObj.contact_info.location);
        // $('#base-location').text(userObj.contact_info.location);
    });
    $.post(VC.url + '/getNotificationbyID', {"id" : params[1]}, function(objNotify) {
        if(objNotify[0].from_email == localStorage.getItem('from_email')) {
            $('#message').text("Sent : "+ objNotify[0].message);
        }
        if(data[0].to_email == localStorage.getItem('from_email')) {
            $('#message').text("Received : "+ objNotify[0].message);
        }
        $('#timestamp').text(objNotify[0].timestamp);

    });
});