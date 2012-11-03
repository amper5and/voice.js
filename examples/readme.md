#### To use the examples:
Examples can be run in one of two ways:

##### Using tokens

1. First edit `tokens.js` with your Google Voice login details.
2. Run `tokens.js` from the `/examples` folder. It will save a `tokens.json` file in the `/examples` folder containing authentication tokens. `token.js` can be re-run as often as you like to get new authentication tokens
3. Now run the rest of the examples. They will use the `tokens.json` file for authentication.

##### Using login details
Alternatively, you can provide your login details on the command line by running an example using:

    node filename.js email password

#### Safeguards
Some examples have `return;` statements before chunks of code that will make permanent changes to your GV account. This is to protect you from making inadvertent changes. Review and edit the changes, then run the full example without the `return` statement;