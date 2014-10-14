var _		= require("lodash"),
	joi		= require("joi"),
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
	}),
	it("schema should error when missing required fields", function(){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig(),
			testData		= {
				destationUrl 	: "http://some.random.url",
				routeName		: "MyTestRoute",
				tubeName		: "TestTube"
			};

		var noDestinationUrl 	= _.cloneDeep(testData),
			noRouteName			= _.cloneDeep(testData),
			noTubeName			= _.cloneDeep(testData);

		delete noDestinationUrl.destationUrl;
		delete noRouteName.routeName;
		delete noTubeName.tubeName;

		var noDestinationUrlResult = joi.validate(noDestinationUrl, instance.schema),
			noRouteNameResult		= joi.validate(noRouteName, instance.schema),
			noTubeNameResult		= joi.validate(noTubeName, instance.schema);

		noDestinationUrlResult.should.have.property("error").instanceOf(Error);
		noRouteNameResult.should.have.property("error").instanceOf(Error);
		noTubeNameResult.should.have.property("error").instanceOf(Error);
	}),
	it("schema should not error when required fields are passed", function(){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig(),
			testData		= {
				destationUrl 	: "http://some.random.url",
				routeName		: "MyTestRoute",
				tubeName		: "TestTube"
			};

		var result = joi.validate(testData, instance.schema);

		result.should.have.property("error").equal(null);
	}),
	it("should set defaults", function(){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig(),
			testData		= {
				destationUrl 	: "http://some.random.url",
				routeName		: "MyTestRoute",
				tubeName		: "TestTube"
			};

		var result = joi.validate(testData, instance.schema);

		result.should.have.property("error").equal(null);
		result.value.should.have.property("maxRunTime").equal(30);
		result.value.should.have.property("numClients").equal(1);
		result.value.should.have.property("purgeBuriedAfter").equal(86400);
		result.value.should.have.property("retryAttempts").equal(10);
		result.value.should.have.property("retryDelay").equal(60);
	})
});