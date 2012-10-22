var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});


// retrieve all settings
client.settings('get', function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	var settings = data.settings;
	console.log(
		'\n', 'GV number: ', settings.primaryDid,
		'\n', 'Do Not Disturb is ' + (settings.doNotDisturb ? 'enabled' : 'disabled'),	
		'\n', settings.doNotDisturbExpiration ? 'DND expires at' + new Date(data.doNotDisturbExpiration) : '',
		'\n', 'Display ' + (settings.useDidAsSource ? 'GV number' : 'forwarding phone number') + ' to recipient when sending texts',
		'\n', 'Display ' + (settings.useDidAsCallerId ? "GV number" : "caller's number") + ' as caller id for incoming calls',
		'\n', 'In-call options are ' + (settings.directRtp ? 'disabled' : 'enabled'), // this one is counter-intuitive
		'\n', 'Callers are' + (settings.screenBehavior ? ' NOT' : '') + ' asked to say their name', // this one is counter-intuitive
		'\n', 'When you pick up, you are' + (settings.directConnect ? '' : ' NOT') + ' directly connected to the caller',
		'\n', 'Spam is' + (settings.filterGlobalSpam ? '' : ' NOT') + ' filtered',
		'\n', 'Transcripts are' + (settings.showTranscripts ? '' : ' NOT') + ' shown',
		'\n', 'Missed calls are' + (settings.missedToEmail ? '' : ' NOT') + ' forwarded to your email',
		'\n', 'Missed calls are' + (settings.missedToInbox ? '' : ' NOT') + ' placed in your GV inbox',
		'\n', 'Texts are' + (settings.smsToEmailActive ? '' : ' NOT') +  ' forwarded to your email',
		'\n', 'Texts forwarded to your email will' + (settings.smsToEmailSubject ? '' : ' NOT') + ' contain the text in the subject',
		'\n', 'Voicemails are ' + (settings.emailNotificationActive ? 'forwarded to ' + settings.emailNotificationAddress : 'NOT forwarded to email'),
		'\n', 'Voicemails are ' + (settings.smsNotifications.length ? 'forwarded to the following phones:' : 'NOT forwarded to phones')
	);
	settings.smsNotifications.forEach(function(phone){
		console.log('  '+ phone.address);
	});
});


// REMOVE THIS LINE TO MAKE CHANGES TO YOUR GV ACCOUNT AFTER YOU'VE REVIEWED WHICH SETTINGS WILL BE CHANGED BELOW!
return;


// All settings can be set at once using client.settings('set',{})
// The examples below edit settings in different groups for the purpose of demonstration.


// Set call options
client.settings('set',{
	askForName: false, // do require callers to say their name before being connected
	directConnect: false, // disable global direct connect, i.e. connect directly to caller when answering a forwarding phone,
	inCallOptions: true, // enable in-call recording (press 4), switching phones (press *), etc
	useGoogleVoiceNumberAsIncomingCallerId: false, // show the caller's number for incoming calls,
	useGoogleVoiceNumberAsOutgoingCallerId: true // use your GV number as caller id for outgoing calls, instead of your forwarding phone
}, function(error, response, data){
	return error ? console.log(error) : console.log('CALL OPTIONS CHANGED.')
});


// Set notification settings. 
// Note: it is highly recommended that these options are set together, 
// otherwise Google Voice will RESET previously set settings to default values
client.settings('set',{ 
	email: 'email@gmail.com', // the email for the below forwarding settings. Must be one of the verified emails in your Google Account.
	missedToInbox: false, // place missed calls in GV inbox
	missedToEmail: true, // forward missed calls to email
	smsToEmail: true, // forward texts to email
	voicemailToEmail: true, // forward voicemails to email
	voicemailToPhones: ['1234567890'], // forward voicemails to individual forwarding numbers via sms. Note: this setting can be changed for individual forwarding phones via client.phones('enableVoicemailNotifyBySMS'). See examples/phones.js
}, function(error, response, data){
	return error ? console.log(error) : console.log('NOTIFICATION SETTINGS CHANGED.')
});


// Set other misc settings:
client.settings('set',{ 
	pin: '0000', // pin number for accessing voicemail 
	filterGlobalSpam: false, // turn off GV spam filtering
	showTranscripts: true, // get transcripts of voicemails
}, function(error, response, data){
	return error ? console.log(error) : console.log('MISC SETTINGS CHANGED.')
});