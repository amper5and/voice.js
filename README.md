voice.js 
========
version 1.0.0 (alpha)


## What is it?
It's the Google Voice library for [node.js](http://nodejs.org/).

It builds on and improves on [node-google-voice](https://github.com/amper5and/node-google-voice), the original node.js Google Voice library.

It currently allows you to:

* place calls
* send texts
* access and manipulate GV conversations
* access and manipulate GV forwarding phones
* access and manipulate GV settings
* access and manipulate GV contacts
* access and manipulate GV call groups
* access and manipulate GV greetings
* access and manipulate GV webcall widgets

## Dependencies

* [node.js](http://nodejs.org) 
* [googleclientlogin](https://github.com/Ajnasz/GoogleClientLogin)
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)
* [request](https://github.com/mikeal/request)

[npm](https://github.com/isaacs/npm) should take care of dependencies, but in case it fails to do so, try installing these modules (and *their* dependencies) independently.

## Installation
It's not on [npm](https://npmjs.org) yet. Once it's a little more stable, it'll be there.

For now, install by running `npm install` in the main voice.js directory. 

## API
The API documentation is forthcoming. In the meantime, see the examples folder to get started.

## License
MIT License. See LICENSE.

## Conclusion
Google does not have an official Google Voice API. Therefore, the nature of the requests and returned data can change without notice. It is unlikely to change often or soon, but I will make all efforts to keep up with the most current implementation. If you have any issues, please give me a shout, and I'll do my best to address them.