var joi		= require("joi"),
	should 	= require("should");

describe("loadRouteConfig loads the routes JSON object", function(){
	it("should return a new instance", function(){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.should.be.instanceOf(loadRouteConfig);
	}),
	it("loadFile should return a promise that returns a JSON object based on relative path and file name", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.loadFile("test/mock", "routeConfigMock.json")
			.then(function(obj){
				obj.should.have.property("foo").equal("bar");
				obj.should.have.property("test").true;
				done();
			})
			.catch(done);
	}),
	it("loadFile should return a promise that returns a JSON object based on relative path and file name combines", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.loadFile("test/mock/routeConfigMock.json")
			.then(function(obj){
				obj.should.have.property("foo").equal("bar");
				obj.should.have.property("test").true;
				done();
			})
			.catch(done);
	}),
	it("loadFile should return an error if the file is not found", function(done){
		var loadRouteConfig = require("../../lib/loadRouteConfig"),
			instance		= new loadRouteConfig();

		instance.loadFile("test/mock/routeConfigMock-NotExist.json")
			.then(function(){
				done("We shouldn't be here");
			})
			.catch(function(e){
				e.should.be.instanceOf(Error);
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
	})
});