"use strict";

var should = require("should"),
	sinon = require("sinon");

describe('appLog.js Initialize Bristol Object based on Config', function(){
	it('should use default filename and directory', function(){
		var log = require("bristol"),
			path = require("path");

		var logFile = path.dirname(require.main.filename) + path.sep + 'webstalker.log';
		var withFormatterSpy		= sinon.stub(),
			withLowestSeveritySpy	= sinon.stub();


		var addTargetSpy = sinon.stub(log, 'addTarget', function(){
			return {
				withLowestSeverity : withLowestSeveritySpy,
				withFormatter		: withFormatterSpy
			}
		});

		var appLog = require("../../lib/appLog")(
			{
				log : 
				{
					thisSpace : 'intentionally left empty'
				}
			});

		addTargetSpy.calledTwice.should.be.true;
		addTargetSpy.args[0][0].should.equal("file");
		addTargetSpy.args[0][1].should.have.property("file").equal(logFile);

		withLowestSeveritySpy.calledOnce.should.be.true;
		withLowestSeveritySpy.args[0][0].should.equal('warn');

		withFormatterSpy.calledOnce.should.be.true;
		withFormatterSpy.args[0][0].should.equal('human');

		log.addTarget.restore();
	}),
	it('with verbose on everything should be logged', function(){
		var log = require("bristol"),
			path = require("path");

		var logFile = path.dirname(require.main.filename) + path.sep + 'webstalker.log';
		var withFormatterSpy		= sinon.stub(),
			withLowestSeveritySpy	= sinon.stub();


		var addTargetSpy = sinon.stub(log, 'addTarget', function(){
			return {
				withLowestSeverity : withLowestSeveritySpy,
				withFormatter		: withFormatterSpy
			}
		});

		var appLog = require("../../lib/appLog")(
			{
				log : 
				{
					verbose : true
				}
			});

		addTargetSpy.calledTwice.should.be.true;
		addTargetSpy.args[0][0].should.equal('file');
		addTargetSpy.args[0][1].should.have.property('file').equal(logFile);

		withLowestSeveritySpy.calledOnce.should.be.false;

		withFormatterSpy.calledOnce.should.be.true;
		withFormatterSpy.args[0][0].should.equal('human');

		log.addTarget.restore();
	}),
	it('should accept config file and path', function(){
		var log = require("bristol"),
			path = require("path");

		var logFile = '/var/log' + path.sep + 'test.log',
			withFormatterSpy		= sinon.stub(),
			withLowestSeveritySpy	= sinon.stub();


		var addTargetSpy = sinon.stub(log, 'addTarget', function(){
			return {
				withLowestSeverity : withLowestSeveritySpy,
				withFormatter		: withFormatterSpy
			}
		});

		var appLog = require("../../lib/appLog")(
			{
				log : 
				{
					verbose	: true, 
					path 	: '/var/log', 
					file	: 'test.log'
				}
			});

		addTargetSpy.calledTwice.should.be.true;
		addTargetSpy.args[0][0].should.equal('file');
		addTargetSpy.args[0][1].should.have.property('file').equal(logFile);

		log.addTarget.restore();
	})
});