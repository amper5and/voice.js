var voicejs = require('../voice.js');
var fs = require('fs');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// beautify
String.prototype.padLeft = function(length){
	return new Array(length - this.length + 1).join(' ') + this; 
}

// Helper function to indicate whether an Array contains an entry
// Used to check if a conversation has a certain label, such as convo.is('starred')
Array.prototype.is = function(entry){
	return !!~this.indexOf(entry);
}


// Get the 5 latest voicemails. Display transcripts and download the audio to a file.
client.get('voicemail', {limit: 5}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	if(!data || !data.conversations_response || !data.conversations_response.conversation){ return console.log('No conversations.')}
	
	console.log('\nLatest voicemails:');
	
	// Display the conversations indicating if they have been read or starred and whether it's a text or voicemail
	data.conversations_response.conversation.forEach(function(convo, index){
		console.log('\n%s %s. %s %s %s', 
			convo.read ? ' ' : '+', 
			(index+1+'').padLeft(3),  
			convo.phone_call[0].contact.phone_number_formatted.padLeft(15),
			new Date(convo.conversation_time).toISOString().replace(/[ZT]/g,' ').substr(0,16).padLeft(18),
			convo.label.is('starred') ? '*' : ' '
		);
		if(convo.phone_call[0].transcript && convo.phone_call[0].transcript.word_tokens){
			console.log(convo.phone_call[0].transcript.word_tokens.map(function(entry){ return entry.word}).join(' '));
		}
		
        // Download the voicemail mp3
		client.getAudio({id: convo.id, format: 'mp3'}, function(err, res, data){
			if(err){
				console.log(err)
				return;
			}

			var fileName = './' + convo.id + '.mp3';
			fs.writeFileSync(fileName, data);
		});
	});
});