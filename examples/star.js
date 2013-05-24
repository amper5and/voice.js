var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// Helper function to indicate whether an Array contains an entry
// Used to check if a conversation has a certain label, such as convo.label.is('starred')
Array.prototype.is = function(entry){
	return !!~this.indexOf(entry);
}



// Star then unstar the 5 latest conversations in your history that are currently UNSTARRED, showing the starred messages in the process


client.get('starred', {limit: 10}, function(error, response, data){
	if(error){ return console.log(error); }

	if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No starred conversations')}

	console.log('\nLatest starred conversations:')
	data.conversations_response.conversationgroup.forEach(function(convo){
		console.log(convo.conversation.id);
	});
	
	
	// Get 5 messages from the history
	client.get('all', {limit:5}, function(error, response, data){
		if(error){
			return console.log(error);
		}
		if(!data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No conversations')}

		console.log('\nConversations to star:')
		var ids = [];
		data.conversations_response.conversationgroup.forEach(function(convo){	
			console.log(convo.conversation.id);
			if(!convo.conversation.label.is('starred')){ // if not currently starred, push to array of ids that wil be starred
				ids.push(convo.conversation.id)
			}
		});


		// Star the conversations all at once
		client.set('mark', {star: true, id: ids}, function(error, response, data){
			if(error){ return console.log(error); }
			console.log('\nStarred 5 conversations successfully.');


			// get the latest 10 starred messages
			client.get('starred', {limit: 10}, function(error, response, data){
				if(error){ return console.log(error); }

				if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No starred conversations')}

				console.log('\nLatest starred conversations:')
				data.conversations_response.conversationgroup.forEach(function(convo){
					console.log(convo.conversation.id);
				});


				// Unstar multiple conversations at once by passing in an array of conversation ids
				client.set('mark',{star: false, id: ids}, function(error, response, data){
					if(error){ return console.log(error); }

					console.log('\nUnstarred 5 conversations successfully.');


					// List starred messages
					client.get('starred', function(error, response, data){
						if(error) return console.log(error);

						if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ return console.log('No starred conversations')}

						console.log('\nLatest starred conversations:')
						data.conversations_response.conversationgroup.forEach(function(convo){
							console.log(convo.conversation.id);
						})
					});
				})
			});
		});
	});
});