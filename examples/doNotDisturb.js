var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});

// There are multiple ways to get and set Do Not Disturb status


// The following are two ways of retrieving DND
client.settings('get', function(error, response, data){
	if(error){
		return console.log(error);
	}
	console.log('DND is ' + (data.settings.doNotDisturb ? 'enabled' : 'disabled'));
	if(data.settings.doNotDisturbExpiration){
		console.log('DND set to expire on', new Date(data.settings.doNotDisturbExpiration))
	}
});

client.settings('getDnd', function(error, response, data){
	if(error){
		return console.log(error);
	}
	console.log('DND is ' + (data.data.enabled ? 'enabled' : 'disabled'));
	if(data.data.expiration){
		console.log('DND set to expire on', new Date(data.data.expiration))
	}
});


// REMOVE THE FOLLOWING LINE TO MAKE CHANGES TO YOUR GV ACCOUNT AFTER YOU'VE REVIEWED WHICH SETTINGS WILL BE CHANGED BELOW!
return;




// The following are two ways to disable DND
client.settings('disableDnd', function(error, response, data){
	console.log(error ? error : 'DND disabled successfully');
});

client.settings('set',{doNotDisturb: false}, function(error, response, data){
	console.log(error ? error : 'DND disabled successfully');
});


// The following are two ways of enabling DND without expiration
client.settings('enableDnd', function(error, response, data){
	console.log(error ? error : 'DND enabled successfully');
});

client.settings('set',{doNotDisturb: true}, function(error, response, data){
	console.log(error ? error : 'DND enabled successfully');
});


// The following is how to enable DND with expiration on Dec 25, 2012 8am
client.settings('set',{doNotDisturbExpiration: new Date('Dec 25 2011 08:00')}, function(error, response, data){
	console.log(error ? error : 'DND enabled successfully');
});