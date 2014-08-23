var EE = require('events').EventEmitter,
    querystring = require('querystring'),
    clientlogin = require('googleclientlogin'),
    request = require('request'),
    xml2js = require('xml2js');
	
clientlogin.GoogleClientLogin.prototype.loginWithCallback = function(callback){
	var self = this;
	callback = callback || noop;

	var fullCallback = function(err){
		callback(err, self.getAuthId());
	};
	this.once('login', fullCallback);
	this.once('error', fullCallback);
	this.login();
};

function noop(){};

var GoogleVoiceError = require('./lib/voicejs.errors.js');
exports.ERRORS = GoogleVoiceError.ERRORS;

var DEFAULTS = exports.DEFAULTS = require('./lib/voicejs.defaults.js');

var methods = exports.METHODS = {};
DEFAULTS.methods.forEach(function(name){
	methods[name] = require('./lib/voicejs.' + name + '.js');
});


exports.Client = function(options){
	this.config = {
		email: options.email,
		password: options.password
	};
	
	this._clientlogin = new clientlogin.GoogleClientLogin({
		email: options.email,
		password: options.password,
		service:'voice'
	});
	

	var tokens = {}; // protected variable
	
	if(options.tokens){ // populate tokens
		for(var name in options.tokens){
			if(!!~DEFAULTS.tokenTypes.indexOf(name)){
				tokens[name] = options.tokens[name]
			}
		}
	}
	
	this.getTokens = function(name){
		if(name){
			return tokens[name];
		}

		var toks = {};
		for(var name in tokens){
			toks[name] = tokens[name]
		}
		return toks;
	};
	
	this._setToken = function(name, value){
		if(!!~DEFAULTS.tokenTypes.indexOf(name)){
			tokens[name] = value;
			return true;
		}else{
			return false;
		}
	};
};

exports.Client.prototype = Object.create(EE.prototype);

exports.Client.prototype.auth = function(callback){
	var self = this;
	callback = callback || noop;
	
	if(this._processing_auth){ // if a login is already in progress, wait for it to finish
		self.once('_processed_auth', callback);
		return;
	}
	
	this._processing_auth = true;
	this._clientlogin.loginWithCallback(function(err, authToken){
		self._processing_auth = false;
		if(err){
			err = new GoogleVoiceError('LOGIN_ERROR', err);
		}else if(authToken !== self.getTokens('auth')){
			self._setToken('auth', authToken)
			self.emit('auth', authToken);
		}
		self.emit('_processed_auth', err, authToken);
		callback(err, authToken);
	});
};

exports.Client.prototype._checkTokenStatus = function(token, callback){
	var self = this;
	if(self['_processing_' + token] || !self.getTokens()[token]){
		self.once('_processed_'+token, callback);
		if(!self.getTokens()[token]){
			self[token].call(self);
		}
		return true;
	}else {
		return false
	}
};

exports.Client.prototype.rnr = function(callback, isRepeat){
	var self = this;
	callback = callback || noop;
	
	if(this._processing_rnr){ // if a getRNR is already in progress, wait for it to finish
		self.once('_processed_rnr', callback);
		return;
	}
	
	this._processing_rnr = true;
	
	if(self._checkTokenStatus('auth', function(err){// check if we have an auth token OR if a login is in process
		if(err){
			return callback(err);
		}
		self._processing_rnr = false;
		self.rnr(callback);
	})){ return; }; // wait for auth token retrieval, as this will not work without it
	
	
	request({
		uri: 'https://www.google.com/voice/request/unread', // this url contains unread counts as well as the rnr token
		followRedirect: false,
		headers: {
			Authorization: 'GoogleLogin auth=' + this.getTokens().auth // Google ClientLogin authentication
		}
	}, function(err, res, body){		
		self._processing_rnr = false;
		body = self._toJSON(body);
		if(err){
			var e = new GoogleVoiceError('REQUEST_ERROR', {error: err, caller: 'getRNR', res: res, body: body});
			self.emit('_processed_rnr', e);
			return callback(e, null, res, body)
		}
		if(res.statusCode != 200 && !isRepeat){ // Could be a login issue; if this getRNR request is NOT a retry, then try to login
			return self.auth(function(err){
				if(err){
					var e = new GoogleVoiceError('GET_RNR_TOKEN_ERROR', {res: res, body: body, afterLogin: true});
					self.emit('_processed_rnr', e);
					return callback(e);
				}
				self.rnr(callback, true); // retry
			});
		}
	 	if(body && body.hasOwnProperty('r')){
	 		if(self.getTokens().rnr != body.r ){ // new rnr has been issued, set tokens and emit appropriate events
				self._setToken('rnr', body.r)
				self.emit('rnr', body.r);
			}
			self.emit('_processed_rnr',null, body.r);
			callback(null, body.r, res, body);
		}else{ // failed for some reason: could be because the returned body has been changed by Google
			var e = new GoogleVoiceError('UNKNOWN_FORMAT', {res: res, body: body});
			self.emit('_processed_rnr',e);
			callback(e, null, res, body);
		}
	});
};


var getCookie = function(jar, name){ // needs jar.cookies as Array
	var cookies=jar.getCookies(DEFAULTS.baseUrl);
	return cookies.filter(function(cookie){
		return cookie.key === name;
	})[0] || {};
};

exports.Client.prototype.gvx = function(callback, isRepeat){
	var self = this;
	callback = callback || noop;
	
	
	if(this._processing_gvx){ // if a getGVX is already in progress, wait for it to finish
		self.once('_processed_gvx', callback);
		return;
	}
	
	this._processing_gvx = true;
	
	if(self._checkTokenStatus('auth', function(err){// check if we have an auth token OR if a login is in process
		if(err){
			return callback(err)
		}
		self._processing_gvx = false;
		self.gvx(callback);
	})){ return; } // wait for auth token retrieval, as getGVX will fail without it
	
	var jar = request.jar(); // the cookie jar
	request({
		uri: 'https://www.google.com/voice/m?initialauth&pli=1',
		followRedirect: false,
		jar: jar,
		headers: { 
			'User-Agent': DEFAULTS.mobileHeader,
			Authorization: 'GoogleLogin auth=' + this.getTokens().auth // Google ClientLogin authentication
		}
	},function(err, res, body){
		self._processing_gvx = false;		
		if(err){			
			var e = new GoogleVoiceError('REQUEST_ERROR', {error: err, caller: 'getGVX', res: res, body: body});
			self.emit('_processed_gvx', e);
			return callback(e, null, res, body);
		}
		
		if(res.statusCode != 200 && res.statusCode != 302 && !isRepeat){ // Could be a login issue, try to login if this getGVX is NOT a retry
			return self.auth(function(err){
				if(err){
					var e = new GoogleVoiceError('GET_GVX_TOKEN_ERROR', {res: res, body: body, afterLogin: true});
					self.emit('_processed_gvx',e);
					return callback(e);
				}				
				self.gvx(callback, true);
			});
		}
		var tokens = {
			gvx: getCookie(jar, 'gvx').value,
		};
		if(tokens && tokens.gvx){
			if(tokens.gvx !== self.getTokens('gvx')){
				self._setToken('gvx', tokens.gvx);
				self.emit('gvx', tokens.gvx, tokens.auth);
			}
			self.emit('_processed_gvx',null, tokens.gvx);
			return callback(null, tokens.gvx, res, body);
		}else{
			var e = new GoogleVoiceError('UNKNOWN_FORMAT', {res: res, body: body});
			self.emit('_processed_gvx',e);
			return callback(e);
		}
	});
};

exports.Client.prototype._request = function(options, callback, neededToken){
	var self = this;
	if(self._checkTokenStatus('auth', function(err){// check if we have an auth token OR if a login is in process
		if(err){
			return callback(err);
		}
		self._request(options, callback, neededToken);
	})){ return; } // wait for auth token retrieval
	
	if(neededToken && self._checkTokenStatus(neededToken, function(err){// check if we have the necessary token OR if one is being retrieved
		if(err){
			return callback(err);
		}
		self._request(options, callback, neededToken);
	})){ return; } // wait for the token
	
	var requestOptions = {
		uri: options.uri || DEFAULTS.baseUrl,
		method: options.method || options.form ? 'POST' : 'GET',
		followRedirect: false,
		headers: {
			Authorization: 'GoogleLogin auth=' + self.getTokens().auth
		}
	};
	
	if(neededToken && neededToken === 'gvx'){
		requestOptions.uri += '/m/x';
		requestOptions.method = 'POST';
		requestOptions.json = { gvx: this.getTokens().gvx};
		requestOptions.headers['User-Agent'] = DEFAULTS.mobileHeader;
		requestOptions.headers.cookie = 'gv=' + this.getTokens().auth+';gvx='+this.getTokens().gvx;
	}else if(neededToken && neededToken === 'rnr'){
		if(options.path){
			requestOptions.uri += options.path;
		}
		requestOptions.method = 'POST';
		requestOptions.form = options.form || {}; // add form if not already there
		requestOptions.form['_rnr_se'] = self.getTokens().rnr;
	}else{
		if(options.path){
			requestOptions.uri += options.path;
		}
		if(options.form){
			requestOptions.form = options.form;
		}
	}
	
	if(options.query){
		requestOptions.uri += '?' + querystring.stringify(options.query);
	}

	if(options.hasOwnProperty('encoding')){
		requestOptions.encoding = options.encoding;
	}
	
	request(requestOptions, function(err, res, body){
		self._processResponse(options, callback, neededToken, err, res, body);
	});
};

exports.Client.prototype._toJSON = function(body){
	// try to make JSON out of everything
	try{
		body = JSON.parse(body);
	}catch(e){
		try{
			body = JSON.parse(body.substr(5)); // sometimes the first 5 characters are junk that screws up the JSON. Come on, GOOGLE!
		}catch(e){}
	}
	return body;
};

exports.Client.prototype._processResponse = function(options, callback, neededToken, err, res, body){
	var self = this;
	
	if(err){
		var e = new GoogleVoiceError('REQUEST_ERROR', {error: err, caller: '_processResponse', res: res, body: body});
		callback(e)
		return;
	}else if(res.statusCode == 400 || res.statusCode === 401 || res.statusCode === 403){ // Possible authentication issue		
		if(!options.renewedLogin){
			options.renewedLogin = true;
			self.once('_processed_auth', function(err){
				if(err){
					return callback(err)
				}
				self._request(options, callback, neededToken); // repeat the request after login is finished and successful
			});
			if(!self._processing_auth){				
				self.auth();
			}
		}else{ // may need new rnr or gvx token	
			tryRenewToken('AUTHENTICATION_ERROR')
		}
	}else if(res.statusCode != 200){ //could be an rnr or gvx issue, so we'll try to renew those first
		if(res.statusCode === 500){ //unlikely to be an rnr or gvx issue
			return callback(new GoogleVoiceError('HTTP_ERROR', {res: res, body: body}));
		}
        tryRenewToken('HTTP_ERROR');
	}else{ // good response	
		if(res && res.headers && res.headers['content-type'] && !!~res.headers['content-type'].indexOf('xml')){ // if xml
			return new xml2js.Parser().parseString(body, function(err, xml){
				if(err){
					return callback(new GoogleVoiceError('XML2JS_ERROR', err), res, body);
				}else if(!xml || !xml.response || !xml.response.json){
					return callback(new GoogleVoiceError('UNKNOWN_FORMAT', "COULDN'T EXTRACT JSON FROM XML RESPONSE"), res, body);
				}else{
					try{
						body = JSON.parse(xml.response.json);
						var error = null;
					}catch(e){
						var error = new GoogleVoiceError('UNKNOWN_FORMAT', "COULDN'T PARSE JSON FROM XML RESPONSE");
					}
					return callback(error, res, body)
				}
			});
		}else{
			body = self._toJSON(body);
		}
		
		if(body && body.hasOwnProperty('rnr_xsrf_token') && self.getTokens().rnr != body.rnr_xsrf_token ){ // new rnr has been issued
			self._setToken('rnr', body.rnr_xsrf_token)
			self.emit('rnr', body.rnr_xsrf_token);
		}
		if(body && body.account_status){
			self.emit('status', body.account_status)
		}
		if(body && body.hasOwnProperty && body.hasOwnProperty('ok') && !body.ok){
			return callback(new GoogleVoiceError('GOOGLE_VOICE_ERROR', body), res, body);
		}else{
			DEFAULTS.responseTypes.forEach(function(type){
				if(body && body[type] && body[type].status && body[type].status.status){
					return callback(new GoogleVoiceError('GOOGLE_VOICE_ERROR', body[type].status), res, body);
				}
			});
			callback(null, res, body);
		}	
	}
	
	function tryRenewToken(error){
		if(!neededToken || options.renewedToken){ // Didn't need a token or Already tried renewing the tokens,so some other issue is the problem.
			var e = new GoogleVoiceError(error, {res: res, body: body});
			return callback(e);
        }
		// try renewing the appropriate token
		options.renewedToken = true;
		self[neededToken](function(err){			
			if(err){
				return callback(err);
			}
			self._request(options, callback, neededToken);
		});
	}
};

exports.Client.prototype._exec = function(methods, command, options, callback){
	if(!command || !methods[command]){ 
		return callback(new GoogleVoiceError('INVALID_METHOD', {method: command, expected: Object.keys(methods)})); 
	}
	
	if(typeof options === 'function'){
		callback = options;
	}
	callback = callback || noop;
	options = options || {};
	
	var method = methods[command];
	
	if(typeof method === 'function'){ //hand it off to the custom handler
		return method.call(this, options, callback);
	}
	
	// set fixed parameters, check for missing parameters
	for(var name in method.options){
		if(method.options[name].fixed){
			options[name] = method.options[name].default;
		}else if( (!options.hasOwnProperty(name) || options[name] === null) && method.options[name].demand){
			return callback(new GoogleVoiceError('MISSING_REQUIRED_PARAMETER', { parameter: name } )) ;
		}
	}
	
	
	var parameters = {}; // the parameters that will be submitted
	
	for(var name in method.options){
		if(!options.hasOwnProperty(name) || options[name] === null){
			if(method.options[name].hasOwnProperty('default')){
				if(typeof method.options[name].default === 'function'){
					var value = method.options[name].default.call(method, options);
				}else{
					var value = method.options[name].default;
				}
				
				if(typeof value === 'undefined' || value === null){
    				continue;
				}else{
					options[name] = value;
				}
			}else{
				continue; // must be a non-required missing parameter without a default value
			}
		}
		// check types of passed parameters
		if(method.options[name].type){
			var requiredTypes = method.options[name].type.map(function(type){return type.name});
			var passedType = options[name].constructor.name;
			if( !~requiredTypes.indexOf(passedType) ){// passed type doesn't match one of the required types
				return callback(new GoogleVoiceError('INVALID_PARAMETER_TYPE', {parameter: name, type: passedType, expected: requiredTypes, value: options[name]}));
			}
		}
		
		// check if passed options matches a list of possible matches
		if(method.options[name].match && !~method.options[name].match.indexOf(options[name])){
			return callback(new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter:name, value: options[name], expected:method.options[name].match}));
		}
		
		// finally, set the parameter name and value for parameters that will be sumitted
		if(method.options[name].hasOwnProperty('submit') && method.options[name].submit === false){
			continue; // this is a parameter that wil not be part of the form or the query
		}else if(method.options[name].handler){
			var newOptions = method.options[name].handler.call(method, options[name], options, parameters);
			if(newOptions && newOptions.name === 'GoogleVoiceError'){ // the returned object is a GoogleVoiceError
				return callback(newOptions);
			}else if(newOptions){
				for(var variable in newOptions){ // add in the new options
					parameters[variable] = newOptions[variable];
				}
			}
		}else if(method.options[name].name){
			parameters[method.options[name].name] = options[name];
		}else{
			parameters[name] = options[name];
		}
	}
	
	for(var name in parameters){
		if(typeof parameters[name] === 'boolean'){ // map Booleans to 1 and 0
			parameters[name] = parameters[name] ? 1 : 0;
		}
	}
	
	var neededToken = method.token;
	var requestOptions = {};
	
	if(method.path){
		if(typeof method.path === 'function'){
			requestOptions.path = method.path.call(this, options);
		}else{
			requestOptions.path = method.path;
		}
	}
	if(method.uri){
		requestOptions.uri = method.uri;
	}
	if(method.hasOwnProperty('encoding')){
		requestOptions.encoding = method.encoding;
	}	
	if(Object.keys(parameters).length){
		if(method.method === 'POST' || neededToken && neededToken === 'rnr'){
			requestOptions.form = parameters;
		}else{
			requestOptions.query = parameters;
		}
	}
	this._request(requestOptions, callback, neededToken);
};



function createMethod(name){
	return function(command, options, callback){
		return this._exec(methods[name], command, options, callback);
	};
}

for(var name in methods){
	exports.Client.prototype[name] = createMethod(name);	
}

// convenience methods
exports.Client.prototype.sms = function(options, callback){
	return this._exec(methods.comm, 'sms', options, callback);
};

exports.Client.prototype.altsms = function(options, callback){
	return this._exec(methods.comm, 'altsms', options, callback);
};

exports.Client.prototype.connect = function(options, callback){
	return this._exec(methods.comm, 'connect', options, callback);
};

exports.Client.prototype.call = function(options, callback){
	return this._exec(methods.comm, 'call', options, callback);
};

exports.Client.prototype.cancel = function(options, callback){
	return this._exec(methods.comm, 'cancel', options, callback);
};

exports.Client.prototype.forward = function(options, callback){
    return this._exec(methods.set, 'forward', options, callback);
};

exports.Client.prototype.getAudio = function(options, callback){
	return this._exec(methods.get, 'audio', options, callback);
};

exports.Client.prototype.getCounts = function(callback){
	callback = callback || noop;
	
	this._request({
		query: {
			m:'list', 
			l: 'inbox', 
			o: 0, 
			v: 10
		}
	}, function(error, response, data){
		if(error){
			return callback(error, null, response, data);
		}
		if(data && data.labels_response && data.labels_response.label){
			callback(null, data.labels_response.label, response, data)
		}else{
			callback(new GoogleVoiceError('UNKNOWN_FORMAT'), null, response, data); 
		}
	}, 'gvx');
};
