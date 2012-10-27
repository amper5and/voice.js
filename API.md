voice.js API
============

## Callbacks
Unless otherwise specified, all callbacks are of the following form: Function( error, response, data )

* error: an instance of GoogleVoiceError, containing a `code`, `message`, and optionally `details`
* response: the response object from the require module, containing information about the http request and response
* data: The returned data. Most often an object, unless it was impossible to parse the response. This is usually the page body when the http status code is 500. This is binary audio data for audio requests.

All callbacks are optional.


## Initialization
#### client = new voicejs.Client({email: email, password: password, tokens: tokens})
Returns a new voice client instance.

* email: String, required - The GV email address
* password: String, required - The GV password
* tokens: Object, optional - An object containing authentication tokens. Can have the following properties:
	* auth: String, optional
	* rnr: String, optional
	* gvx: String, optional


## Authentication tokens
voice.js uses three different authentication tokens when communicating with the Google Voice service, as discussed in 'TOKENS'. Not every token is needed for every request. voice.js will know which token is needed and will make sure it gets it before the request. If a request fails, voice.js will try obtaining a new token and repeating the request once before returning an error.

Three token-retrieval methods are provided if you want to retrieve the tokens yourself.

#### client.getTokens()
Returns an object containing the current authentication tokens.

#### client.auth( function(error, token){} )
Retrieves the 'auth' authentication token.

#### client.rnr( function(error, token){} )
Retrieves the 'rnr' authentication token.
	
#### client.gvx( function(error, token){} )
Retrieves the 'gvx' authentication token.


## Calls

#### client.connect( { to: to, from: from }, callback )
Connects an outgoing number with a forwarding phone by dialing the forwarding phone, then dialing the outgoing number. 

* to: String, required: the outgoing number to call
* from: String, required: the forwarding number to use for the call (can be Google Talk)

#### client.call( { to: to, from: from }, callback )
Sets up and retrieves a dial-out number that can be used to make a call using the forwarding phone specified. Response has `call_through_response.access_number` property with the dial-out number.

* to: String, required: the outgoing number to call
* from: String, required: the forwarding number to use for the call (can be Google Talk)

#### client.sms( { to: to, text: text }, callback )
Send an sms to one recipient and get the conversation id in the response. Response has `send_sms_response.conversation_id` property with the conversation id.

* to: String, required - The outgoing phone number
* text: String, optional - The text message

#### client.altsms( { to: to, text: text }, callback )
Send an sms to one or more recipients, without getting the conversation id in the response.

* to: String or Array, required - The outgoing phone number(s)
* text: String, optional - The text message

## Get updated counts
#### client.getCounts( function(error, labels){} )
Gets the updated read/unread count for each label. `labels` is an Array with the standard Google Voice labels. Each label has `unread_count`, `total_count`, and `last_modified_timestamp` properties.


## Get conversations: client.get(command, options, callback)

#### client.get( label, options, callback )
Retrieve conversations filed under the standard GV labels. Response has `conversations_response.conversation` property with the conversations.

* label: String, required - One of the standard GV labels: ['all', 'inbox', 'missed', 'placed', 'received', 'recorded', 'sms', 'spam', 'starred', 'trash', 'unread', 'voicemail']
* options: Object, optional
	* start: Number, optional - Index of the first conversation to retrieve. Indexing starts with 1. 
	* limit: Number, optional - The maximum number of conversations to retrieve. Setting this to `Infinity` retrieves all conversations.

#### client.get( 'byId', { id: id }, callback )
Retrieve conversation(s) by conversation id. Response has `conversations_response.conversation` property with the conversation(s).

* id: String or Array, required - The conversation(s) to retrieve


## Download audio
#### client.getAudio({ id: id, format: format }, callback )
Download the audio of a recorded or voicemail message. The response is the binary audio data.

* id: String, required - the id of a RECORDED or VOICEMAIL message. If this is for any other type of message, an error will occur.
* format: String, required - The audio format: 'mp3' or 'ogg'


## Edit conversations: client.set(command, options, callback)

#### client.set( 'mark', options, callback )
Mark/unmark one or more conversations as read, starred, spam, or archived. Optionally, toggle trash on a conversation. 

`options` takes the following parameters:

* id: String or Array, required - The conversation(s) to manipulate
* star: Boolean, optional - star/unstar the conversation(s)
* read: Boolean, optional - mark the conversation(s) as read/unread
* archive: Boolean, optional - archive/unarchive the conversation(s)
* spam: Boolean, optional - mark/unmark the conversation(s) as spam
* toggleTrash: Boolean, optional - if the conversation(s) are in the trash, remove them from the trash. If they are elsewhere, move them to the trash. (There is currently no way to force the conversation(s) to go one way or the other. )

#### client.set( command, { id: id }, callback )
Manipulate one or more conversations.

* command: String, required - One of:
	* 'block'/'unblock' - block/unblock the caller associated with the conversation
	* 'donate'/'undonate' - donate/undonate the transcript of the conversation to Google to improve their transcription services
	* 'deleteForever' - delete the conversation permanently
* id: String or Array, required - The conversation(s) to manipulate

#### client.set( 'saveNote', { id: id, note: note }, callback )
Add a note to a conversation.

* id: String, required - The conversation id (Cannot be an Array)
* note: String, required - The note to add

#### client.set( 'deleteNote', { id: id }, callback )
Delete a note from a conversation.

* id: String, required - The conversation id

#### client.set( 'saveTranscript', { id: id, transcript: transcript }, callback )
Update the transcript for a voicemail conversation.

* id: String, required - The voicemail conversation id
* transcript: String, required - The new transcript

#### client.set( 'restoreTranscript', { id: id }, callback )
Restore Google's original transcript for a voicemail conversation

* id: String, required - The voicemail conversation id


## Email calls

#### client.forward( { id: id, email: email, subject: subject, body: body, link: link }, callback )
Forward voicemails and recorded calls to one or more email recipients.

* id: String, required - The voicemail or recording conversation id
* email: String or Array - The email(s) to forward to
* subject: String, optional, default `' '` - Email subject
* body: String, optional, default `' '` - Email body
* link: Boolean, optional, default `false` - Whether to include a link to audio and a copy of the transcript.


## Settings: client.settings(command, options, callback)

#### client.settings( 'get', callback )
Retrieve Google Voice settings, forwarding phones, groups, and greetings. See `examples/settings.js` for information on how to process the response.

#### client.settings( 'set', options, callback )
Set various GV settings. Some settings can be set individually without affecting other settings. Editing some settings may affect other settings. In the list below, settings that should be set together are marked with a '+' sign. See `examples/settings.js` for examples on how to edit settings. `options` can have the following optional parameters:

* missedToInbox: Boolean - Place missed calls in your GV inbox
* + missedToEmail: Boolean - Forward missed calls to email
* + smsToEmail: Boolean - Forward texts to email
* + smsToEmailSubject: Boolean - Include the text in the subject line of the forwarded email.
* + voicemailToEmail: Boolean - Forward voicemails to email
* + voicemailToPhones: Array - Forwarding phone(s) that will receive voicemail notifications via SMS. This can also be set individually for each phone using client.phones('enableVoicemailNotifyBySMS'). See below.
* + email: String - One of your verified emails that will receive forwarded texts, voicemails, or missed calls
* greetingId: Number - the default greeting id. Must be one of your greeting ids.
* showTranscripts: Boolean
* filterGlobalSpam: Boolean
* doNotDisturb: Boolean - enable/disable Do Not Disturb (see below)
* doNotDisturbExpiration: Date - set an expiration date for Do Not Disturb (see below)
* pin: String - the PIN to access your voicemail
* inCallOptions: Boolean - Enable in-call options, such as pressing 4 to record or * to switch to another phone
* askForName: Boolean - Callers are requested to speak their name before being connected
* directConnect: Boolean - When a forwarding phone is answered, callers are connected directly without a menu being offered to you.
* useGoogleVoiceNumberAsIncomingCallerId: Boolean - Whether to display your GV number for incoming calls on forwarding phones or the caller's number
* useGoogleVoiceNumberAsOutgoingCallerId: Boolean - Whether to display your GV number for outgoing calls or your forwarding phone's number


## Do Not Disturb Status
See `examples/doNotDisturb.js` for further explanations on how to get/set DND status

#### client.settings( 'getDnd', callback )
Response has `enabled` and `expiration` properties that indicate if DND is enabled and when it is going to expire.

#### client.settings( 'disableDnd', callback )
Turn off DND.

#### client.settings( 'enableDnd', callback )
Turns on Do Not Disturb without an expiration date.

#### client.settings( 'set', { doNotDisturbExpiration: date }, callback )
Turns on DND with an expiration date.

* date: Date - The date and time when DND will be disabled.


## Forwarding phones: client.phones(command,options,callback)
See `examples/phones.js` for information on how to retrieve and manipulate forwarding phones.

#### client.phones( 'get', callback )
The response has `phones` and `phoneList` properties that contain information on the forwarding phones on the GV account.

#### client.phones( command, { id: id }, callback )
Get/set various settings of a forwarding phone.

* command: String, required - one of:
	* 'enable'/'disable'
	* 'enableSMS'/'disableSMS' - enable/disable SMS forwarding to the phone
	* 'enableVoicemailNotifyBySMS'/'disableVoicemailNotifyBySMS' - enable/disable voicemail forwarding to the phone via SMS
	* 'delete' - Delete the forwarding phone
	* 'checkIfVerified' - Check if the forwarding phone has been verified
	* 'checkIllegalSharing' - Check if a forwarding phone is being used on another GV account (`needsReclaim` property in the response)
* id: Number - One of your forwarding phone ids

#### client.phones( 'new', options, callback )

#### client.phones( 'edit', options, callback )

#### client.phones( 'verify', { number: number, code: code }, callback )
Verify a forwarding phone by specifying a two-digit code to be entered on the forwarding number once it receives a call from Google

* number: String, required - The forwarding phone number
* code: String, required - A TWO-DIGIT number that will be entered on the forwarding phone

#### client.phones( 'checkCarrier', { id: id, number: number }, callback )
Get the carrier of a forwarding phone. Found in the `carrier` property of the response.

* id: Number, required - One of your forwarding phone ids
* number: String, required - The forwarding phone number

#### client.phones( 'enableVoicemail', { id: id, carrier: carrier }, callback )
#### client.phones( 'disableVoicemail', { id: id, carrier: carrier }, callback )
Get the number that must be dialed on the forwarding phone to enable/disable voicemail diversion to GV. Found in the `diversionNum` property of the response.

* id: Number, required - A forwarding phone id
* carrier: String, required - The forwarding phone carrier


## Contacts
#### client.contacts( 'get', callback )
#### client.contacts( 'new', options, callback )
#### client.contacts( 'getSettings', callback )
#### client.contacts( 'editSettings', options, callback )
#### client.contacts( 'getBlockedMessage', callback )


## Google Voice name
#### client.name( 'get', callback )
#### client.name( 'record, { number: number }, callback )
#### client.name( 'cancel', callback )


## Greetings
#### client.greetings( 'get', callback )
#### client.greetings( 'getAudio', callback )
#### client.greetings( 'new', { name: name, default: default}, callback )
#### client.greetings( 'rename', { id: id, name: name }, callback )
#### client.greetings( 'delete', { id: id }, callback )
#### client.greetings( 'record', { id: id, number: number }, callback )
#### client.greetings( 'cancelRecord', callback )


## Webcall widgets
#### client.widgets( 'get', callback )
#### client.widgets( 'new', options, callback )
#### client.widgets( 'edit', options, callback )
#### client.widgets( 'delete', { id: id }, callback )

