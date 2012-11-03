var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});


var text = process.argv[4] || 'This is a test sms from voice.js';
var to = process.argv.slice(5).length ?  process.argv.slice(5) : ['18005551212', '18005551213'];


// There are two ways to send texts. 

// The first method returns the new conversation id, but doesn't allow sending to multiple recipients
client.sms({ to: to[0], text: text}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('SMS "' +text+ '" sent to', to[0] + '. Conversation id: ', data.send_sms_response.conversation_id);
});


// The second method does NOT return the new conversation id, but allows sending to multiple recipients
client.altsms({ to: to, text: text}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('SMS "' +text+ '" sent to', to.join(', '));
});