var jsArchetype = {
    config : {},
    controllers : [],
    services : [],
    models : [],

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

		var methods = '';
		methods += '        /*\n';
		methods += '        /*\n';
		methods += '        * Constructor method\n';
		methods += '        * @param\n';
		methods += '        * @return\n';
		methods += '        * */\n';
		methods += '        main : function(){\n';
		methods += '            _this.load();\n';
		methods += '        },\n';
		methods += '\n';
		cntrl.methods.forEach(function(mthd) {
			methods += '        /*\n';
			methods += '        /*\n';
			methods += '        * ' + mthd + '\n';
			methods += '        * @param\n';
			methods += '        * @return\n';
			methods += '        * */\n';
			methods += '        ' + mthd + ' : function(){\n';
			methods += '            \n';
			methods += '        },\n';
			methods += '\n';
		});

		controllerData.jsCode += jsArchetype.camelCase(jsArchetype.config.projectName) + '.controller(\'' + name + '\', function(' + includes + ') {\n';
		controllerData.jsCode += '\n';
		controllerData.jsCode += '    var _this = {\n\n';
		controllerData.jsCode += '        /*\n';
		controllerData.jsCode += '        * Example method that will be exposed in the $scope\n';
		controllerData.jsCode += '        * @param\n';
		controllerData.jsCode += '        * @return\n';
		controllerData.jsCode += '        * */\n';
		controllerData.jsCode += '        load : function(){\n';
		controllerData.jsCode += '            console.log(\'The load method was executed ...\');\n';
		controllerData.jsCode += '        }\n';
		controllerData.jsCode += methods + '\n';
		controllerData.jsCode += '    };\n';
		controllerData.jsCode += '\n';
		controllerData.jsCode += '    $scope.load = _this.load.bind(_this)\n';
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
		srvc.includes.forEach(function(incl) {
		    includes += ', ' + incl;
		    namespaces += ', \'' + incl + '\'';
		});

		serviceData.jsCode += jsArchetype.camelCase(jsArchetype.config.projectName) + '.factory(\'' + name + '\', [ ' + namespaces + ', function(' + includes + ') {\n';
		serviceData.jsCode += '\n';

		serviceData.jsCode += '    var ' + name + ' = {};\n';
		serviceData.jsCode += '    var environment = {\n';
		serviceData.jsCode += '        \'mock\' : function(uri) {\n';
		serviceData.jsCode += '            return \'http://demo1936435.mockable.io\' + uri;\n';
		serviceData.jsCode += '        },\n';
		serviceData.jsCode += '        \'prod\' : function(uri) {\n';
		serviceData.jsCode += '            return \'/rest\' + uri;\n';
		serviceData.jsCode += '        }\n';
		serviceData.jsCode += '    };\n';
		serviceData.jsCode += '\n';

		serviceData.jsCode += '    ' + name + '.getByFilter = function(payload, params) {\n';
		serviceData.jsCode += '        return $http.get(environment.prod(\'/example/attribute\'), payload, {\n';
		serviceData.jsCode += '            params : params\n';
		serviceData.jsCode += '        });\n';
		serviceData.jsCode += '    };\n';

		serviceData.jsCode += '\n';
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
	    });
	}
    },

    run : function(config) {
	jsArchetype.config = config;
	try {
	    jsArchetype[config.type].setControllers();
	    jsArchetype[config.type].setServices();
	    jsArchetype[config.type].setModels();
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
