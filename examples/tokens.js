var fs = require('fs');
var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password'
});

// This example retrieves the different authentication tokens and saves them to tokens.json
// See the file TOKENS.md for more information on tokens.


// This fn will monitor token events until all 3 tokens are retrieved. 
// When all three are retrieved, they will be saved to tokens.json
function newToken(){ // check if the client has all the tokens
	var allRetrieved = true;
	var tokens = client.getTokens();
	
	['auth', 'gvx', 'rnr'].forEach(function(type){
		if(!tokens.hasOwnProperty(type)){
			allRetrieved = false;
		}
	});
	
	if(allRetrieved){ // save tokens once all have been retrieved
		fs.writeFileSync('./tokens.json', JSON.stringify(tokens));
		console.log('\n\nALL TOKENS SAVED TO tokens.json')
	}
};


// Whenever a NEW token is retrieved, the corresponding event is emitted. 
// Note: These events are only emitted when the newly-retrieved token is CHANGED or NEW.
client.on('auth', newToken);
client.on('gvx', newToken);
client.on('rnr', newToken)


// Get an auth token
client.auth(function(err, token){
	if(err){
		return console.log('.auth error: ', err);
	}
	
	console.log('\nNew auth token:');
	console.log(token);
});

// Get an rnr token
client.rnr(function(err, token){
	if(err){
		return console.log('.rnr error: ', err);
	}

	console.log('\nNew rnr token:');
	console.log(token);
});

// Get a gvx token
client.gvx(function(err, token){
	if(err){
		return console.log('.gvx error: ', err);
	}

	console.log('\nNew gvx token:');
	console.log(token);
});
