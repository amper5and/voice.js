var fs = require('fs');
var voicejs = require('../voice.js');

var client = new voicejs.Client({
    email: process.argv[2] || 'email@gmail.com',
    password: process.argv[3] || 'password',
    tokens: require('./tokens.json')
});

function markAllAsRead(conversations){
    conversations.forEach(function(convo, index){
        client.set('mark', {id: convo.conversation.id, read:true}, 
            function(error, response, data){
                if (error) {
                    return console.log(error);
                }
                console.log('Marked %s as read state.', convo.conversation.id);
            }
        );
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