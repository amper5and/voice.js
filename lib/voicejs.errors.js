var GoogleVoiceError = module.exports = function(error, details) {
	this.code = ERRORS[error];
	this.message = error;
	if(details){
		this.details = details;
	}
	this.stack = (new Error()).stack;
};

GoogleVoiceError.prototype = new Error();
GoogleVoiceError.prototype.name = 'GoogleVoiceError';

const ERRORS = GoogleVoiceError.ERRORS = {
	LOGIN_ERROR: 1, // when there is an authorization error involving GoogleClientLogin
	AUTHENTICATION_ERROR: 2, // when there is an authorization error not covered by the above
	INVALID_PARAMETER: 3,
	MISSING_REQUIRED_PARAMETER: 4,
	CANNOT_SET_MULTIPLE_MSGS: 5,
	INVALID_METHOD: 6,
	INVALID_PARAMETER_TYPE: 7,
	INVALID_PARAMETER_VALUE: 8,
	REQUEST_ERROR: 11,
	XML2JS_ERROR: 12,
	GOOGLE_VOICE_ERROR: 20, //when GV responds with an error msg.
	GET_RNR_TOKEN_ERROR: 21,
	GET_GVX_TOKEN_ERROR: 22,
	UNKNOWN_FORMAT: 100, // if Google changes some of their responses, it will break some parsing that we do
	HTTP_ERROR: 200
};
