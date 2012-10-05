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
        if (localStorage.getItem('from_email') == to_email) {
        count++;
        setNotificationBarStyles(count, "inline-block");
        }
    });

 
	$("#page-notification").live('pagebeforeshow', function() {
		count = 0;
		var email = localStorage.getItem('from_email');
		setNotificationBarStyles(count, "none");
		$('#list-notifications li').remove();
		$.post(VC.url + '/getnotifications', {"email" : email }, function(listObj) {
			for ( i = 0; i < listObj.length; i++) {
					var message = listObj[i].message;
					var time = calculateTime(listObj[i].updated);
					if (listObj[i].from_email == email) {
						$("#list-notifications").append('<li id = "li-notification" data-identity="' + listObj[i].to_email + '"><a data-role = "link" data-identity="'
						 + listObj[i].to_email + '"><image width="100" height="100" src=\"'
						 + listObj[i].to_picture + '\"><h3>' 
						 + listObj[i].to_name + '</h3><p><strong>' 
						 + listObj[i].message + '</p></strong><p class="ui-li-aside"><i>' 
						 + time + '</i></p></a></li>');
					} else {
						$("#list-notifications").append('<li id = "li-notification" data-identity="'+ listObj[i].from_email + '"><a data-role = "link" data-identity="'
						 + listObj[i].from_email + '"><image width="100" height="100" src=\"'
						 + listObj[i].from_picture + '\"><h3>' 
						 + listObj[i].from_name + '</h3><p><strong>' 
						 + listObj[i].message + '</p></strong><p class="ui-li-aside"><i>' 
						 + time + '</i></p></a></li>');
					}
			}
				// $("ul li:eq(1)").attr("data-theme","a");
				$('#list-notifications').attr("data-theme","a");
				$('#list-notifications').listview('refresh');
								

		});

	}); 


    function setNotificationBarStyles(count,displayValue) {
        $('#count-notification').text(count).css("display", displayValue);
        $('#count-details').text(count).css("display", displayValue);
        $('#count-home').text(count).css("display", displayValue);
        $('#count-profile').text(count).css("display", displayValue);
    }

    function calculateTime(time) {
        var one_min = 1000 * 60;
        var current_time = new Date().getTime();
        var minutes = (current_time - time ) / one_min;
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
    	$('#lbltoEmail-notification').attr('value', $(this).attr('data-identity'));
        $.mobile.changePage("#page-messages", {transition : "none"});
        // $.post(VC.geturl()+'/updateNotifications',{"email":$('#notification-email').val()},function(data){
        // });
    });
})();