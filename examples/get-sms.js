var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// Get the 5 latest sms conversations and display their threads, from first text to last
client.get('sms', {limit:5}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No conversations.')}
	
	console.log('SMS: Latest conversations.');

	data.conversations_response.conversationgroup.forEach(function(convo){
		console.log('\n', convo.conversation.status == 1 ? ' ' : '+', new Date(convo.conversation.conversation_time).toDateString(), convo.call[0].phone_number);
		convo.call.reverse().forEach(function(msg){
			console.log(new Date(msg.start_time).toISOString().replace(/[ZT]/g,' ').substr(0,16), msg.message_text);
		});
		
	});
});