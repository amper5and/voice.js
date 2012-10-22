var voicejs = require('../voice.js');

var fs = require('fs');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});


// Download all contacts and display them.
client.contacts('get', function(error, response, data){
	if(error){
		return console.log(error)
	}
	
	console.log('\nPHONEBOOK:');
	for(var id in data.contacts){
		console.log();
		console.log(data.contacts[id].name, data.contacts[id].emails.join(', ') );
		data.contacts[id].numbers.forEach(function(number){
			console.log('%s: %s', number.phoneType, number.displayNumber);
		});
	};
});


// REMOVE THIS LINE TO MAKE CHANGES TO YOUR GV ACCOUNT AFTER YOU'VE REVIEWED THE CHANGES BELOW!
return;



// Add a new contact to your phonebook after making sure to account for any possible matching contacts
client.contacts('new',{
	number: '1-800-225-5532',
	name: 'Colonel Sanders',
	type: 'WORK', // MOBILE, WORK, or HOME
	check: true, // check for possible matching contacts and add contact to phonebook only if there are no possible matches
//	focusId: '' // merge with a contact 
}, function(error, response, data){
	
	if(error){
		return console.log(error);
	}
	
	if(data && data.data && data.data.matchingContacts && data.data.matchingContacts.length){
		console.log('\nPossible matching contacts and their focus ids: ');
		
		// Display contact phone numbers and their 'focusId' which can be passed to client.addContact() to merge the new contact with an old one
		data.data.matchingContacts.forEach(function(contact){
			console.log(contact.detail, ' ', contact.focusId);
		});
		
		return console.log('\nContact not added. Use the focus id to merge the new contact with an old contact.')
		
	}else{ // no matching contacts
		console.log('Successfully added contact.');
	}
	
	// Download all contacts.
	client.contacts('get', function(error, response, data){
		if(error){
			return console.log(error)
		}
		
		// Display Colonel Sanders in the phone book:
		var sanders = data.contactPhones['+18002255532'];
		if(!sanders){
			return console.log('Did not find +18002255532 in the phone book.');
		}
		
		console.log('\nDetails for Colonel Sanders:\n', data.contacts[sanders.contactId]);
		
		// Display the GV settings for Colonel Sanders
		client.contacts('getSettings', {id: sanders.contactId}, function(error, response, data){
			if(error){
				return console.log('ERROR GETTING CONTACT SETTINGS: ', error);
			}

			console.log('\nGoogle Voice settings for contact with id', sanders.contactId);
			console.log(data.contactData);

			/*
			Options for client.contacts('editSettings', options, callback):

			id: String, required, the unique contact id
			greetingId: Number, optional, the greeting to use for this contact
			disabledPhoneIds: Array, optional, phones that WILL NOT ring for this contact,
			response: String, optional, 'DEFAULT', 'VOICEMAIL', 'SPAM', 'BLOCK', defaults to 'DEFAULT'
			groupId: Number, optional, the id of the group this contact should belong to, defaults to 0 (All Contacts group)
			onRing: String, optional, what should happen when you pick up the phone: 'direct' (start talking to the contact), 'options' (be presented with options such as to record, etc), 'default' (use the default setting for the contact's group), defaults to 'DEFAULT'
			*/

			// When Col Sanders calls, block him
			client.contacts('editSettings', {
				id: sanders.contactId, 
				response: 'BLOCK' // can be 'DEFAULT', 'VOICEMAIL', 'SPAM', or 'BLOCK',
			}, function(error, response, data){
				if(error){
					return console.log('\nERROR CHANGING CONTACT SETTINGS: ', error);
				}else{
					console.log('\nChanged contact settings succesfully.');
				}
			});
			
			
			// Download the mp3 message that will be played for blocked callers:
			client.contacts('getBlockedMessage', function(error, response, data){
				if(error){
					return console.log('ERROR DOWNLOADING BLOCKED MESSAGE:', error);
				}
				
				fs.writeFileSync('blockedMessage.mp3', data);
				console.log('Saved blocked message to blockedMessage.mp3');
			});
		});
	});
	
});