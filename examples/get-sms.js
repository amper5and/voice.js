var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});

// Get the 5 latest sms conversations and display their threads, from first text to last
client.get('sms', {limit:5}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
	
	console.log('SMS: Latest conversations.');
	data.conversations_response.conversation.forEach(function(convo){
		console.log('\n', convo.read ? ' ' : '+', new Date(convo.conversation_time).toDateString(), convo.phone_call[0].contact.phone_number_formatted);
		convo.phone_call.reverse().forEach(function(msg){
			console.log(new Date(msg.start_time).toISOString().replace(/[ZT]/g,' ').substr(0,16), msg.message_text);
		});
		
	});
});