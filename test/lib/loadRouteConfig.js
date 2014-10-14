var joi		= require("joi"),
	should 	= require("should"),
	sinon	= require("sinon");

describe("loadRouteConfig loads the routes JSON object", function(){
	it("should return a new instance", function(){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.should.be.instanceOf(loadRouteConfig);
	}),
	it("loadFile should return a promise that returns a JSON object based on relative path and file name", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			log 			= require("bristol"),
			instance		= new loadRouteConfig();

		var infoSpy			= sinon.stub(log, "info"),
			warnSpy			= sinon.stub(log, "warn");

		instance.loadFile("test/mock", "routeConfigMock.json")
			.then(function(obj){
				obj.should.have.property("testRoute1");
				obj.testRoute1.should.have.property("foo").equal("bar");
				obj.testRoute1.should.have.property("test").true;
				infoSpy.calledOnce.should.be.true;
				warnSpy.called.should.be.false;
				log.info.restore();
				log.warn.restore();
				done();
			})
			.catch(done);
	}),
	it("loadFile should return a promise that returns a JSON object based on relative path and file name combines", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			log 			= require("bristol"),
			instance		= new loadRouteConfig();

		var infoSpy			= sinon.stub(log, "info"),
			warnSpy			= sinon.stub(log, "warn");

		instance.loadFile("test/mock/routeConfigMock.json")
			.then(function(obj){
				obj.should.have.property("testRoute1");
				obj.testRoute1.should.have.property("foo").equal("bar");
				obj.testRoute1.should.have.property("test").true;
				infoSpy.calledOnce.should.be.true;
				warnSpy.called.should.be.false;
				log.info.restore();
				log.warn.restore();
				done();
			})
			.catch(done);
	}),
	it("loadFile should return an error if the file is not found", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			log 			= require("bristol"),
			instance		= new loadRouteConfig();

		var infoSpy			= sinon.stub(log, "info"),
			warnSpy			= sinon.stub(log, "warn");

		instance.loadFile("test/mock/routeConfigMock-NotExist.json")
			.then(function(){
				done("We shouldn't be here");
			})
			.catch(function(e){
				e.should.be.instanceOf(Error);
				infoSpy.calledOnce.should.be.true;
				warnSpy.calledOnce.should.be.true;
				log.info.restore();
				log.warn.restore();
				done();
			})
	}),
	it("validateRoutes should return the routes object if everything validates",function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.schema = joi.object().keys({
			"foo"	: joi.string().required().valid('bar','foo')
		});

		var testRoutes = {
			"testRoute1"	: {
				"foo"	: "bar"
			},
			"testRoute2"	: {
				"foo"	: "foo"
			}
		}

		instance.validateRoutes(testRoutes)
			.then(function(resp){
				should.exist(resp);
				resp.should.have.property("testRoute1").have.property("foo").equal("bar");
				resp.should.have.property("testRoute2").have.property("foo").equal("foo");
				done();
			})
			.catch(done);
	}),
	it("validateRoutes should return an error if we don't validate correctly", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.schema = joi.object().keys({
			"foo"	: joi.string().required().valid("foo","bar")
		});

		var testRoutes = {
			"testRoute1"	: {
				"foo"	: "nope"
			},
			"testRoute2"	: {
				"foo"	: "foo"
			}
		}

		instance.validateRoutes(testRoutes)
			.then(function(resp){
				done("we shouldn't be here");
			})
			.catch(function(e){
				e.should.be.instanceOf(Error);
				done();
			});
	}),
	it("loadRouteConfig should bubble up errors", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			log 			= require("bristol"),
			instance		= new loadRouteConfig();

		var infoSpy			= sinon.stub(log, "info"),
			warnSpy			= sinon.stub(log, "warn");

		instance.schema = joi.object().keys({
			"foo"	: joi.string().required().valid('bar','foo')
		});

		instance.loadRouteConfig("test/mock/routeConfigMock.json")
			.then(function(e){
				done("should not be here");
			})
			.catch(function(e){
				e.should.be.instanceOf(Error);
				warnSpy.called.should.be.false;
				infoSpy.calledTwice.should.be.true;
				log.info.restore();
				log.warn.restore();
				done();
			});
	}),
	it("loadRouteConfig should return the data on true", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			log 			= require("bristol"),
			instance		= new loadRouteConfig();

		var infoSpy			= sinon.stub(log, "info"),
			warnSpy			= sinon.stub(log, "warn");

		instance.schema = joi.object().keys({
			"foo"	: joi.string().required().valid('foo','bar')
		});

		instance.loadFile("test/mock/routeConfigMock.json")
			.then(function(resp){
				resp.should.have.property("testRoute1");
				resp.testRoute1.should.have.property("foo").equal("bar");
				log.info.restore();
				log.warn.restore();
				done();
			})
			.catch(done);
	})
});