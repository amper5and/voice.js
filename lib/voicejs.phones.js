// These are the various methods that can be used with Client.phones() to edit forwarding phones

var util = require('util');
var DEFAULTS = require('./voicejs.defaults.js');
var GoogleVoiceError = require('./voicejs.errors.js');

var timeregex = /^(10|11|12|0?[1-9]):[0-5][0-9](am|pm)$/; //12-hour format: (#)#:##am|pm

var blockHandler = function(when){//when === 'wd' (weekday) or 'we' (weekend)
	return function(options){
		var params = {};
		if(util.isArray(options) && options.length){ // block specific times
			for(var i=0; i<options.length; i++){
				if(!options[i].from || typeof options[i].from != 'string'){
					return new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'from', value: options[i].from, expected: '12-HOUR TIME STRING IN FORMAT (#)#:##am|pm'});
				}else{
					var match = options[i].from.match(timeregex);
					if(!match){
						return new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'from', value: options[i].from, expected: '12-HOUR TIME STRING IN FORMAT (#)#:##am|pm'});
					}else{
						params['fromTime'+when+i] = match[0];
					}
				}
				if(!options[i].to || typeof options[i].to != 'string'){
					return new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'to', value: options[i].to, expected: '12-HOUR TIME STRING IN FORMAT (#)#:##am|pm'});
				}else{
					var match = options[i].to.match(timeregex);
					if(!match){
						return new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'to', value: options[i].to, expected: '12-HOUR TIME STRING IN FORMAT (#)#:##am|pm'});
					}else{
						params['toTime'+when+i] = match[0];
					}
				}
				params['ring'+when] = '2';
			}
		}else if(typeof options === 'boolean'){ // block the whole weekend
			params['ring'+when] = options ? '1' : '0';
		}
		return params;
	};
};

module.exports = {
	enable: {
		description: 'Enable a forwarding phone',
		path: '/settings/editDefaultForwarding/',
		token: 'rnr',
		options: {
			id: { demand: true, type: [Number], name: 'phoneId' },
			enabled: { fixed: true, default: '1'}
		}
	},
	disable: {
		description: 'Disable a forwarding phone',
		path: '/settings/editDefaultForwarding/',
		token: 'rnr',
		options: { 
			id: { demand: true, type: [Number], name: 'phoneId' },
			enabled: {fixed: true, default: '0'}
		}
	},
	enableSMS: {
		description: 'Enable sms forwarding to a forwarding phone',
		path: '/settings/editForwardingSms/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [Number], name: 'phoneId'},
			enabled: { fixed: true, default: '1'}
		}
	},
	disableSMS: {
		description: 'Disable sms forwarding to a forwarding phone',
		path: '/settings/editForwardingSms/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [Number], name: 'phoneId'},
			enabled: { fixed: true, default: '0'}
		}
	},
	enableVoicemailNotifyBySMS: {
		description: 'Notify a forwarding number of new voicemails via text',
		path: '/settings/editVoicemailSms/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [Number], name: 'phoneId'},
			enabled: { fixed: true, default: '1'}
		}
	},
	disableVoicemailNotifyBySMS: {
		description: 'Do not notify a forwarding number of new voicemails via text',
		path: '/settings/editVoicemailSms/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [Number], name: 'phoneId'},
			enabled: { fixed: true, default: '1'}
		}
	},
	get: {
		description: 'Retrieve GV settings, forwarding phones, groups, and greetings',
		path: '/settings/tab/settings',
		method: 'GET'
	},
	delete: {
		description: 'Delete a forwarding phone by phone id',
		path: '/settings/deleteForwarding/',
		token: 'rnr',
		options: { 
			id: { demand: true, type:[Number], name: 'id' }
		}
	},
	new: {
		description: 'Create new forwarding phone by number and type, optionally specifying other settings. The phone will not be added unless dryRun=false.',
		path: '/settings/editForwarding/',
		token: 'rnr',
		options: {
			number: { demand: true, type: [String], name: 'phoneNumber' },
			type: { demand: true, type: [String], match: Object.keys(DEFAULTS.phoneTypes), handler: function(type){
				return { type:  DEFAULTS.phoneTypes[type] };
			}},
			name: { demand: false, type: [String], name: 'name', default: function(options){
				return options.number;
			}},
			smsEnabled: { demand: false, type: [Boolean] },
			redirectToVoicemail: { demand: false, type: [Boolean] }, // What happens when someone calls the forwarding phone directly without answer: true=go directly to voicemail, false=ring other GV forwarding phones first. This option only works with forwarding phones that use GV for voicemail (see 'enableVoicemail' below)
			blockWeekday: { demand: false, type: [Array, Boolean], handler: blockHandler('wd')},
			blockWeekend: { demand: false, type: [Array, Boolean], handler: blockHandler('we')},
			onDialIn: { demand: false, type: [String], match: ['ring','toVoicemailWithPin', 'toVoicemailWithoutPin'], handler: function(type){
				var policies = {
					ring: 0,
					toVoicemailWithPin: 1,
					toVoicemailWithoutPin: 3
				};
				return {
					policyBitmask: policies[type]
				};
			}},
			dryRun: { demand: false, type: [Boolean], name: 'dryRun', default: true } // true=test the outcome of these settings without committing them, false=commit the settings if they are commitable
		},
	},
	edit: {
		description: 'Edit forwarding phone settings by phone id. The changes will not be finalized unless dryRun=false.',
		path: '/settings/editForwarding/',
		token: 'rnr',
		options: {
			/*
			If onDialIn, smsEnabled, redirectToVoicemail, blockWeekday, blockWeekend are not specified, then GV resets them to default values, 
			i.e. false for all of them and 'ring' for onDialIn
			*/
			id: { demand: true, type: [Number], name: 'id'},
			number: { demand: true, type: [String], name: 'phoneNumber' },
			type: { demand: true, type: [String], match: Object.keys(DEFAULTS.phoneTypes), handler: function(type){
				return { type:  DEFAULTS.phoneTypes[type] };
			}},
			name: { demand: false, type: [String], name: 'name', default: function(options){
				return options.number;
			}},
			smsEnabled: { demand: false, type: [Boolean] },
			redirectToVoicemail: { demand: false, type: [Boolean] }, // true=go direct to voicemail, false=ring other GV forwarding phones first. The default internally in GV is false. This option only works with forwarding phones that use GV for voicemail (see 'enableVoicemail' below)
			blockWeekday: { demand: false, type: [Array, Boolean], handler: blockHandler('wd')},
			blockWeekend: { demand: false, type: [Array, Boolean], handler: blockHandler('we')},
			onDialIn: { demand: false, type: [String], match: ['ring','toVoicemailWithPin', 'toVoicemailWithoutPin'], handler: function(type){
				var policies = {
					ring: 0,
					toVoicemailWithPin: 1,
					toVoicemailWithoutPin: 3
				};
				return {
					policyBitmask: policies[type]
				};
			}},
			dryRun: { demand: false, type: [Boolean], name: 'dryRun', default: true } // true=test the outcome of these settings without committing them, false=commit the settings if they are commitable
		},
	},
	verify: {
		description: 'Verify a forwarding phone by specifying a two-digit code to be entered on the forwarding number once it receives a call',
		path: '/call/verifyForwarding/',
		token: 'rnr',
		options: {
			id: { demand: true, type: [Number], name: 'phoneId' },
			number: { demand: true, type: [String], name: 'forwardingNumber'},
			code: { demand: true, type: [String], handler: function(code){
				var match = code.match(/^(\d{2})$/);
				if(code.length != 2 || !match){
					return new GoogleVoiceError('INVALID_PARAMETER_VALUE', {parameter: 'code', value: code, expected: 'TWO-DIGIT NUMBER'});
				}else{
					return {code: code}
				}
			}}, // code MUST be two digits
			type: { demand: true, type: [String], match: Object.keys(DEFAULTS.phoneTypes), handler: function(type){
				return { phoneType:  DEFAULTS.phoneTypes[type] };
			}},
			subscriberNumber: { fixed: true, default: 'undefined' },	
		}
	},	
	checkIfVerified: {
		description: 'Check if a forwarding phone has been verified by phone id',
		path: '/settings/checkForwardingVerified',
		method: 'GET',
		options: {
			id: { demand: true, type: [Number], name: 'phoneId'},
		}
	},
	checkIllegalSharing: {
		description: 'Check if a forwarding phone is being used on another GV account, by phone id',
		path: '/settings/checkIllegalSharing/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [Number], name: 'phoneId'}
		}
	},
	checkCarrier: {
		description: 'Get the carrier of a forwarding phone by phone id and number',
		path: '/settings/checkCarrier/',
		token: 'rnr',
		options: {
			id: { demand: true, type: [Number], name: 'phoneId'},
			number: { demand: true, type: [String], name: 'phoneNumber'}
		}
	},
	enableVoicemail: {
		description: 'Get the number that must be dialed on the forwarding phone to setup voicemail diversion to GV',
		path: '/settings/getDiversionCode',
		token: 'rnr',
		method: 'GET',
		options: {
			carrier: { demand: true, type: [String], name: 'carrier'}, // spelling & caps matter for this: VERIZON, ATT
			id: { demand: true, type: [Number], name: 'id'},
			diversionNum: { demand: false, type: [String], name: 'diversionNum',  default: ''}
		}
	},
	disableVoicemail: {
		description: 'Get the number that must be dialed on the forwarding phone to disable voicemail diversion to GV',
		path: '/settings/getDiversionCode',
		token: 'rnr',
		method: 'GET',
		options: {
			carrier: { demand: true, type: [String], name: 'carrier'}, // spelling & caps matter for this: VERIZON, ATT
			id: { demand: true, type: [Number], name: 'id'},
			diversionNum: { fixed: true, default: ''},
			isDisable: { fixed: true, default:'1'}
		}
	}
};