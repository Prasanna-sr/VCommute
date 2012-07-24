/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/16/12
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */


$("#page-info").bind('pagebeforeshow', function() {
    var temp = new Array();
    var details = localStorage.getItem('details');
    temp = details.split(',');
    $.post(VC.geturl()+ '/getuserinfo',{"email":temp[0]},function(userObj){
        $('#profile_name').text(userObj[0].name);
        $('#email_ID').text(userObj[0].contact_info.email);
        $('#mobile_Number').text(userObj[0].contact_info.cell_phone);
        $('#pic').attr("src",userObj[0].avatars.square140);
        $('#title_name').text(userObj[0].title);
        $('#base-location').text(userObj[0].contact_info.location);
        // $('#base-location').text(userObj[0].contact_info.location);
    });
    $.post(VC.geturl()+'/getNotificationbyID',{"id":temp[1]},function(data){
        if(data[0].from_email== localStorage.getItem('from_email')){
            $('#message').text("Sent : "+data[0].message);
        }
        if(data[0].to_email== localStorage.getItem('from_email')){
            $('#message').text("Received : "+data[0].message);
        }
        $('#timestamp').text(data[0].timestamp);

    });
});