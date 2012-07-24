/**
 * Created with IntelliJ IDEA.
 * User: prasannasr
 * Date: 6/27/12
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */

var VC = {
//    url : "http://vcommute.cloudfoundry.com",
    url : "http://localhost:3005",
    socket : io.connect(),
    geturl : function(){return this.url;},
    getsocket: function(){return this.socket;}

};

$("#page-login").bind('pageinit', function() {
    $("#btnlogin").off('click').on('click',function () {
        login();
    });
    $("#txtPassword").keypress(function(e){
        if(e.which==13){
            login();
        }
    } );
});

function login(){
    if($('#txtUser').val()!="" && $('#txtPassword').val()!="") {
        var user = $('#txtUser').val();
        var password = $('#txtPassword').val();
        $.post(VC.geturl()+'/login', { "user": user, "password": password }, function (data) {
            if(data=='0') {
                localStorage.setItem('from_email', user+'@vmware.com');
                location.replace("index.html#page-profile");
            }
            if(data=='1'){
                localStorage.setItem('from_email', user+'@vmware.com');
                location.replace("index.html#page-home");
            }
            if(data=='-1'){
                alert('Login failed');
            }
        });
    } else{
        alert('User name and Password should not be empty');
    }
}

