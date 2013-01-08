var DEFAULTS = require('./voicejs.defaults.js');
var GoogleVoiceError = require('./voicejs.errors.js');

module.exports = {
	altsms: {
		description: 'Alternative way to send SMS messages, without returning new conversation id. Allows sending to multiple recipients simultaneously',
		path: '/sms/send/',
		token: 'rnr',
		options: {
			id: {fixed: true, default: ''},
			to: {demand: true, type:[String, Array], handler: function(to){
				return {phoneNumber: Array.isArray(to) ? to.join(',') : to };
			}},
			text: {type: [String], default: ''}
		}
	},
	sms: {
		description: 'Send SMS messages',
		token: 'gvx',
		options: {
			m: { fixed: true, default: 'sms'},
			to: { demand: true, type:[String], name: 'n'},
			text: { demand: false, type: [String], name: 'txt', default: ' '}
		}
	},
	call: {
		description: 'Retrieve a dial-out number that can be used to make a call to the outgoing number',
		token: 'gvx',
		options: {
			m: {fixed: true, default: 'call'},
			to: {demand: true, type: [String], name: 'n'},
			from: { demand: true, type: [String], name: 'f'}
		}
	},
	connect:{
		description: 'Connect the outgoing number to one of your GV numbers',
		path: '/call/connect',
		token: 'rnr',
		options: {
			to: { demand: true, type: [String], name: 'outgoingNumber'},
			from: { demand: true, type: [String], name: 'forwardingNumber'},
			fromType: {
				demand: false, 
				type: [String], 
				match: Object.keys(DEFAULTS.phoneTypes),
				default: function(options){
					if(!!~options.from.indexOf('@')){
						return 'googletalk';
					}else{
						return 'work'; // this seems to work as a default
					}
				},
				handler: function(type){
					return { phoneType: DEFAULTS.phoneTypes[type]};
				}
			}
		}
	},
	cancel: {
		description: 'Cancel an outgoing call',
		path: '/call/cancel/',
		token: 'rnr',
		options: {
			outgoingNumber: { fixed:true, default: ''},
			forwardingNumber: { fixed:true, default: ''},
			type: {fixed: true, type:[String], name: 'cancelType',  match:['C2C', 'RECORDING'], default: 'C2C'}
		}
	}
};