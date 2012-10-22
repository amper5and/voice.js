var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});


// beautify
String.prototype.padLeft = function(length){
	return new Array(length - this.length + 1).join(' ') + this; 
}

// Helper function to indicate whether an Array contains an entry
// Used to check if a conversation has a certain label, such as convo.label.is('starred')
Array.prototype.is = function(entry){
	return !!~this.indexOf(entry);
}

// Get the default number (20) of conversations, starting with the first one
client.get('inbox', function(error, response, data){
	if(error){
		return console.log(error);
	}
	if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
	
	console.log('\n INBOX: Latest conversations');
	
	// Display the conversations indicating if they are unread (+) or starred(*)
	data.conversations_response.conversation.forEach(function(convo, index){
		console.log('%s %s. %s %s %s %s   %s', 
			convo.read ? ' ' : '+', 
			(index+1+'').padLeft(3),  
			convo.phone_call[0].contact.phone_number_formatted.padLeft(15), 
			new Date(convo.conversation_time).toISOString().replace(/[ZT]/g,' ').substr(0,16).padLeft(18),
			convo.label.is('starred') ? '*' : ' ',
			convo.id,
    		convo.label.join()
		);
	});
});


// Get 5 conversations, starting with the 10th one
client.get('inbox', {start: 10, limit: 5}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
	
	console.log('\n INBOX: Conversations 10-'+ (10+data.conversations_response.conversation.length-1) );
	
	// Display the conversations indicating if they have been read or starred and whether it's a text or voicemail
	data.conversations_response.conversation.forEach(function(convo, index){
		console.log('%s %s. %s %s %s %s   %s', 
    		convo.read ? ' ' : '+', 
			(index+1+'').padLeft(3),  
			convo.phone_call[0].contact.phone_number_formatted.padLeft(15), 
			new Date(convo.conversation_time).toISOString().replace(/[ZT]/g,' ').substr(0,16).padLeft(18),
			convo.label.is('starred') ? '*' : ' ',
			convo.id,
    		convo.label.join()
		);
	});
});