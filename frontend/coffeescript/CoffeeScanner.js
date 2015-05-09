/**
 * CoffeeScanner.js
 * 
 * The CoffeeScript scanner.
 */

var Scanner = require('../Scanner').Scanner
, Token = require('../Token').Token
, EofToken = require('../EofToken').EofToken
, EOF = require('../Constants').get("EOF")
, _ = require('lodash')
, extractToken
;

extractToken = function () {
	var token
	, currentChar
	;

	currentChar = this.currentChar();
	if (currentChar === EOF) {
		token = new EofToken(this.source);
	} else {
		token = new Token(this.source);
	}

	return token;
};

/**
 * Constructor.
 * @param source the source to be used with this scanner.
 */
exports.CoffeeScanner = function (source) {
	return _.extend(Scanner(source), {
		extractToken: extractToken
	});
};
