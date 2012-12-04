// These are the various methods that can be used with Client.contacts() to retrieve and edit contacts

var DEFAULTS = require('./voicejs.defaults.js');
var GoogleVoiceError = require('./voicejs.errors.js');

module.exports = {
	get: {
		description: 'Retrieve all contacts',
		path: '/request/contacts',
		method: 'GET',
	},
	new: {
		description: 'Add a new contact, optionally checking if there are possible matches',
		path: '/phonebook/quickAdd',
		token: 'rnr',
		options: {
			name: { demand: true, type: [String], name: 'name'},
			number: { demand: true, type: [String], name: 'phoneNumber'},
			type: { demand: true, type: [String], name: 'phoneType', match: ['HOME', 'MOBILE', 'WORK']},
			check: { demand: false, type: [Boolean], name: 'needsCheck', default: false},
			focusId: { demand: false, type: [String], name: 'focusId'}
		}
	},
	getSettings: {
		description: 'Retrieve GV settings for a contact',
		path: '/contacts/getContactData/',
		method: 'GET',
		options: {
			id: {demand: true, type: [String], name: 'contactId'}
		}
	},
	/*
	Options:
	id: String, required, the unique contact id
	greetingId: Number, optional, the greeting to use for this contact, defaults to 0 (All Contacts greeting)
	disabledPhoneIds: Array, optional, phones that WILL NOT ring for this contact,
	response: String, optional, 'DEFAULT', 'VOICEMAIL', 'SPAM', 'BLOCK', defaults to 'DEFAULT' //what happens when the contact calls you
	groupId: Number, optional, the id of the group this contact should belong to, defaults to 0 (All Contacts group)
	onRing: String, optional, what should happen when you pick up the phone: 'direct' (start talking to the contact), 'options' (be presented with options such as to record, etc), 'default' (use the default setting for the contact's group), defaults to 'DEFAULT'
	*/
	editSettings: {
		description: 'Edit GV settings for a contact',
		path: '/contacts/editContact/',
		token: 'rnr',
		options: {
			id: { demand: true, type: [String], name: 'id'},
			groupdId: {demand: false, type: [Number], name: 'selectedGroupId'},
			response: { demand: false, type:[String], name: 'response', default: 'DEFAULT', match: ['DEFAULT', 'SPAM', 'BLOCK', 'VOICEMAIL']},
			disabledPhoneIds: {demand: false, type: [Array], handler: function(disabledPhoneIds){
				return {
					isCustomForwarding: true,
					disabledPhoneIds: disabledPhoneIds.join(',')
				};
			}},
			greetingId: {demand: false, type: [Number], handler: function(greetingId){
				return {
					isCustomGreeting: true,
					greetingId: greetingId
				};
			}},
			onRing: { demand: false, type: [String], match: ['direct', 'options', 'default'], handler: function(onRing){
				var params = {};
				switch(options.onRing){
					case 'direct':
						params.directConnect = 1; params.isCustomDirectConnect = 1;
						break;
					case 'options':
						params.directConnect = 0; params.isCustomDirectConnect = 1;
						break;
					case 'default':
					default:
						params.directConnect = 0; params.isCustomDirectConnect = 0;
				}
				return params;
			}}
		}
	},
	getBlockedMessage: {
		description: 'Get the mp3 of the message that will be played to blocked callers',
		path: '/media/sendOutOfServiceMessage',
		encoding: null,
		method: 'GET'
	}
};