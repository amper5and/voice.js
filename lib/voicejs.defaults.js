module.exports = {
	baseUrl: 'https://www.google.com/voice',
	methods: ['comm', 'get', 'set', 'settings', 'phones', 'contacts', 'name', 'greetings', 'widgets'],
	labels: ['all', 'inbox', 'missed', 'placed', 'received', 'recorded', 'sms', 'spam', 'starred', 'trash', 'unread', 'voicemail'],
	mobileHeader: 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
	responseTypes: [ // not an exhaustive list
		'settings_response' /*getSettings()*/, 
		'conversations_response' /*get('label')*/, 
		'phonebook_response' /*getContacts()*/, 
		'send_sms_response', 
		'call_through_response'
	],
	phoneTypes: {
		'home': 1,
		'mobile': 2,
		'work': 3,
		'gizmo': 7,
		'googletalk': 9
	},
	phoneTypeMap: {}
};

for(var type in module.exports.phoneTypes){
	module.exports.phoneTypeMap[module.exports.phoneTypes[type]] = type;
}
