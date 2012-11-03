var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// This example lists all webcall widgets, then adds a new one, updates it, then deletes it


// Display all widgets
client.widgets('get', function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	var widgets = data.settings.webCallButtons;
	
	console.log('\nWebcall widgets:');
	
	widgets.forEach(function(widget){
		console.log(
			'\n', 'id:', widget.id,
			'\n', widget.disabled ? 'disabled' : 'enabled',
			'\n', 'greeting id:', widget.greetingId,
			'\n', 'directConnect:', widget.directConnect,
			'\n', 'Disabled forwarding phones:', Object.keys(widget.disabledForwardingIds).join(', ') 
		);
	});
	
	
	// Create a new widget, but disable it
	client.widgets('new', {
		name: 'New Widget',
		disabled: true
	}, function(error, response, data){
		if(error){
			return console.log(error);
		}
		console.log('\nNew webcall widget:');
		console.log(data.webCallButton);
		
		
		// Enable the new widget, but disable it from ringing forwarding phone 9
		// Any options not passed will be RESET by Google to default values, so we could just as well leave out the 'disabled:false' and it would be set to false anyway
		client.widgets('edit', {
			id: data.webCallButton.id, // if this id does not match a current webcall widget it, a NEW ONE will be created
			name: 'New Widget',
			disabled: false,
			disabledPhoneIds: [9]
		}, function(error, response, data){
			if(error){
				return console.log(error);
			}
			console.log('\nNew webcall widget settings:');
			console.log(data.webCallButton); // could check response widget to make sure that it's not a newly-created one (see above comment next to id)
			
			
			// Delete the widget
			client.widgets('delete', {id: data.webCallButton.id}, function(error, response, data){
				console.log(error ? '\nError deleting widget: '+ error : '\nDeleted widget successfully')
			});
		});	
	});
});