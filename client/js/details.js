/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/16/12
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */


$("#page-details").bind('pagebeforeshow', function() {
	var to_email = $('#lbltoEmail').val();
    $.post(VC.url + '/getuserinfo', {"email" : to_email}, function(userObj) {
        $('#details-name').text(userObj.name);
        $('#aEmail').attr("href", "mailto:" + userObj.contact_info.email);
        $('#email').text(userObj.contact_info.email);
        $('#aPhone').attr("href","tel:" + userObj.contact_info.cell_phone);
        $('#mobile').text(userObj.contact_info.cell_phone);
        $('#details-picture').attr("src", userObj.avatars.square140);
        $('#title').text(userObj.title);
        $('#base-location').text(userObj.contact_info.location);
        $('#base-location').text(userObj.contact_info.location);
        $('#details_preference').text(userObj.Car);
        $('#details_landmark').text(userObj.landmark);
        $('#details_cardescription').text(userObj.carDesc);
        $('#details_additional').text(userObj.preference);
    });

});
