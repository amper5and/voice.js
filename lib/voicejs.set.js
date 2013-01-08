// These are the various methods that can be used with Client.set() to change conversations

var unique = function(arr){
	return arr.filter(function(a,b,c){return b==c.indexOf(a)})
};

module.exports = {
	mark: {
		description: 'Mark/unmark one or more messages as read, starred, spam, archive, toggleTrash',
		token: 'gvx',
		options: {
			v: {fixed: true, default: '10'},
			m: {fixed: true, default: 'mod'},
			id: {demand: true, type: [String, Array], handler: function(ids){ //remove duplicates from array
				return {id: Array.isArray(ids) ? unique(ids).join(',') : ids }
			}},
			star: {type: [Boolean], handler: function(enable, options, parameters){
				var which = enable ? 'add' : 'rm';
				parameters[which] = parameters[which] || '';
				parameters[which] += 'starred,';
			}},
			read: {type: [Boolean], handler: function(enable, options, parameters){
				var which = enable ? 'rm' : 'add';
				parameters[which] = parameters[which] || '';
				parameters[which] += 'unread,';
			}},
			archive: {type: [Boolean], handler: function(enable, options, parameters){
				var which = enable ? 'rm' : 'add';
				parameters[which] = parameters[which] || '';
				parameters[which] += 'inbox,';
			}},
			spam: {type: [Boolean], handler: function(enable, options, parameters){
				var which = enable ? 'add' : 'rm';
				parameters[which] = parameters[which] || '';
				parameters[which] += 'spam,';
			}},
			toggleTrash: {type: [Boolean], handler: function(enable, options, parameters){
				if(enable){
					parameters['add'] = parameters['add'] || '';
					parameters['add'] += 'trash,';
				}
			}}
		}
	},
	deleteForever: {
		description: 'Delete messages, by message id(s)',
		path: '/inbox/deleteForeverMessages/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			trash: {fixed: true, default: '1'}
		}
	},
	block: {
		description: 'Block the number associated with messages, by message id(s)',
		path: '/inbox/block/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			blocked: {fixed: true, default: '1'}
		}
	},
	unblock: {
		description: 'Block the number associated with messages, by message id(s)',
		path: '/inbox/block/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			blocked: {fixed: true, default: '0'}
		}
	},
	donate: {
		description: 'Donate the message transcript to GV, by message id(s)',
		path: '/inbox/donate/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			donate: {fixed: true, default: '1'}
		}
	},
	undonate: {
		description: 'Revoke a donated message transcript from GV, by message id(s)',
		path: '/inbox/donate/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			donate: {fixed: true, default: '0'}
		}
	},
	saveNote:{
		description: 'Save a note for a message, by message id',
		path: '/inbox/savenote/',
		token: 'rnr',
		options: { 
			id: {demand: true, type: [String], name: 'id'},
			note: {demand: true, type: [String], name: 'note'}
		}
	},
	deleteNote: {
		description: 'Delete a note for a message, by message id',
		path: '/inbox/deletenote/',
		token: 'rnr',
		options: { 
			id: {demand: true, type: [String], name: 'id'},
		}
	},
	saveTranscript: {
		description: 'Save a new transcript for a message, by message id',
		path: '/inbox/saveTranscript/',
		token: 'rnr',
		options: { 
			id: {demand: true, type: [String], name: 'callId'},
			transcript: {demand: true, type: [String], name: 'trans'}
		}
	},
	restoreTranscript: {
		description: 'Restore the GV transcript for a message, by message id',
		path: '/inbox/restoreTranscript/',
		token: 'rnr',
		options: { 
			id: {demand: true, type: [String], name: 'callId'},
		}
	},
	forward: {
		description: 'Send a voicemail to someone by email, by message id',
		path: '/inbox/reply/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String], name: 'id'},
			email: { demand: true, type: [String, Array], handler: function(email){ 
				return {
					toAddress: Array.isArray(email) ? email.join(',') : email
				};
			}},
			subject: { demand: false, type: [String], name: 'subject', default: ''},
			body: { demand: false, type: [String], name:'body', default: ''},
			link: { demand: false, type: [Boolean], name: 'includeLink', default: false}
		}
	}
};