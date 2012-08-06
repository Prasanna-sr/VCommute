/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/3/12
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */


$("#page-comment").bind('pagebeforeshow', function () {
    var email = localStorage.getItem('from_email');
    $('#btnsendMessage').off('click').on('click', function () {
        $.post(VC.url + '/saveNotifications', {"fromEmail":email, "fromName":USER_INFO.name,
            "toEmail":USER_INFO.to_email, "toName":$('#details-name').text(), "message":$('#txtMessage').val()},
            function () {
            notify(USER_INFO.to_email);
        });
    });
});

function notify(to_email) {
    VC.socket.emit('notify', to_email);
    alert("Message Sent !");

}