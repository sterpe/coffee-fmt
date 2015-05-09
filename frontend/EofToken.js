/**
 * EofToken.js
 * 
 * The generic end-of-file token.
 */

var Token = require('./Token').Token
, _ = require('lodash')
, EOF = require('./Constants').get("TYPE_EOF")
, extract
;

/**
 * Do nothing.  Do not consume any source characters.
 * @throws Error if an error occurred.
 */
extract = function () {
};

/**
 * Constructor.
 * @param source the source from where to fetch subsequent characters.
 * @throws Error if an error occurred.
 */
exports.EofToken = function (source) {
	return _.extend(Token(source), {
		extract: extract
		, type: EOF
	});
};
