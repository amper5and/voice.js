var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});

// Retrieve the latest voicemail message and forward it to email@gmail.com
client.get('voicemail', {limit: 1}, function(error, response, data){
	if(error){
		return console.log(error)
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
	
	var id = data.conversations_response.conversation[0].id;
	
	// Note that if you try to forward a non-voicemail/recorded message, a 500 Server Error (response.statusCode === 500) will occur
	client.forward({
		id: id, // required, voicemail or recorded message id
		email: 'email@gmail.com', // required, can also be ['email1@gmail.com', 'email2@gmail.com']
		subject: 'A test message from voice.js', // optional
		body: 'Listen to this message, yo', // optional
		link: true // include the message in the body, optional, defaults to false
	}, function(error, response, data){
		if(error){
			return console.log(error)
		}
		
		console.log('Message forwarded', data && data.data && data.data.email ? 'to ' + data.data.email.join() : '.')
	});
});