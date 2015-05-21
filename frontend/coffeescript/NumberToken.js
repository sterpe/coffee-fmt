/**
 * NumberToken.js
 * The Coffeescript number token.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, NUMBER = require('../../constants/TokenTypes').get("NUMBER")
, extract
, extractNumber
;

extractNumber = function () {
	var currentChar = this.currentChar()
	, s = ""
	;

	while (/^\d+(?:\.\d+)?(?:(?:e|E)(?:\+|\-)?\d*)?$/.test(s + currentChar)) {
//	while (/^\d\d*(?:\.\d+)?$/.test(s + currentChar)) {
//	while (/^\d(?:x)?\d*$/.test(s + currentChar)) {
		s += currentChar;
		currentChar = this.nextChar();
		if (/^[\.]/.test(currentChar)) {
			if (/^\d/.test(this.peekChar())) {
				s += currentChar;
				currentChar = this.nextChar();
			}
		}
	}

	return s;
};
/**
 * Extract a Coffeescript number token from the source.
 * @throws Error if an error occurred.
 */
extract = function () {
	this.text = this.extractNumber();
	this.value = this.text;
};



exports.NumberToken = function (source) {
	return Token(source, {
		extract: extract
		, extractNumber: extractNumber
		, type: NUMBER
	});
};
