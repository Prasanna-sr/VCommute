/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */

var VC = {};
VC.cloudFoundryUrl = "http://vcommute.cloudfoundry.com:80";
var href = document.location.href;
VC.url = VC.cloudFoundryUrl;
if(href.indexOf("cloudfoundry") == -1 || href.indexOf("file") == -1)  {
   VC.url = document.location.host;
}
VC.socket = io.connect(VC.url);

var USERSTATUS = {
    NEWUSER:"NEW USER",
    LOGGEDIN:"ALREADY LOGGED IN",
    LOGINFAILED:"LOGIN FAILED"
};

$("#page-login").bind('pageinit', function () {
    $("#btnlogin").off('click').on('click', function () {
        login();
    });
    $("#txtPassword").keypress(function (e) {
        if (e.which == 13) {
            login();
        }
    });
});

function login() {
    var user = $('#txtUser').val();
    var password = $('#txtPassword').val();
    if (user != "" && password != "") {
        var email_ext = "@vmware.com";
        user = user.replace(email_ext, "");
        $.post(VC.url + '/login', { "user":user, "password":password }, function (data) {
            if (data == USERSTATUS.NEWUSER) {
                localStorage.setItem('from_email', user + email_ext);
                location.replace("index.html#page-profile");
            } else if (data == USERSTATUS.LOGGEDIN) {
                localStorage.setItem('from_email', user + email_ext);
                location.replace("index.html#page-home");
            } else if (data == USERSTATUS.LOGINFAILED) {
                alert('Login failed');
            }
        });
    } else {
        alert('User name and Password should not be empty');
    }
}

