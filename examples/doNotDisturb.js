var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// There are multiple ways to get and set Do Not Disturb status


// The following are two ways of retrieving DND
client.settings('getDnd', function(error, response, data){
	if(error){
		return console.log(error);
	}
	console.log('DND is ' + (data.data.enabled ? 'enabled' : 'disabled'));
	if(data.data.expiration){
		console.log('DND set to expire on', new Date(data.data.expiration))
	}
	
	
	client.settings('get', function(error, response, data){
		if(error){
			return console.log(error);
		}
		console.log('DND is ' + (data.settings.doNotDisturb ? 'enabled' : 'disabled'));
		if(data.settings.doNotDisturbExpiration){
			console.log('DND set to expire on', new Date(data.settings.doNotDisturbExpiration))
		}
		
		
		// The following are two ways of enabling DND without expiration
		client.settings('enableDnd', function(error, response, data){
			console.log(error ? error : 'DND enabled successfully');

			client.settings('set',{doNotDisturb: true}, function(error, response, data){
				console.log(error ? error : 'DND enabled successfully');


				// Enable DND with expiration on Dec 25, 2012 8am
				client.settings('set',{doNotDisturbExpiration: new Date('Dec 25 2011 08:00')}, function(error, response, data){
					console.log(error ? error : 'DND enabled successfully');


					// The following are two ways to disable DND
					client.settings('disableDnd', function(error, response, data){
						console.log(error ? error : 'DND disabled successfully');


						client.settings('set', {doNotDisturb: false}, function(error, response, data){
							console.log(error ? error : 'DND disabled successfully');
							
							
							//Retrieve DND status once more
							client.settings('getDnd', function(error, response, data){
								if(error){
									return console.log(error);
								}
								console.log('DND is ' + (data.data.enabled ? 'enabled' : 'disabled'));
								if(data.data.expiration){
									console.log('DND set to expire on', new Date(data.data.expiration))
								}
							});
						});
					});
				});
			});	
		});
	});
});