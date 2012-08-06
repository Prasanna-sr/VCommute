/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/16/12
 * Time: 1:12 AM
 * To change this template use File | Settings | File Templates.
 */


$("#page-details").bind('pagebeforeshow', function() {
    var preference=null;
    $.post(VC.url+'/getuserinfo',{"email":USER_INFO.to_email},function(userObj){

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
        $('#details-name').text(userObj.name);
        $('#aEmail').attr("href","mailto:"+userObj.contact_info.email);
        $('#email').text(userObj.contact_info.email);
        $('#aPhone').attr("href","tel:"+userObj.contact_info.cell_phone);
        $('#mobile').text(userObj.contact_info.cell_phone);
        $('#picture').attr("src",userObj.avatars.square140);
        $('#title').text(userObj.title);
        $('#base-location').text(userObj.contact_info.location);
        $('#base-location').text(userObj.contact_info.location);
        $('#details_preference').text(preference);
        $('#details_landmark').text(userObj.landmark);
        $('#details_cardescription').text(userObj.carDesc);
        $('#details_additional').text(userObj.preference);
    });

});
