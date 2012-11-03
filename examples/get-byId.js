var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});


// beautify
String.prototype.padLeft = function(length){
	return new Array(length - this.length + 1).join(' ') + this; 
};

// Helper function to indicate whether an Array contains an entry
// Used to check if a conversation has a certain label, such as convo.label.is('starred')
Array.prototype.is = function(entry){
	return !!~this.indexOf(entry);
};

function displayConversations(conversations){
	conversations.forEach(function(convo, index){
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
}

// Get latest three received calls, then fetch them by id
client.get('received', {limit:3}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
	
	console.log('\nLatest 3 received calls:');
	displayConversations(data.conversations_response.conversation);
	
	var ids = data.conversations_response.conversation.map(function(obj){ return obj.id});
	
	client.get('byId', {id: ids}, function(error, response, data){
		if(error){
			return console.log(error);
		}
		if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
		
		console.log('\nFetched by id:');
		displayConversations(data.conversations_response.conversation);
	});
});