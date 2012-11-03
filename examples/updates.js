var voicejs = require('../voice.js');

var client = new voicejs.Client({
	email: process.argv[2] || 'email@gmail.com',
	password: process.argv[3] || 'password',
	tokens: require('./tokens.json')
});

// beautify
String.prototype.padRight = function (length, character) { 
	return this + new Array(length - this.length + 1).join(character || ' '); 
};



// Listen for the 'status' event, which is fired every time a GV response 
// has an updated account status (found in the 'account_status' property). 
// This usually happens with all get requests.

client.on('status', function(status){
	console.log('UPDATED ACCOUNT STATUS:')
	console.log(status);
});


// Manually get latest conversation counts
client.getCounts(function(error, labels){
	
	if(error){ return console.log(error); }
	
	console.log('\n\nLatest counts: unread/total (updated date)')
	labels.forEach(function(label){
		console.log('%s %s (%s)', 
			label.label.padRight(12), 
			(label.unread_count + '/' + label.total_count).padRight(8), 
			new Date(label.last_modified_timestamp).toISOString().replace(/[TZ]/g,' ').substr(0,16)
		);
	});
});