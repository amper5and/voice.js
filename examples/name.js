var voicejs = require('../voice.js');
var fs = require('fs');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});


// Download the recorded name on your GV account
client.name('get', function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	fs.writeFileSync('name.mp3', data);
	console.log('Name audio file downloaded.')
});


// Receive a call to record a new name
client.name('record',{ number: 'alexstets@gmail.com', type: 'googletalk'}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	console.log('Calling you.');
	
	// cancel the call after 7 seconds
	setTimeout(function(){
		console.log('Cancelling call.')
		client.name('cancel', function(error, response, data){
			return error ? console.log(error) : console.log('Call cancelled.');
		});
	}, 7000)
});