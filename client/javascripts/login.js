/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */

//var url="http://vcommute.cloudfoundry.com";
var url="localhost:3000";

$("#page-login").bind('pageinit', function() {
    $.support.cors=true;
    $.mobile.allowCrossDomainPages=true;
    $("#btnlogin").click(function () {
        if($('#txtUser').val()!="" && $('#txtPassword').val()!="") {
            var user = $('#txtUser').val();
            var password = $('#txtPassword').val();
            $.post(url+'/login', { "user": user, "password": password }, function (data) {
                if(data=='0') {
                    localStorage.setItem('from_email', user+'@vmware.com');
                    location.replace("index.html#page-profile");
                }
                if(data=='1'){
                    localStorage.setItem('from_email', user+'@vmware.com');
                    location.replace("index.html#page-home");
                }
                if(data=='-1'){
                    alert('login failed');
                }
            });
        } else{
            alert('user name and password should not be null');
        }
    });
});

