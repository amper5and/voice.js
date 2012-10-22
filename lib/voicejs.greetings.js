var DEFAULTS = require('./voicejs.defaults.js');

module.exports = {
    get: {
        description: 'Retrieve GV settings, forwarding phones, groups, and greetings',
        path: '/settings/tab/settings',
        method: 'GET'
    },
	getAudio: {
		description: 'Get the mp3 audio of a greeting by greeting id',
		method: 'GET',
		encoding: null,
		path: function(options){
			return '/media/send_greeting/'+ options.id;
		},
		options: {
			id: {submit: false, demand: true, type: [Number]}
		}
	},
	new: { // responds with greeting id
		description: 'Create a new greeting by name, optionally specifying if it should be the default greeting',
		path: '/settings/editGreetings/',
		token: 'rnr',
		options: {
			a: { fixed: true, default: 'new'},
			name: { demand: true, type:[String]},
			default: { demand: false, type:[Boolean], name: 'setDefault', default: false}
		}
	},
	rename: {
		description: 'Rename a greeting by greeting id',
		path: '/settings/editGreetings/',
		token: 'rnr',
		options: {
			a: { fixed: true, default: 'rename'},
			name: { demand: true, type:[String]},
			id: {demand: true, type:[Number]}
		}
	},
	delete: {
		description: 'Delete a greeting by greeting id',
		path: '/settings/editGreetings',
		token: 'rnr',
		options: {
			a: { fixed: true, default: 'delete'},
			//name: { demand: true, type:[String]},
			id: {demand: true, type:[Number]}
		}
	},
	record: {
		description: 'Record a new greeting by specifying the greeting id and the number to receive a callback on to record the greeting',
		path: '/call/recordGreeting/',
		token: 'rnr',
		options: {
			id: {demand: true, type:[Number], name: 'greetingId'},
			number: { demand: true, type:[String], name: 'forwardingNumber'},
			type: { demand: false, type: [String], match: Object.keys(DEFAULTS.phoneTypes), 
				default: function(options){
					if(!!~options.number.indexOf('@')){
						return 'googletalk';
					}else{
						return 'work'; // this seems to work as a default
					}
				},
				handler: function(type){
					return { phoneType: DEFAULTS.phoneTypes[type]};
				}
			},
			subscriberNumber: { fixed: true, default: 'undefined'},
			remember: { fixed: true, default: '0'},
			outgoingNumber: { fixed: true, default: ''}
		}
	},
	cancelRecord: {
		description: 'Cancel the call to record a greeting',
		path: '/call/cancel/',
		token: 'rnr',
		options: {
			outgoingNumber: { fixed:true, default: ''},
			forwardingNumber: { fixed:true, default: ''},
			type: {fixed: true, default: 'RECORDING'}
		}
	}
};