/**
 * NumberToken.js
 * The Coffeescript number token.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, NUMBER = require('../../constants/TokenTypes').get("NUMBER")
, extract
, extractNumber
, extractUnsignedInteger
;

/**
 * Extract a Coffeescript number token from the source.
 * @throws Error if an error occurred.
 */
extract = function () {
	this.text = this.extractNumber();
	this.value = parseInt(this.text);
};

extractNumber = function () {
	var firstDigit = this.currentChar()
	, wholeDigits
	;
	wholeDigits = this.extractUnsignedInteger();
	
	return wholeDigits;
};

extractUnsignedInteger = function () {
	var currentChar = this.currentChar()
	, s = ""
	;
	if (!(/\d/.test(currentChar))) {
		this.type = ERROR;
		this.value = null;
		return null;
	}

	while (/\d/.test(currentChar)) {
		s += currentChar;
		currentChar = this.nextChar();
	}

	return s;
}

exports.NumberToken = function (source) {
	return Token(source, {
		extract: extract
		, extractNumber: extractNumber
		, extractUnsignedInteger: extractUnsignedInteger
		, type: NUMBER
	});
};
