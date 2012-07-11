/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/5/12
 * Time: 1:38 AM
 * To change this template use File | Settings | File Templates.
 */



$("#page-notification").bind('pageinit',function() {
//$(document).ready(function () {
    var email =localStorage.getItem('myKey1');

   $.post('/getNotifications',{"email":email},function(data){

         for (i=0;i<data.length;i++){
             var one_min=1000*60;
             var current_time= new Date().getTime();
             var temp = new Date(data[i].timestamp);
             var minutes = (current_time -temp )/one_min;
             if(minutes<60){
                 time = Math.round(minutes) + " minutes ago";
                 //data[i].timestamp=  days/60;
             }
             if(minutes>=60 &&(minutes/60) < 24){
                 time =  Math.round(minutes/60) + " hour(s) ago";
             }
             if(minutes/60>24){
                 time =  Math.round((minutes)/(60*24)) + " day(s) ago";
             }

             if(data[i].from_email !=email)
             {
                 if(data[i].unread==1)
                 {
                     $("#list-notifications").append('<li><a data-role="link" title="notifications" <h3>'+data[i].from_name+'</h3><table><tr><td><b>Received:'+data[i].message+'</b></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;'+time+'</i></p></td></tr></table></a></li>');

                     $('#list-notifications').listview('refresh');
                 }
                 else
                 {
                     $("#list-notifications").append('<li><a data-role="link" title="notifications" <h3>'+data[i].from_name+'</h3><table><tr><td><p>Received:'+data[i].message+'</p></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;'+time+'</i></p></td></tr></table></a></li>');
                     $('#list-notifications').listview('refresh');
                 }


             }
             if(data[i].to_email !=email)
             {
                 $("#list-notifications").append('<li><a data-role="link" id="notifications" <h3>'+data[i].to_name+'</h3><table><tr><td><p>Sent:'+data[i].message+'</p></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;'+time+'</i></p></td></tr></table></a></li>');
                 $('#list-notifications').listview('refresh');
             }
             $('#notification-email').attr("value",data[i].from_email);
             $('#notification-message').attr("value",data[i].message);
         }

    });

    $('#notifications').live('click', function() {
        //alert('clicked');
       // var email = $(this).attr("title");
        localStorage.setItem('details',$('#notification-email').val()+','+$('#notification-message').val());
        location.replace("index.html#page-info");
        $.post('/updateNotifications',{"email":$('#notification-email').val()},function(data){
        });


    });
});