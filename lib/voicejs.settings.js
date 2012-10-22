// These are the various methods that can be used with Client.settings() to change GV settings
var DEFAULTS = require('./voicejs.defaults.js');
var GoogleVoiceError = require('./voicejs.errors.js');

module.exports = {
	get: {
		description: 'Retrieve GV settings, forwarding phones, groups, and greetings',
		path: '/settings/tab/settings',
		method: 'GET'
	},
	
	/*
	get: { 
		description: 'Get all GV settings',
		path: '/request/settings',
		method: 'GET',
	},
	get: { // the mobile way
		token: 'gvx',
		options: {
			m: {fixed: true, default: 'set'},
			v: {fixed: true, default: '10'}
		}
	},
	*/
	getDnd: {
		description: 'Get Do Not Disturb status',
		path: '/settings/getDoNotDisturb/',
		method: 'GET'
	},
	enableDnd: {
		description: 'Enable Do Not Disturb',
		path: '/settings/setDoNotDisturb/',
		token: 'rnr',
		options: {
			doNotDisturb: {fixed: true, default: '1'},
		}
	},
	disableDnd: {
		description: 'Disable Do Not Disturb',
		path: '/settings/setDoNotDisturb/',
		token: 'rnr',
		options: {
			doNotDisturb: {fixed: true, default: '0'}
		}
	},
	set: {
		description: 'Set various GV settings',
		path: '/settings/editGeneralSettings/',
		token: 'rnr',
		options: {
			/*
			options that interact and must be set together to preserve previous settings:
			smsToEmail
			missedToEmail
			voicemailToEmail
			voicemailToPhones
			
			*/
			missedToEmail:	{type: [Boolean]},
			missedToInbox: {type:[Boolean]},
			email: {type:[String], submit: false}, //needed for smsToEmail adn voicemailToEmail
			smsToEmailSubject: {type: [Boolean]}, // whether to have the sms in the subject
			smsToEmail: {type: [Boolean], name: 'smsToEmailActive', handler: function(toemail, options){
				if(toemail){
					if(!options.email){
						return new GoogleVoiceError('MISSING_REQUIRED_PARAMETER', {parameter: 'email'});
					}else{
						return { 
							smsToEmailActive: true,
							emailNotificationActive: !!options.voicemailToEmail,
							emailNotificationAddress: options.email
						}
					}	
				}else{
					return {
						smsToEmailActive: false
					}
				}
			}},	
			voicemailToEmail: {type:[Boolean], handler: function(toemail, options){
				if(toemail){
					if(!options.email){
						return new GoogleVoiceError('MISSING_REQUIRED_PARAMETER', {parameter: 'email'});
					}else{
						return { 
							emailNotificationActive: true,
							emailNotificationAddress: options.email
						}
					}	
				}else{
					return {
						emailNotificationActive: false
					}
				}
			}},
			voicemailToPhones: {type: [Array], handler: function(phones){
				var params = {};
				phones.forEach(function(number){
					params['smsNotifications['+number+']'] = '1';
				});
				return params;
			}},
			greetingId: {type: [Number]},
			showTranscripts: {type: [Boolean]},
			filterGlobalSpam: {type:[Boolean]},
			doNotDisturb: {type: [Boolean], name: 'doNotDisturb'},
			doNotDisturbExpiration: {type: [Date], handler: function(date, options){
				var params = { doNotDisturbExpiration: date.valueOf()};
				if(!options.hasOwnProperty('doNotDisturb')){ // if only a dnd expiration is given but no directive to enable dnd, it won't enable dnd
					params.doNotDisturb = true;
				}
				return params;
			}},
			pin: {type:[String]},
			inCallOptions: {type:[Boolean], handler: function(incalloptions){ // enables/disables the availability of in-call options (4 to start recording, * to switch phones, etc)
				return {directRtp: !incalloptions}; //weirdly, the opposite is needed here. corresponds to !directRtp setting 
			}}, 
			askForName: {type:[Boolean], handler: function(ask){ // ask callers for name?
				return {screenBehavior: !ask}; // weirdly, the opposite of ask is needed here. TODO: see if directConnect=true will override this setting, corresponds to !screenBehavior setting
			}},
			directConnect: {type:[Boolean]},
			useGoogleVoiceNumberAsIncomingCallerId: {type:[Boolean], name: 'useDidAsCallerId'},// true=displays GV number, false=displays caller's number, corresponds to useDidAsCallerId setting
			useGoogleVoiceNumberAsOutgoingCallerId: {type:[Boolean], name:'useDidAsSmsSource'}// true=displays GV number, false=displays forwarding phone number, corresponds to useDidAsSource setting
			//timezone: {type:[String]},
			//language: {type:[String]}
		}
	}
};