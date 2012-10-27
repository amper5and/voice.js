voice.js Authentication Tokens
==============================

### Introduction
voice.js uses three different tokens to authenticate with Google Voice: `auth`, `gvx`, and `rnr` tokens. All operations require an `auth` token. The type of additional token (if any) needed for each request may be different.

### Token retrieval
Tokens can be retrieved using the `client.auth()`, `client.rnr()`, and `client.gvx()` methods. To get a `gvx` or `rnr` token, an `auth` token is needed. If an `auth` token is not available or is invalid, `client.rnr()` and `client.gvx()` will automatically try to get one.


### How tokens are issued
An `rnr` token is issued independently, that is, its value does not depend on the `auth` token used to retrieve it. It is always the same for the same user.

A `gvx` token is issued as a `gvx`/`auth` token pair; that is, the value of the `gvx` token depends on the `auth` token used to retrieve it. Everytime a `gvx` token is requested with a valid `auth` token, a new `auth` token is issued along with the `gvx` token. However, when this new `auth` token is used to retrieve another `gvx` token, the retrieved `gvx` token is identical to the one issued with that `auth` token. 

The short of it is:

 1. An `auth` token is valid with only ONE specific `gvx` token
 2. A `gvx` token is valid with MULTIPLE `auth` tokens (each of which may be used to retrieve that `gvx` token)


### Token events
As tokens are obtained from Google Voice, the client emits the 'auth', 'rnr', and 'gvx' events with the new tokens.
Notice that the 'auth' event fires twice. That's because an `auth` token is obtained in two cases:

1. when the auth token is retrieved
2. when the gvx token is retrieved (because gvx tokens are issued with a new auth token)


### Storing tokens
Downloaded tokens can be retrieved (for storage) from the client using `client.getTokens()`. When exiting, save the tokens so they don't have to be re-acquired next time.

* `rnr` tokens are valid indefinitely 
* `gvx` tokens appear to be valid for a year
* `auth` tokens are valid for unknown period of time. 

At the time of this writing, I have been able to use the same tokens for two weeks. I will keep testing the upper limit of this timeframe and will update this document to reflect the results.

To store tokens:

    var fs = require('fs');
    var tokens = client.getTokens();
    fs.writeFileSync('./tokens.json', JSON.stringify(tokens) );


Tokens can then be loaded from file using:

    var tokens = require('./tokens.json')
	var client = new voicejs.Client({password: password, email: email, tokens: tokens})
