var bluebird 	= require("bluebird"),
	bristol		= require("bristol"),
	fs			= require("fs"),
	joi 		= require("joi"),
	path		= require("path");

var loadConfig = function(){
	bluebird.promisifyAll(joi);

	this.schema = joi.object().keys({
		destationUrl	: joi.string().required(),
		expressRoute	: joi.string().alphanum(),
		maxRunTime		: joi.number().integer().min(1).default(30),
		numClients		: joi.number().integer().min(1).default(1),
		purgeBuriedAfter: joi.number().integer().min(1).default(86400),
		retryAttempts	: joi.number().integer().min(1).default(10),
		retryDelay		: joi.number().integer().min(1).default(60),
		routeName		: joi.string().alphanum().required(),
		tubeName		: joi.string().alphanum().min(3).required()
	});
};

loadConfig.prototype.loadFile = function(filePath, fileName){
	//filePath is relative path to the file from application root
	return new bluebird(function(resolve, reject){
		var fullPathToFile = "";
		if(fileName){
			fullPathToFile = path.join(filePath, fileName);
		} else {
			fullPathToFile = path.normalize(filePath);
		}

		bristol.info("Reading in Router Config from file: " + path.resolve(fullPathToFile));

		fs.readFile(path.resolve(fullPathToFile), 'utf8',	 function(err, data){
			if(err){
				bristol.warn("Unable to load Router Config file", err);
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
};

loadConfig.prototype.validateRoutes = function(routes){
	//Iterate over the routes object and run this.schema over it
	var propMap = {};

	for(var prop in routes){
		if(routes.hasOwnProperty(prop)){
			propMap[prop] = joi.validateAsync(routes[prop], this.schema);
		}
	}

	return bluebird.props(propMap);
};

loadConfig.prototype.loadRouteConfig = function(filePath, fileName){
	bristol.info("Beginning load route config");

	return this.loadFile(filePath, fileName)
		.then(function(routes){
			return this.validateRoutes(routes);
		});
};

module.exports = loadConfig;