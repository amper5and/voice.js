// These are the various methods that can be used with Client.name() get/set recorded name
var DEFAULTS = require('./voicejs.defaults.js');
var GoogleVoiceError = require('./voicejs.errors.js');

module.exports = {
	get: {
		description: 'Retrieve the mp3 of your recorded name that is played to callers',
		path: '/media/sendRecordedName/',
		method: 'GET',
		encoding: null
	},
	record: {
		description: 'Receive a callback to record the name that is played to callers',
		path: '/call/recordName/',
		token: 'rnr',
		options: {
			number: { demand: true, type: [String], name: 'forwardingNumber'},
			type: { demand: true, type: [String], match: Object.keys(DEFAULTS.phoneTypes), handler: function(type){
				return { phoneType: DEFAULTS.phoneTypes[type]};
			}},
			outgoingNumber: { fixed: true, default: ''},
			subscriberNumber: { fixed: true, default: 'undefined'},
			remember: { fixed: true, default: '0'},
			
		}
	},
	cancel: {
		description: 'Cancel the callback to record a new name',
		path: '/call/cancel/',
		token: 'rnr',
		options: {
			outgoingNumber: { fixed:true, default: ''},
			forwardingNumber: { fixed:true, default: ''},
			type: {fixed: true, default: 'RECORDING'}
		}
	}
};

