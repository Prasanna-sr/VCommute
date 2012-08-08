/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */

var VC = {"domain" : "@vmware.com"};
//VC.cloudFoundryUrl = "http://vcommute.cloudfoundry.com:80";
//var href = document.location.href;
//VC.url = VC.cloudFoundryUrl;
//if(href.indexOf("cloudfoundry") == -1 || href.indexOf("file") != -1)  {
//    VC.url = document.location.host;
//}
//VC.url = "http://" + document.location.host;


VC.url = "http://vcommute.cloudfoundry.com:80";
//VC.url = "http://" + document.location.host;
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
        var email = getEmailID(user);
        $.post(VC.url + '/login', { "user" : email, "password" : password }, function (data) {
            if (data == USERSTATUS.NEWUSER) {
                localStorage.setItem('from_email', email);
               $.mobile.changePage("#page-profile");
            } else if (data == USERSTATUS.LOGGEDIN) {
                localStorage.setItem('from_email', email);
                $.mobile.changePage("#page-home");
            } else if (data == USERSTATUS.LOGINFAILED) {
                alert('Login failed');
            } else {
                alert(data);
            }
        });
    } else {
        alert('User name and Password should not be empty');
    }
}

function getEmailID(user) {
    user = user.replace(VC.domain, "");
    user = user.toLowerCase();
    user = user + VC.domain;
    return user;

}

