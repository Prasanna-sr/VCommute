/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/16/12
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */

url="http://localhost:3000";
//url="http://vcommute.cloudfoundry.com";


$("#page-info").bind('pageinit', function() {
    var details = localStorage.getItem('details');
    var temp = new Array();
    temp = details.split(',');
    $.post(url+ '/getuserinfo',{"email":temp[0]},function(userObj){
        $('#profile_name').text(userObj[0].name);
        $('#email_ID').text(userObj[0].contact_info.email);
        $('#mobile_Number').text(userObj[0].contact_info.cell_phone);
        $('#pic').attr("src",userObj[0].avatars.square140);
        $('#title_name').text(userObj[0].title);
        $('#base-location').text(userObj[0].contact_info.location);
        // $('#base-location').text(userObj[0].contact_info.location);
    });
    $('#message').text(temp[1]);
});