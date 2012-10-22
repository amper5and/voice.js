var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});

// Star then unstar the 5 latest conversations in your history, showing the starred messages in the process

// get 5 messages from the history
client.get('all', {limit:5}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	if(!data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations')}
	
	console.log('\nConversations to star:')
	var ids = [];
	data.conversations_response.conversation.forEach(function(convo){	
		console.log(convo.id);
		ids.push(convo.id)
	});
	
	// Star the conversations all at once
	client.set('star', {id: ids}, function(error, response, data){
		if(error){ return console.log(error); }
		
		console.log('\nStarred 5 conversations successfully.');
		
		// get the latest 10 starred messages
		client.get('starred', {limit: 10}, function(error, response, data){
			if(error){ return console.log(error); }

			if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No starred conversations')}

			console.log('\nLatest starred conversations:')
			data.conversations_response.conversation.forEach(function(convo){
				console.log(convo.id);
			});


			// Unstar multiple conversations at once by passing in an array of conversation ids
			client.set('unstar',{id: ids}, function(error, response, data){
				if(error){ return console.log(error); }

				console.log('\nUnstarred 5 conversations successfully.');
				
				// List starred messages
				client.get('starred', function(error, response, data){
					if(error) return console.log(error);

					if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No starred conversations')}

					console.log('\nLatest starred conversations:')
					data.conversations_response.conversation.forEach(function(convo){
						console.log(convo.id);
					})
				});
			})
		});
	});
});