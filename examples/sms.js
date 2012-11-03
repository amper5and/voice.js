var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});


// There are two ways to send texts. 

// The first method returns the new conversation id, but doesn't allow sending to multiple recipients
client.sms({ to: '18005551212', text: "It's all right..."}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('SMS sent. Conversation id: ', data.send_sms_response.conversation_id);
});


// The second method does NOT return the new conversation id, but allows sending to multiple recipients
client.altsms({ to: ['18005551212','18005551213'], text: "It's all right..."}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('SMS sent.', data);
});