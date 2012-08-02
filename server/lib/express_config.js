var express = require('express');

exports.configure = function (app) {
    app.configure(function () {
        app.use(express.cookieParser());
        if (process.env.stickySession && process.env.stickySession == "ON") {
            app.use(express.session({
                secret:'your secret here',
                key:'jsessionid'
            }));
        }
        else {
            app.use(express.session({
                secret:'your secret here'
            }));
        }

        app.use(express.static(__dirname + '/../../client'));
        app.use(express.bodyParser());
    });

    app.configure('development',
        function () {
            app.use(express.errorHandler({
                dumpExceptions:true,
                showStack:true
            }));
        });

    app.configure('production',
        function () {
            app.use(express.errorHandler());
        });
}