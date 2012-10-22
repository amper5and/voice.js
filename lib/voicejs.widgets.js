module.exports = {
    get: {
        description: 'Retrieve GV settings, forwarding phones, groups, and greetings',
        path: '/settings/tab/settings',
        method: 'GET'
	},
    new: {
        description: 'Create a new call widget',
        path: '/settings/editWebCallButton/',
        token: 'rnr',
        options:{
            id: {fixed:true, default: 0},
            name: {demand: true, type:[String]},
            disabled: {type:[Boolean]},
            type: {type:[Number], match: [0,1], default: 0}, //0=normal widget, 1=profile page widget
            style: {type:[Number], match: [0,1], default: 0},
            greetingId: {type:[Number], default: 0},
            directConnect: {type:[Boolean], default: false},
            disabledPhoneIds: {type:[Array], handler: function(ids){
				if(ids.length){
					return { disabledPhoneIds : ids.join(',')};
				}
            }}
        }
    },
    edit: {
        description: 'Edit a call widget',
        path: '/settings/editWebCallButton/',
        token: 'rnr',
        options:{
            // Note: Any optional parameters that are NOT passed here will be RESET to the defaults
            id: {demand: true, type:[String]}, // if the id doesn't match a current webcall widget id, a new one will be created
            name: {demand: true, type:[String]},
            disabled: {type:[Boolean]},
            type: {type:[Number], match: [0,1], default: 0}, //0=normal widget, 1=profile page widget
            style: {type:[Number], match: [0,1], default: 0},
            greetingId: {type:[Number], default:0},
            directConnect: {type:[Boolean]},
            disabledPhoneIds: {type:[Array], handler: function(ids){
                return { disabledPhoneIds : ids.join(',')};
            }}
        }
    },
    delete: {
        description: 'Delete a call widget',
        path: '/settings/deleteWebCallButton/',
        token: 'rnr',
        options: {
            id: {demand: true, type:[String]}
        }
    }
};