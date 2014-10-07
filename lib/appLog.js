"use strict";

module.exports = function(config){
	var log = require('bristol'),
		logFile = config.log.path,
		path = require('path');
	
	if(!logFile){
		logFile = path.dirname(require.main.filename);
	}
	if(logFile.substr(-1) !== path.sep){
		logFile += path.sep;
	}
	logFile += config.log.file || 'webstalker.log';

	if(config.log.verbose){
		log.addTarget('file', {file : logFile});
	} else {
		log.addTarget('file', {file : logFile})
			.withLowestSeverity('warn');
	}
	log.addTarget('console')
		.withFormatter('human');

	return log;
};