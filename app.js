"use strict";

var app			= require("./lib/"),
	instance	= new app(),
	log			= require("bristol");

instance.run();

process.on('uncaughtException', function(err) {
       console.log('Uncaught exception:', err, err.stack);
       log.error(err, {
               event: "Uncaught exception.  Triggering safe restart.",
               eventId: "appName:exception"
       });
       app.shutdown();
});