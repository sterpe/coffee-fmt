/**
 * StringToken.js
 *
 * A token that represents a Coffeescript string.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, STRING = require('../../constants/TokenTypes').get("STRING")
, BLOCK_STRING = require('../../constants/TokenTypes').get("BLOCK_STRING")
, EOL = require('../../constants').get("EOL")
, extract
, extractString
;

extract = function () {
	this.text = this.extractString();
	if (this.text) {
	this.value = this.text.replace(/\\\n/g, ""); // Remove multi-line escapes from the value.
	this.value = this.value.slice(1, -1); //Remove leading and trailing quote.
	}
	this.nextChar();
};

extractString = function () {
	var currentChar = this.currentChar()
	, s = ""
	, S = []
	, escaped
	, wasEscaped
	, quote
	;
	if (!(/(?:'|")/.test(currentChar))) {
		this.type = ERROR;
		this.value = null;
		return null;
	}
	quote = currentChar;
	S.push(quote);
	escaped = false;
	s += quote;
	currentChar = this.nextChar();
	while (currentChar !== quote || (currentChar === quote && escaped)) {
		wasEscaped = escaped;
		s += currentChar;
		if (escaped === true) {
			escaped = false;
		}
		if (currentChar === "\\" && !wasEscaped) {
			escaped = true;
		}
		if (currentChar === EOL) {
			if (!wasEscaped) {
				this.type = ERROR;
				this.value = "Unterminated string literal"
				return null;
			}
			this.nextChar(); // Move past the DUMMY_CHAR...
		}
		currentChar = this.nextChar();
	}
	console.log('s', currentChar);
	S.pop();
	s += quote;
	this.quoteType = quote;
	return s;
};

exports.StringToken = function (source) {
	return Token(source, {
		extract: extract
		, extractString: extractString
		, type: STRING
	});
};
