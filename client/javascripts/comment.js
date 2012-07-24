/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/3/12
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */


$("#page-comment").bind('pagebeforeshow', function () {
    $('#btnsendMessage').off('click').on('click', function () {
        $.post(VC.geturl() + '/saveNotifications', {"fromEmail":localStorage.getItem('from_email'), "fromName":localStorage.getItem('name'),
            "toEmail":localStorage.getItem('to_email'), "toName":$('#details-name').text(), "message":$('#txtMessage').val()},
            function (data) {
            notify(localStorage.getItem('to_email'));
        });
    });
});

function notify(data) {
    socket.emit('notify', data);
}