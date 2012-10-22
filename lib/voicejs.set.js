// These are the various methods that can be used with Client.set() to change conversations
var util = require('util');

module.exports = {
	read:{
		description: 'Mark messages as read, by message id(s)',
		path: '/inbox/mark/',
		token: 'rnr',
		options: { 
			id: {demand: true, type: [String, Array], name: 'messages'},
			read: {fixed: true, default: '1'}
		}
	},
	unread: {
		description: 'Mark messages as unread, by message id(s)',
		path: '/inbox/mark/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			read: {fixed: true, default: '0' }
		}
	},
	toggleTrash: {
		description: 'Move messages to the trash if they are in the inbox OR to the inbox if they are in the trash, by message id(s)',
		path: '/inbox/deleteMessages/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			trash: {fixed: true, default: '1'}
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
	archive: {
		description: 'Archive messages, by message id(s)',
		path: '/inbox/archiveMessages/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			archive: {fixed: true, default: '1'}
		}
	},
	unarchive: {
		description: 'Unarchive messages, moving them to the inbox, by message id(s)',
		path: '/inbox/archiveMessages/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			archive: {fixed: true, default: '0'}
		}
	},
	star: {
		description: 'Star messages, by message id(s)',
		path: '/inbox/star/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			star: {fixed: true, default: '1'}
		}
	},
	unstar: {
		description: 'Unstar messages, by message id(s)',
		path: '/inbox/star/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			star: {fixed: true, default: '0'}
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
	spam: {
		description: 'Label messages as spam, by message id(s)',
		path: '/inbox/spam/', 
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			spam: {fixed: true, default: '1'}
		}
	},
	unspam: {
		description: 'Remove spam label from messages, by message id(s)',
		path: '/inbox/spam/',
		token: 'rnr',
		options: {
			id: {demand: true, type: [String, Array], name: 'messages'},
			spam: {fixed: true, default: '0'}
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
					toAddress: util.isArray(email) ? email.join(',') : email
				};
			}},
			subject: { demand: false, type: [String], name: 'subject', default: ''},
			body: { demand: false, type: [String], name:'body', default: ''},
			link: { demand: false, type: [Boolean], name: 'includeLink', default: false}
		}
	}
};