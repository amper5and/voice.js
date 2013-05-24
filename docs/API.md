voice.js API
============
version 0.1.4


This document is a work-in-progress. For clarity on methods that don't have documentation, check the `examples/` folder to see if any of the examples demonstrate usage.

## Update 4/16/2013:
Google has changed many of it's responses. Many of the examples in the /examples folder need to be updated to account for these changes. When all else fails, look at the raw responses to determine how the data is returned.


## Callbacks
Unless otherwise specified, all callbacks are of the following form: Function( error, response, data )

* error: an instance of GoogleVoiceError, containing `code`, `message`, and optionally `details` properties.
* response: the response object from the `require` module, containing information about the http request and response
* data: The returned data. Most often an *object*, unless it was impossible to parse the response. This is usually the *raw html* page body when the http status code is 500. This is *binary* audio data for audio requests.

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
voice.js uses three different authentication tokens when communicating with the Google Voice service, as discussed in `TOKENS.md`. Not every token is needed for every request. voice.js will know which token is needed and will make sure it gets it before the request. If a request fails, voice.js will try obtaining a new token and repeating the request once before returning an error.

Three token-retrieval methods are provided if you want to retrieve the tokens yourself. These three methods issue http requests to get the most up-to-date token(s) from Google. Because voice.js handles token-retrieval internally, it is usually unnecessary to use these low-level methods. 

#### client.auth( function( error, token ){} )
Retrieves the 'auth' authentication token from Google.

#### client.rnr( function( error, token ){} )
Retrieves the 'rnr' authentication token from Google.
	
#### client.gvx( function( error, token ){} )
Retrieves the 'gvx' authentication token from Google.

#### client.getTokens()
Returns an object containing the current authentication tokens. Note that this does not issue requests to Google. It only returns the currently-retrieved tokens i.e. previously retrieved internally by voice.js or by manual calls to `client.auth()`, `client.rnr()`, or `client.gvx()` (see above).


## Events

#### client.on( 'status', function( status ){} )
Fires when there is an updated account status in a response. `status` is an object containing various account settings, including unread counts. See `examples/updates.js` for usage.

#### client.on( tokenName , function( token ){} )
Fires when a NEW or CHANGED token is retrieved. `tokenName` can be 'auth', 'gvx', or 'rnr'. See `examples/tokens.js` for example usage.


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

UPDATE: As of 04/2013, Google does not return a `conversation_id` property. This method will be left in the current version of voice.js, but if Google continues to not supply the id, it may be removed or changed in future version of voice.js

Send an sms to one recipient and get the conversation id in the response. Response has `send_sms_response.conversation_id` property with the conversation id.

* to: String, required - The outgoing phone number
* text: String, optional - The text message

#### client.altsms( { to: to, text: text }, callback )
Send an sms to one or more recipients, without getting the conversation id in the response.

* to: String or Array, required - The outgoing phone number(s)
* text: String, optional - The text message


## Get updated counts
#### client.getCounts( function(error, labels){} )
Gets the updated read/unread count for each label. `labels` is an Array with the standard Google Voice labels. Each label has `unread_count`, `total_count`, and `last_modified_timestamp` properties. See `examples/updates.js` for example.


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
The following commands allow you to manipulate conversations. See `examples/star.js` for examples. There are different forms for this method, depending on `command`:

#### client.set( 'mark', options, callback )
Mark/unmark one or more conversations as `read`, `starred`, `spam`, or `archived`. Optionally, `toggle trash` on a conversation. 

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
Forward voicemails and recorded calls to one or more email recipients. See `examples/forward.js` for examples.

* id: String, required - The voicemail or recording conversation id
* email: String or Array, required - The email(s) to forward to
* subject: String, optional, default `' '` - Email subject
* body: String, optional, default `' '` - Email body
* link: Boolean, optional, default `false` - Whether to include a link to audio and a copy of the transcript.


## Settings: client.settings(command, options, callback)
The following methods allow you to get and edit various GV settings. See `examples/settings.js` for examples. 

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
* doNotDisturbExpiration: Javascript Date object - set an expiration date for Do Not Disturb (see below)
* pin: String - the PIN to access your voicemail
* inCallOptions: Boolean - Enable in-call options, such as pressing 4 to record or * to switch to another phone
* askForName: Boolean - Callers are requested to speak their name before being connected
* directConnect: Boolean - When a forwarding phone is answered, callers are connected directly without a menu being offered to you.
* useGoogleVoiceNumberAsIncomingCallerId: Boolean - Whether to display your GV number for incoming calls on forwarding phones or the caller's number
* useGoogleVoiceNumberAsOutgoingCallerId: Boolean - Whether to display your GV number for outgoing calls or your forwarding phone's number


## Do Not Disturb Status
See `examples/doNotDisturb.js` for further explanations on how to get/set DND status.

#### client.settings( 'getDnd', callback )
Response has `enabled` and `expiration` properties that indicate if DND is enabled and when it is going to expire.

#### client.settings( 'disableDnd', callback )
Turn off DND.

#### client.settings( 'enableDnd', callback )
Turns on Do Not Disturb without an expiration date.

#### client.settings( 'set', { doNotDisturbExpiration: date }, callback )
Turns on DND with an expiration date.

* date: Javascript Date object - The date and time when DND should be automatically disabled.


## Forwarding phones: client.phones(command,options,callback)
See `examples/phones.js` for information on how to retrieve and manipulate forwarding phones.

#### client.phones( 'get', callback )
The response has `phones` and `phoneList` properties that contain information on the forwarding phones on the GV account.

#### client.phones( command, { id: id }, callback )
Get/set various settings of a forwarding phone.

* command: String, required - one of the following strings:
	* 'enable' - enable the forwarding phone
	* 'disable' - disable the forwarding phone
	* 'enableSMS' - enable SMS forwarding to the phone
	* 'disableSMS' - disable SMS forwarding to the phone
	* 'enableVoicemailNotifyBySMS' - enable voicemail forwarding to the phone via SMS
	* 'disableVoicemailNotifyBySMS' - disable voicemail forwarding to the phone via SMS
	* 'delete' - Delete the forwarding phone
	* 'checkIfVerified' - Check if the forwarding phone has been verified
	* 'checkIllegalSharing' - Check if a forwarding phone is being used on another GV account (`needsReclaim` property in the response)
* id: Number, required - One of your forwarding phone ids

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
Get the number that must be dialed on the forwarding phone to enable voicemail diversion to GV. Found in the `diversionNum` property of the response.

#### client.phones( 'disableVoicemail', { id: id, carrier: carrier }, callback )
Get the number that must be dialed on the forwarding phone to disable voicemail diversion to GV. Found in the `diversionNum` property of the response.

* id: Number, required - A forwarding phone id
* carrier: String, required - The forwarding phone carrier. This is a string like "VERIZON" or "ATT." The carrier of a particular forwarding phone can be retrieved in one of two ways:
	* As the `.carrier` property of the forwarding phone when retrieved using `client.phones('get')` (see above)
	* As the `.carrier` property of the response when retrieved using `client.phones('checkCarrier',...)` (see above)


## Contacts
See `examples/contact.js` for examples and clarification.

#### client.contacts( 'get', callback )
Get all GV contacts. Response has two lists: `contacts`, which lists contacts by contact id, and `contactPhones` which lists contacts by phone number.

#### client.contacts( 'new', options, callback )
Create a new contact, optionally first checking if the contact will clash with existing contacts. `options` has the following properties:

* name: String, required - the contact name
* number: String, required - the phone number
* type: String, required - the phone type. Must be one of these four capitalized strings: 'HOME', 'MOBILE', or 'WORK'
* check: Boolean, optional, default `false` - whether to first check if the contact will clash with an existing contact. Setting this to `true` does NOT add the contact. See *Merging Contacts* below.
* focusId: String, optional - this is what GV calls a "focus id", which is a special id for an existing contact with which the new contact will be merged. See *Merging Contacts* below.

##### Merging contacts
When `check` is `true` the response from GV will have a `matchingContacts` property which is an array of contacts that might match the contact you are trying to add. Each contact in `matchingContacts` has a `detail` and `focusId` property. The `focusId` can be used to merge a new contact with an old one. When a valid `focusId` is passed to `client.contacts('new'...)` the new contact will be merged with the contact corresponding to the focus id. See `examples/contacts.js` for a detailed example.


#### client.contacts( 'getSettings', { id: id }, callback )
Retrieve the GV settings for a particular contact. It takes one property, `id`, which must be a valid contact id string as obtained using `client.contacts('get', callback)`. The response has the property `contactData` which contains the settings.

#### client.contacts( 'editSettings', options, callback )
Set GV settings for a particular contact. `options` takes the following properties:

* id: String, required - the contact id (retrieved with `client.contacts('get',...)`)
* groupId: Number, optional, default `0` - the group id this contact should belong to. Defaults to `0`, which is the built-in "All Contacts" group. 
* greetingId: Number, optional, default `0` - the greeting this contact should hear. See `client.greetings('get', ...)` for info on how to retrieve greetings. Defaults to `0`, which is the default GV greeting.
* disabledPhoneIds: Array, optional - an array of your forwarding numbers that should NOT ring for this contact. Phone ids must be numbers (see `client.phones('get',...)` for info on how to retrieve your forwarding phone ids)
* response: String, optional, default 'DEFAULT' - what should happen when the contact rings you. Must be one of these four capitalized strings: 'DEFAULT' (default response for the contact's group), 'SPAM' (treat as spam caller), 'BLOCK' (block the caller, by playing a 'number not in service' message), or 'VOICEMAIL' (send the contact directly to voicemail). 
* onRing: String, optional, default 'default' - What should happen when you pick up the phone to answer a call from this contact. Must be one of the following three strings: 'direct' (start talking right away), 'options' (be presented with options for answering the call or sending to voicemail), or 'default' (use the default response from the contact's group)

#### client.contacts( 'getBlockedMessage', callback )
Retrieve the audio that blocked callers will hear when calling your GV number. The response is in mp3 format.


## Google Voice name
#### client.name( 'get', callback )
Retrieve the audio of your name that callers hear when calling your GV number. The response is in mp3 format.

#### client.name( 'record' , { number: number }, callback )
Trigger a call from Google on a forwarding phone to record a new name. `number` is a string. You will receive a callback on the number with prompts to record your name.

#### client.name( 'cancel', callback )
Cancel the callback from Google to record a new name.


## Greetings
#### client.greetings( 'get', callback )
Retrieve all your greetings from GV. The response contains the `settings.greetings` property will a list of all greetings. Each greeting has a `name` and `id` property.

#### client.greetings( 'getAudio', { id: id },  callback )
Get the audio for a particular greeting. `id` is a required Number that is one of your greeting ids. The response is in mp3 format.

#### client.greetings( 'new', { name: name, default: default}, callback )
Create a new greeting. The options are:

* name: String, required - a name for the greeting
* default: Boolean, optional, default `false` - whether this should be the default greeting

#### client.greetings( 'rename', { id: id, name: name }, callback )
Rename an existing GV greeting. The options are:

* id: Number, required - the greeting id (see above)
* name: String, required - the new greeting name

#### client.greetings( 'delete', { id: id }, callback )
Delete an existing GV greeting. `id` is a number corresponding to one of your greeting ids (see above).


#### client.greetings( 'record', { id: id, number: number }, callback )
Trigger a call from Google on a forwarding phone to record a new message for an existing greeting. The options are:

* id: Number, required - the greeting id (see above)
* number: String, required - one of your forwarding phone numbers

#### client.greetings( 'cancelRecord', callback )
Cancel the call from Google to record a new greeting.


## Webcall widgets
Webcall widgets are Flash objects that you can place on your site for users to enter their number and call you directly. The following methods allow you to manipulate and create webcall widgets. See `examples/widgets.js` for examples and clarification of usage.

#### client.widgets( 'get', callback )
Retrieve your current webcall widgets. The response has the `settings.webCallButtons` Array which contains all your widgets. See `examples/widgets.js` for clarification on what each property of each widget means.

#### client.widgets( 'new', options, callback )
#### client.widgets( 'edit', options, callback )
#### client.widgets( 'delete', { id: id }, callback )
