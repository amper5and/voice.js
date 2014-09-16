var fs = require('fs');
var voicejs = require('../voice.js');

var client = new voicejs.Client({
    email: process.argv[2] || 'email@gmail.com',
    password: process.argv[3] || 'password',
    tokens: require('./tokens.json')
});

function markAllAsRead(conversations){
    var messageIds = [];
    // constructing a list of message ids
    for(var c in conversations) {
        messageIds.push(conversations[c].conversation.id);
    }
    // marking all the messages as read state
    client.set('mark', {id:messageIds, read:true}, function(error, response, data){
        if (error) {
            return console.log(error);
        }
        console.log('Successfully mark all unread messages as read');
    });
}

client.get('unread', {limit: Infinity}, function(error, response, data) {
    if (error) {
        return console.log(error);
    }
    if(!data || !data.conversations_response || 
        !data.conversations_response.conversationgroup){ 
        return console.log('No conversations.');
    }
    markAllAsRead(data.conversations_response.conversationgroup);
});