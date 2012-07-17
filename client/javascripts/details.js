/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/16/12
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */


var url="http://localhost:3000";
//var url="http://vcommute.cloudfoundry.com";

$("#page-details").bind('pageinit', function() {
    var preference=null;
    var email = localStorage.getItem('to_email');
    $.post(url+'/getuserinfo',{"email":email},function(userObj){

        if(userObj[0].NoCar!=null){
            preference = userObj[0].NoCar;
        }
        if(userObj[0].Car!=null){
            if(preference!=null){
                preference = preference + ',' + userObj[0].Car;
            }
            else{
                preference = userObj[0].Car;
            }
        }
        if(userObj[0].DriveDays!=null){
            if(preference!=null){
                preference = preference + ','+ userObj[0].DriveDays;
            }
            else{
                preference = userObj[0].DriveDays;
            }
        }
        if(userObj[0].DriveWeek!=null){
            if(preference!=null){
                preference = preference +','+ userObj[0].DriveWeek;
            }
            else{
                preference = userObj[0].DriveWeek;
            }
        }
        $('#details-name').text(userObj[0].name);
        $('#aEmail').attr("href",userObj[0].contact_info.email);
        $('#email').text(userObj[0].contact_info.email);
        $('#aPhone').attr("href","tel:"+userObj[0].contact_info.cell_phone);
        $('#mobile').text(userObj[0].contact_info.cell_phone);
        $('#picture').attr("src",userObj[0].avatars.square140);
        $('#title').text(userObj[0].title);
        $('#base-location').text(userObj[0].contact_info.location);
        $('#base-location').text(userObj[0].contact_info.location);
        $('#details_preference').text(preference);
        $('#details_landmark').text(userObj[0].landmark);
        $('#details_cardescription').text(userObj[0].carDesc);
        $('#details_additional').text(userObj[0].preference);
    });

});
