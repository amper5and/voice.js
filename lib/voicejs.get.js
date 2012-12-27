var DEFAULTS = require('./voicejs.defaults.js');
var GoogleVoiceError = require('./voicejs.errors.js');

module.exports = {};
DEFAULTS.labels.forEach(function(label){
	module.exports[label] = {
		description: 'Get '+label+' conversations, optionally specifying the starting messages and how many messages to retrieve',
		token: 'gvx',
		options: {
			v: { fixed: true, default: '10'},
			m: { fixed: true, default: 'list'},
			l: { fixed: true, default: label},
            start: { demand: false, type: [Number], name: 'o', default: 1, handler: function(start){
    			return start-1 >= 0 ? { o: start-1}: new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'start', value: start, expected: 'NUMBER GREATER THAN ZERO'});
			}},
			limit: { demand: false, type: [Number], name: 'lm', default: 20, handler: function(limit){
				return limit > 0 ? {lm: limit === Infinity ? 0 : limit} : new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'limit', value: limit, expected: 'NUMBER GREATER THAN ZERO'});
			}}
		}
	};	
});

module.exports.audio = {
	description: 'Retrieve the mp3 or ogg audio of a voicemail or recorded call',
	method: 'GET',
	encoding: null,
	options: {
		id: {submit: false, demand: true, type:[String]},
		format: {submit: false, demand: true, type:[String], match: ['mp3', 'ogg']}
	},
	path: function(options){
		return '/media/send_voicemail' + (options.type === 'ogg' ? '_ogg/' : '/') + options.id
	}
};

module.exports.byId = {
    description: 'Get conversation(s) by id',
	token: 'gvx',
	options: {
		v: { fixed: true, default: '10'},
		m: { fixed: true, default: 'con'},
		id: {demand: true, type:[String,Array], handler: function(ids){ //make sure to get only unique values out of id arrays
			return {id:Array.isArray(ids) ? ids.filter(function(a,b,c){return b==c.indexOf(a)}).join(',') : ids }
		}}
	}
};