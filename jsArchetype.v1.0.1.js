var jsArchetype = {
    config : {},
    controllers : [],
    services : [],
    models : [],
    mocks : {},

    camelCase : function(s) {
	return (s || '').toLowerCase().replace(/(\b|-)\w/g, function(m) {
	    return m.toUpperCase().replace(/-/, '');
	}).replace(/\s/gi, '');
    },

    angular : {
	setControllers : function() {
	    jsArchetype.config.controllers.forEach(function(cntrl) {
		var name = jsArchetype.camelCase(cntrl.name) + 'Controller';
		var controllerData = {
		    className : name,
		    jsName : name + '.js',
		    jsCode : '\n'
		};

		var includes = '$scope';
		cntrl.includes.forEach(function(incl) {
		    includes += ', ' + incl;
		});

		var scopePointer = '';
		var methods = '';
		var triggersServiceMethods = '';
		methods += '        /*\n';
		methods += '        * Constructor method\n';
		methods += '        * @param\n';
		methods += '        * @return\n';
		methods += '        * */\n';
		methods += '        main : function(){\n';
		methods += '            _this.load();\n';
		methods += '        },\n';
		
		if(cntrl.methods!= undefined){
			cntrl.methods.forEach(function(mthd) {
				methods += '        /*\n';
				methods += '        * ' + mthd.name + '\n';
				methods += '        * @param\n';
				methods += '        * @return\n';
				methods += '        * */\n';
				methods += '        ' + mthd.name + ' : function(){\n';
				methods += '            \n';
				methods += '        },\n';
				methods += '\n';
				
				if(mthd.scopePointer != undefined){
					scopePointer += '    $scope.' + mthd.scopePointer + ' = _this.' + mthd.name + '.bind(_this);\n';
				}
			});
		}
		
		if(cntrl.methodsForService!= undefined){
			cntrl.methodsForService.forEach(function(mthdfs) {
				methods += '        /*\n';
				methods += '        * ' + mthdfs.name + '\n';
				methods += '        * @param\n';
				methods += '        * @return\n';
				methods += '        * */\n';
				methods += '        ' + mthdfs.name + ' : function(){\n';
				methods += '            $scope.' + mthdfs.variableScope + ' = [];\n';

				var payload = '{}';
				if(mthdfs.payload!= undefined){
					payload = JSON.stringify(mthdfs.payload);
				};
				var params = '{}';
				if(mthdfs.params!= undefined){
					params = JSON.stringify(mthdfs.params);
				};
				
				methods += '            var params = ' + params + ';\n';
				methods += '            var payload = ' + payload + ';\n';
				methods += '            ' + mthdfs.service + '.' + mthdfs.name + '(payload, params).success(function(data) {\n';
				methods += '            	$scope.' + mthdfs.variableScope + ' = new ' + mthdfs.bean + '(data);\n';
				methods += '            }).error(function(e) {\n';
				methods += '            	console.error(e);\n';
				methods += '            });\n';
				methods += '        },\n';
				methods += '\n';
				triggersServiceMethods += '            _this.' + mthdfs.name + '();\n';
			});
		}
		
		methods += '        /*\n';
		methods += '        * Example method that will be exposed in the $scope\n';
		methods += '        * @param\n';
		methods += '        * @return\n';
		methods += '        * */\n';
		methods += '        load : function(){\n';
		methods += triggersServiceMethods;
		methods += '        }\n';
		methods += '\n';
		
		controllerData.jsCode += jsArchetype.camelCase(jsArchetype.config.projectName) + '.controller(\'' + name + '\', function(' + includes + ') {\n';
		controllerData.jsCode += '\n';
		controllerData.jsCode += '    var _this = {\n\n';
		controllerData.jsCode += 	methods + '\n';
		controllerData.jsCode += '    };\n';
		controllerData.jsCode += '\n';
		controllerData.jsCode += scopePointer;
		controllerData.jsCode += '    _this.main();\n';
		controllerData.jsCode += '});\n';

		jsArchetype.controllers.push(controllerData);
	    });
	},

	setServices : function() {
	    jsArchetype.config.services.forEach(function(srvc) {
		var name = jsArchetype.camelCase(srvc.name) + 'Service';
		var serviceData = {
		    className : name,
		    jsName : name + '.js',
		    jsCode : '\n'
		};

		var includes = '$http';
		var namespaces = '\'$http\'';
		var methods = '';
		srvc.includes.forEach(function(incl) {
		    	includes += ', ' + incl;
		    	namespaces += ', \'' + incl + '\'';
		});
		
		if(srvc.methods!= undefined){
			srvc.methods.forEach(function(mthd) {
				methods += '    ' + name + '.' + mthd.name + ' = function(payload, params) {\n';
				
				
				var comment = '';
				if(mthd.mockToModel!= undefined){
					comment = '//';
					methods += '\n';
					methods += '        /* Visit the component page https://github.com/miamarti/ng.httpFake\n';
					methods += '         * Install using the bower command:\n';
					methods += '         * > $ bower install ng.httpFake --save\n';
					methods += '         */\n';
					methods += '        return new $httpFake(' + JSON.stringify(jsArchetype.mocks[mthd.mockToModel]) + ', false);\n';
					methods += '\n';
				}
				methods += '       ' + comment + ' return $http.' + mthd.type + '(environment.prod(\'' + mthd.uri + '\'), payload, {\n';
				methods += '       ' + comment + '     params : params\n';
				methods += '       ' + comment + ' });\n';
				
				methods += '    };\n';
			});
		}

		serviceData.jsCode += jsArchetype.camelCase(jsArchetype.config.projectName) + '.factory(\'' + name + '\', [ ' + namespaces + ', function(' + includes + ') {\n';
		serviceData.jsCode += '\n';

		serviceData.jsCode += '    var ' + name + ' = {};\n';
		serviceData.jsCode += '    var environment = {\n';
		serviceData.jsCode += '        \'mock\' : function(uri) {\n';
		serviceData.jsCode += '            return \'' + srvc.mockUrl + '\' + uri;\n';
		serviceData.jsCode += '        },\n';
		serviceData.jsCode += '        \'prod\' : function(uri) {\n';
		serviceData.jsCode += '            return \'' + srvc.prodUrl + '\' + uri;\n';
		serviceData.jsCode += '        }\n';
		serviceData.jsCode += '    };\n';
		serviceData.jsCode += '\n';
		serviceData.jsCode += methods + '\n';
		serviceData.jsCode += '    return ' + name + ';\n';
		serviceData.jsCode += '} ]);\n';

		jsArchetype.services.push(serviceData);
	    });
	},

	setModels : function() {
	    var jsGeneratorBean = function(config) {
		var declarationVariables = '';
		var constructor = '';
		var proto = '';

		for (key in config.signature) {
		    constructor += '        	    bean.set' + key.replace((key.substring(0, 1)), (key.substring(0, 1)).toUpperCase()) + '(data[0].' + key + ');\n';
		    declarationVariables += '        	this.' + key + ';\n';

		    proto += '\n\n';
		    proto += '        	 /*\n';
		    proto += '        	 * ' + key + '\n';
		    proto += '        	 */\n';
		    proto += '        	 set' + key.replace((key.substring(0, 1)), (key.substring(0, 1)).toUpperCase()) + ' : function(value) {\n';
		    proto += '        	 	    this.' + key + ' = value;\n';
		    proto += '        	 },\n';
		    proto += '        	 get' + key.replace((key.substring(0, 1)), (key.substring(0, 1)).toUpperCase()) + ' : function() {\n';
		    proto += '        	 	    return this.' + key + ';\n';
		    proto += '        	 },';
		}

		proto = proto.substring(0, (proto.length - 1));

		var bean = '';
		bean += '\n';
		bean += '\n    /*\n';
		bean += '    * Class ' + config.name + '\n';
		bean += '    */\n';
		bean += '    var ' + config.name + ' = function() {\n\n';

		bean += '        	/*\n';
		bean += '        	 * Constructor\n';
		bean += '        	 */\n';

		bean += '        	(arguments.length > 0) ? (function(data, bean) {\n';
		bean += constructor;
		bean += '        	})(arguments, this) : \'\';\n\n';

		bean += '        	/*\n';
		bean += '        	 * Declaration of variables\n';
		bean += '        	 */\n';
		bean += declarationVariables;

		bean += '\n';
		bean += '    };\n\n';

		bean += '    /*\n';
		bean += '    * POJO Bean\n';
		bean += '    */\n';

		bean += '    ' + config.name + '.prototype = {';
		bean += proto;
		bean += '\n    };';
		bean += '\n\n\n';

		if (config.angular) {
		    bean = config.appName + '.factory(\'' + config.name + '\', [ function() {' + bean + '    return ' + config.name + ';\n\n' + '} ]);';
		}
		
		return bean;
	    };

	    jsArchetype.config.models.forEach(function(mdl) {
		var name = jsArchetype.camelCase(mdl.name);
		var modelData = {
		    className : name,
		    jsName : name + '.js',
		    jsCode : '\n'
		};

		modelData.jsCode = jsGeneratorBean({
		    name : name,
		    angular : true,
		    appName : jsArchetype.camelCase(jsArchetype.config.projectName),
		    signature : mdl.signature
		});
		jsArchetype.models.push(modelData);
		jsArchetype.mocks[name] = mdl.signature;
	    });
	}
    },

    run : function(config) {
	jsArchetype.config = config;
	try {
	    jsArchetype[config.type].setControllers();
	    jsArchetype[config.type].setModels();
	    jsArchetype[config.type].setServices();
	} catch (e) {
	    console.error('Please enter a type!!!');
	}
	return {
	    controllers : jsArchetype.controllers,
	    services : jsArchetype.services,
	    models : jsArchetype.models
	};
    }
};
