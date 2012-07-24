/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/5/12
 * Time: 1:38 AM
 * To change this template use File | Settings | File Templates.
 */


(function () {
    var j = 0;
    VC.getsocket().on('update', function (data) {
        if (localStorage.getItem('from_email') == data.email) {
            j++;
            $('#count-notification').text(j);
            $('#count-details').text(j);
            $('#count-home').text(j);
            $('#count-profile').text(j);
        }
    });

    $("#page-notification").live('pagebeforeshow', function () {
        j = 0;
        $('#count-notification').text(j);
        $('#count-details').text(j);
        $('#count-home').text(j);
        $('#count-profile').text(j);
        $('#list-notifications li').remove();
        var email = localStorage.getItem('from_email');
        $.post(VC.geturl() + '/getNotifications', {"email":email}, function (data) {
            for (i = data.length - 1; i > 0; i--) {
                var one_min = 1000 * 60;
                var current_time = new Date().getTime();
                var temp = new Date(data[i].timestamp);
                var minutes = (current_time - temp ) / one_min;
                if (minutes < 60) {
                    time = Math.round(minutes) + " minutes ago";
                }
                if (minutes >= 60 && (minutes / 60) < 24) {
                    time = Math.round(minutes / 60) + " hour(s) ago";
                }
                if (minutes / 60 > 24) {
                    time = Math.round((minutes) / (60 * 24)) + " day(s) ago";
                }
                if (data[i].from_email == email) {
                    $("#list-notifications").append('<li id="li-notification"><a data-role="link" title="' + data[i].to_email + ',' + data[i]._id + '" <h3>' + data[i].to_name + '</h3><table><tr><td><p><strong>Sent:' + data[i].message + '</p></strong></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;' + time + '</i></p></td></tr></table></a></li>');
                    $('#list-notifications').listview('refresh');
                }
                if (data[i].to_email == email) {
                    if (data[i].unread == 1) {
                        $("#list-notifications").append('<li id="li-notification"><a data-role="link" title="' + data[i].to_email + ',' + data[i]._id + '" <h3>' + data[i].from_name + '</h3><table><tr><td><strong>Received:' + data[i].message + '</strong></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;' + time + '</i></p></td></tr></table></a></li>');
                        $('#list-notifications').listview('refresh');
                    }
                    else {
                        $("#list-notifications").append('<li id="li-notification"><a data-role="link" title="' + data[i].to_email + ',' + data[i]._id + '" <h3>' + data[i].from_name + '</h3><table><tr><td><strong>Received:' + data[i].message + '</strong></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;' + time + '</i></p></td></tr></table></a></li>');
                        $('#list-notifications').listview('refresh');
                    }
                }
            }
        });

        // $('#li-notification').off('click').on('click', function() {
        $('#li-notification').live('click', function () {
            localStorage.setItem('details', $('a[data-role="link"]', this).attr('title'));
            location.replace("index.html#page-info");
            // $.post(VC.geturl()+'/updateNotifications',{"email":$('#notification-email').val()},function(data){
            // });
        });
    });
})();