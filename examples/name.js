var voicejs = require('../voice.js');
var fs = require('fs');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});


// Download the recorded name on your GV account
client.name('get', function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	fs.writeFileSync('name.mp3', data);
	console.log('Name audio file downloaded to name.mp3')
});


// Receive a call to record a new name on your Google Talk phone
client.name('record',{ number: client.config.email}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	console.log('Calling you on Google Talk forwarding phone', client.config.email, 'to record name');
	
	// cancel the call after 7 seconds
	setTimeout(function(){
		console.log('Cancelling call.')
		client.name('cancel', function(error, response, data){
			return error ? console.log(error) : console.log('Call cancelled.');
		});
	}, 7000)
});