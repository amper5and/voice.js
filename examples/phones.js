var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: 'email@gmail.com',
	password: 'password',
	tokens: require('./tokens.json')
});


// Display all forwarding phones:
function processResponse(error, response, data){
	if(error){
		return console.log(error); 
	}
	
	if(!data || !data.phones || !data.phoneList){
		return console.log('No forwarding phones');
	}
	
	console.log('\nForwarding phone ids: ', data.phoneList.join(', '));
	
	var phones = data.phones;
	//console.log(phones)
	console.log('\nForwarding phone details:');
	for(var id in phones){
		console.log(
			id+':',
			voicejs.DEFAULTS.phoneTypeMap[phones[id].type],
			phones[id].phoneNumber,
			phones[id].carrier,
			phones[id].active ? 'enabled' : 'disabled',
			phones[id].verified ? 'verified' : 'unverified',
			phones[id].smsEnabled ? 'receives SMS' : ''
		);
	}
	if(data.settings.smsNotifications.length){
		console.log('\nForwarding phones that receive sms voicemail notifications:');
		data.settings.smsNotifications.forEach(function(phone){
			console.log(phone.address, phone.active ? 'active' : 'inactive');
		})
	}
};
client.phones('get', processResponse);



// REMOVE THIS LINE TO MAKE CHANGES TO YOUR GV ACCOUNT AFTER YOU'VE REVIEWED THE CHANGES BELOW!
return;




// Add a new mobile forwarding phone. Make the phone NOT ring on weekends.
var newPhone = {
	number: '6234567890',
	type: 'mobile',
	name: 'My Mobile Phone',
};

client.phones('new',{
	type: newPhone.type, 
	number: newPhone.number,
	name: newPhone.name,
	dryRun: false, // make the changes stick
	blockWeekend: true
}, function(error, response, data){
	if(error){
		return console.log(error);
	}
	
	var phoneId = data.data.id;
	console.log('\nPhone added with id: ' + phoneId);
	console.log(data)
	
	
	// Enable SMS forwarding to the new phone
	client.phones('enableSMS',{id: phoneId});
	
	// Enable notification of new voicemails via text
	client.phones('enableVoicemailNotifyBySMS',{id: phoneId});
	
	// Edit the new phone to ring ONLY between 10am-1pm and 5pm-7pm on WEEKDAYS. This means we need to block all of the opposite times.
	client.phones('edit',{
		id: phoneId,
		type: newPhone.type, 
		number: newPhone.number,
		name: newPhone.name,
		dryRun: false,
		blockWeekend: true,
		blockWeekday:[
			{ from: '1:00pm', to: '5:00pm'},
			{ from: '7:00pm', to: '10:00am'}
		],
		smsEnabled: true // notice that this must be set again or it will be reset to default value (false) by GV
	}, function(error, response, data){
		if(error){
			return console.log(error);
		}
		console.log(data)
		var wd = data.data.wd,
			we = data.data.we;
			
		console.log('\nRing schedule for phone with id '+ data.data.id);
		
		if(wd.allDay){
			console.log('Blocked on weekdays')
		}else if(wd.times.length){
			console.log('Blocked on weekdays during the following times:');
			wd.times.forEach(function(time){
				console.log(time.startTime + '-' + time.endTime);
			});
		}else{
			console.log('Rings on weekdays');
		}
		
		if(we.allDay){
			console.log('Blocked on weekends')
		}else if(we.times.length){
			console.log('Blocked on weekends during the following times:');
			we.times.forEach(function(time){
				console.log(time.startTime + '-' + time.endTime);
			});
		}else{
			console.log('Rings on weekends');
		}

		
		// Display all forwarding phones again:
		client.settings('get', processResponse);
		
		
		// Check if the new phone is being used on another GV account
		client.phones('checkIllegalSharing',{id: phoneId}, function(error, response, data){
			if(error){
				return console.log(error);
			}
			if(data.needsReclaim){
				return console.log('\nThis phone is being used by another GV account and must be removed from that account before verifying it on a new account.')
			}
			
			// Verify the new phone by initiating a callback to it with a verification code
			client.phones('verify',{
				id: phoneId,
				type: newPhone.type, 
				number: newPhone.number,
				code: 25
			}, function(error, response, data){
				if(error){
					return console.log(error);
				}
				console.log('\nYou will receive a call on the forwarding number. Enter the two-digit verification code when prompted.');
			});
		});
	});
});