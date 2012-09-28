

$("#page-messages").bind('pagebeforeshow',function() {
	var fromEmail = localStorage.getItem('from_email');
	var toEmail = $('#lbltoEmail-notification').val();
	$('#txtSend').val('');
	$.post(VC.url + '/getMessages', {"fromEmail" : fromEmail , "toEmail" : toEmail}, function(listObj) {	
		$('#list-messages li').remove();	
		for(i = 0; i < listObj.messages.length; i++) {	
			var time = calculateTime(listObj.messages[i].ts);
			var email;
			var picture;
			var name;
			if(listObj.messages[i].from == listObj.from_email) {
				email = listObj.from_email;
				picture = listObj.from_picture;
				name = listObj.from_name;					
			} else {
				email = listObj.to_email;
				picture = listObj.to_picture;
				name = listObj.to_name;				
			}	
			$("#messages-detailedlist").append('<table class="messages"><tr><td rowspan="3" valign="top"><img src="'
			+ picture + '"> </td></tr><tr><td><label class="name">'
			+ name + '</label></td><td align="right">'
			+ time + '</tr><tr><td>'
			+ listObj.messages[i].data + '</td></tr></table><hr/>');
		// <hr/>					
			// $("#list-messages").append('<li id = "li-notification" data-identity="' 
			// + listObj.messages[i].data + '"><a data-role = "link"><image width="100" height="100" src=\"'
			// + picture + '\"><h3>' 
			// + name + '</h3><p><strong>' 
			// + listObj.messages[i].data + '</p></strong><p class="ui-li-aside"><i>' 
			// + time + '</i></p></a></li>');						 
			// $('#list-messages').listview('refresh');				
		}
	});
	
	    $('#btnSend-messages').off('click').on('click', function () {
			$.post(VC.url + '/updateNotifications', {"message" : $('#txtSend').val(), 
			"from_email" : localStorage.getItem('from_email'), "to_email" : $('#lbltoEmail-notification').val() }, function(result){
				alert("Message Sent !");
			});			
		});
		
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
});