/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/3/12
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */


var url="http://localhost:3000";

$("#page-comment").bind('pageinit', function() {
    $('#btnsendMessage').live('click', function() {
        $.post(url+'/saveNotifications',{"fromEmail": localStorage.getItem('from_email'),"fromName":localStorage.getItem('name'),"toEmail":localStorage.getItem('to_email'),"toName":$('#details-name').text(), "message" : $('#txtMessage').val()},function(data){
            alert('result : '+data);
        });
    });
});
