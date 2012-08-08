/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 7/5/12
 * Time: 1:38 AM
 * To change this template use File | Settings | File Templates.
 */


(function () {
    var count = 0;
    VC.socket.on('update', function (to_email) {
        //todo
        //if statement commented for testing purpose
        //if (localStorage.getItem('from_email') == to_email) {
        count++;
        setNotificationBarStyles(count, "inline-block");

    });

    $("#page-notification").live('pagebeforeshow', function () {
        count = 0;
        var email = localStorage.getItem('from_email');
        setNotificationBarStyles(count, "none");
        $('#list-notifications li').remove();
        $.post(VC.url + '/getnotifications', {"email" : email}, function (data) {
            for (i = 0; i < data.length; i++) {
                var  userObj = data[i];
                var time = calculateTime(userObj);
                if (userObj.from_email == email) {
                    $("#list-notifications").append('<li id = "li-notification"><a data-role = "link" ' +
                        'data-identity="' + userObj.to_email + ',' + userObj._id + '" <h3>' + userObj.to_name + '</h3><table><tr><td><p><strong>' +
                        'Sent:' + userObj.message + '</p></strong></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;'
                        + time + '</i></p></td></tr></table></a></li>');
                    $('#list-notifications').listview('refresh');
                }
                if (userObj.to_email == email) {
                        $("#list-notifications").append('<li id="li-notification"><a data-role="link" ' +
                            'data-identity="' + userObj.to_email + ',' + userObj._id + '" <h3>' + userObj.from_name + '</h3><table><tr><td><strong>' +
                            'Received:' + userObj.message + '</strong></td><td align="right"><p><i>&nbsp;&nbsp;&nbsp;&nbsp;'
                            + time + '</i></p></td></tr></table></a></li>');
                        $('#list-notifications').listview('refresh');
                }
            }
        });

    });

    function setNotificationBarStyles(count,displayValue) {
        $('#count-notification').text(count).css("display", displayValue);
        $('#count-details').text(count).css("display", displayValue);
        $('#count-home').text(count).css("display", displayValue);
        $('#count-profile').text(count).css("display", displayValue);
    }

    function calculateTime(userObj) {
        var one_min = 1000 * 60;
        var current_time = new Date().getTime();
        var temp = new Date(userObj.timestamp);
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
        return time;
    }

    $('#li-notification').live('click', function () {
        var param1 = encodeURIComponent($('a[data-role="link"]', this).attr('data-identity'));
        location.replace("index.html?param1="+ param1 +"#page-info");
        //$.mobile.changePage("/index.html",{dataUrl:"?param1=asdf#page-info", changeHash: false});
        // $.post(VC.geturl()+'/updateNotifications',{"email":$('#notification-email').val()},function(data){
        // });
    });
})();