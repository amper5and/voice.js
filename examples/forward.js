var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// Retrieve the latest voicemail message and forward it to to your GV email address
client.get('voicemail', {limit: 1}, function(error, response, data){
	if(error){
		return console.log(error)
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No conversations.')}

	var id = data.conversations_response.conversationgroup[0].conversation.id;
	
	// Note that if you try to forward a non-voicemail/recorded message, a 500 Server Error (response.statusCode === 500) will occur
	client.forward({
		id: id, // required, voicemail or recorded message id
		email: client.config.email, // required, can also be ['email1@gmail.com', 'email2@gmail.com']
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