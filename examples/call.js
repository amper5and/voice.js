var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});


// Connect to 18005551212 using your GV forwarding phone 1234567890
client.connect({ to: '18005551212', from: '1234567890'}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('Calling you.');
	
	//cancel the call after 10 seconds
	setTimeout(function(){
		client.cancel(function(error, response, data){
			return error ? console.log(error) : console.log('Call cancelled.');
		})
	}, 10000);
});


// Connect to 18005551212 using Google Talk
client.connect({ to: '18005551212', from: client.config.email }, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('Calling you.');
	
	//cancel the call after 10 seconds
	setTimeout(function(){
		client.cancel(function(error, response, data){
			return error ? console.log(error) : console.log('Call cancelled.');
		})
	}, 10000);
});


// Connect to 18005551212 using your GV forwarding phone 1234567890 and 
// a special access number that will dial directly to your outgoing number.
// Note this does not appear to work with Google Talk forwarding numbers
client.call({ to: '18005551212', from: '1234567890'}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('Call confirmed. Use the forwarding phone 1234567890 to dial', data.call_through_response.access_number);
});