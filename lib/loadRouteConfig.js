var bluebird 	= require("bluebird"),
	fs			= require("fs"),
	joi 		= require("joi"),
	path		= require("path");

var loadConfig = function(){
	this.schema = {};
	bluebird.promisifyAll(joi);
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

		fs.readFile(path.resolve(fullPathToFile), 'utf8',	 function(err, data){
			if(err){
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

module.exports = loadConfig;