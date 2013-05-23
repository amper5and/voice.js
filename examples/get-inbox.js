var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});


// Beautify
String.prototype.padLeft = function(length){
	return new Array(length - this.length + 1).join(' ') + this; 
}

// Helper function to indicate whether an Array contains an entry
// Used to check if a conversation has a certain label, such as convo.label.is('starred')
Array.prototype.is = function(entry){
	return !!~this.indexOf(entry);
}

function displayConversations(conversations){
    conversations.forEach(function(convo, index){
		console.log('%s %s. %s %s %s %s   %s', 
			convo.conversation.status == 1 ? ' ' : '+', 
			(index+1+'').padLeft(3),  
			convo.call[0].phone_number.padLeft(15), 
			new Date(convo.conversation.conversation_time).toISOString().replace(/[ZT]/g,' ').substr(0,16).padLeft(18),
			convo.conversation.label.is('starred') ? '*' : ' ',
			convo.conversation.id,
			convo.conversation.label.join()
		);
	});
}


// Get the default number (20) of conversations, starting with the first one
client.get('inbox', function(error, response, data){
	if(error){
		return console.log(error);
	}
    
	if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No conversations.')}
	
	console.log('\n INBOX: Latest conversations');
	displayConversations(data.conversations_response.conversationgroup);
});


// Get 5 conversations, starting with the 10th one
client.get('inbox', {start: 10, limit: 5}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No conversations.')}
	
	console.log('\n INBOX: Conversations 10-'+ (10+data.conversations_response.conversationgroup.length-1) );
	displayConversations(data.conversations_response.conversationgroup);
});