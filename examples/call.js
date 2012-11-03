var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

var to = process.argv[4] || '18005551212';
var from = process.argv[5] || '1234567890';

// Connect to outgoing number 'to' using your GV forwarding phone 'from'
client.connect({ to: to, from: from}, function(err, res, data){
	if(err){
		return console.log(err);
	}
	console.log('Calling forwarding phone', from);
	
	//cancel the call after 10 seconds
	setTimeout(function(){
		client.cancel(function(error, response, data){
			return error ? console.log(error) : console.log('Call cancelled.');
		})
		
		
		// Connect to outgoing number 'to' using Google Talk
		client.connect({ to: to, from: client.config.email }, function(err, res, data){
			if(err){
				return console.log(err);
			}
			console.log('Calling forwarding Google Talk phone', client.config.email);

			//cancel the call after 10 seconds
			setTimeout(function(){
				client.cancel(function(error, response, data){
					return error ? console.log(error) : console.log('Call cancelled.');
				});


				// Connect to outgoing number 'to' using your GV forwarding phone 'from' and 
				// a special access number that will dial directly to your outgoing number.
				// Note this does not appear to work with Google Talk forwarding numbers
				client.call({ to: to, from: from}, function(err, res, data){
					if(err){
						return console.log(err);
					}
					console.log('Call confirmed. Use the forwarding phone', from, 'to dial', data.call_through_response.access_number, 'to connect to', to);
				});
			}, 10000);
		});
	}, 10000);
});