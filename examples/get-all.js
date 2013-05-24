var fs = require('fs');
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



// Get all conversations, not including spam. WARNING: MAY BE SLOW FOR VERY LARGE DATASETS
client.get('all', {limit: Infinity}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No conversations.')}
		
	// Display the conversations in descending order indicating if they are unread (+) or starred (*), as well as all the labels associated with each
	data.conversations_response.conversationgroup.reverse().forEach(function(convo, index){
		console.log('%s %s. %s %s %s %s   %s', 
			convo.conversation.status == 1 ? ' ' : '+', 
			(index+1+'').padLeft(4),  
			convo.call[0].phone_number.padLeft(18),
			new Date(convo.conversation.conversation_time).toISOString().replace(/[ZT]/g,' ').substr(0,16).padLeft(18),
			convo.conversation.label.is('starred') ? '*' : ' ',
			convo.conversation.id,
			convo.conversation.label.join()
		);
	});
	
	console.log(data.conversations_response.conversationgroup.length +  ' conversations retrieved');
	
	// Save complete GV history to file
	fs.writeFileSync('history.json', JSON.stringify(data.conversations_response.conversationgroup));
	console.log('Data saved to history.json');	
});