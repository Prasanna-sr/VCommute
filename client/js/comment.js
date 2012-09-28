/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/3/12
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */


$("#page-comment").bind('pagebeforeshow', function () {
    $('#txtMessage').val('');    
    $('#btnsendMessage').off('click').on('click', function () {
    	var from_email = localStorage.getItem('from_email');
    	var details = {"fromEmail" : from_email, "fromName" : $('#lblFromName').val(), "fromPic" : $('#lblFromPic').val(),
            "toEmail" : $('#lbltoEmail').val(), "toName" : $('#details-name').text(), "toPic" : $('#details-picture').attr("src"),
             "message" : $('#txtMessage').val()};
        $.post(VC.url + '/savenotifications', details,
            function () {
            notify($('#lbltoEmail').val());
        });
    });
});

function notify(to_email) {
    VC.socket.emit('notify', to_email);
    alert("Message Sent !");

}