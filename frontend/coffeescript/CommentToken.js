/**
 * CommentToken.js
 *
 * A token that represents a Coffeescript comment line.
 */

var Token = require('../Token').Token
, ERROR = require('../../constants/TokenTypes').get("ERROR")
, COMMENT = require('../../constants/TokenTypes').get("COMMENT")
, BLOCK_COMMENT = require('../../constants/TokenTypes').get("BLOCK_COMMENT")
, EOL = require('../../constants').get("EOL")
, extract
, extractComment
;

extract = function () {
	this.text = this.extractComment();
	if (this.type === COMMENT) {
		this.value = /^#\s*(.*)\s*$/.exec(this.text)[1];
	} else {
		this.value = /^\#{3}\s*((.|\n)*\S)\s*\#{3}$/.exec(this.text)[1];
	}
};

extractComment = function () {
	var currentChar = this.currentChar()
	, s = ""
	;
	if (!(/\#/.test(currentChar))) {
		this.type = ERROR;
		this.value = null;
		return null;
	}
	while (currentChar !== EOL && (!/\#{3}/.test(s))) {
		s += currentChar;
		currentChar = this.nextChar();
	}
	if (/\#{3}/.test(s)) {
		s = "";
		this.type = BLOCK_COMMENT;
		while (!/.*#{3}$/.test(s)) {
			s += currentChar;
			if (currentChar === EOL) {
				this.nextChar(); //Skip the DUMMY_CHAR
			}
			currentChar = this.nextChar();
		}
		s = "###" + s;
	}
	return s;
};
exports.CommentToken = function (source) {
	return Token(source, {
		extract: extract
		, extractComment: extractComment
		, type: COMMENT
	});
};
