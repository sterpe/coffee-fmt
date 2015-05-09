/**
 * Scanner.js
 *
 * A language-independent framework class.  This abstract scanner class 
 * will be implemented by language-specific subclasses.
 */

var nextToken
, extractToken
, currentChar
, nextChar
;

/**
 * Return next token from the source.
 * @return the next token.
 * @throws Exception if an error occurred.
 */
nextToken = function () {
	this.currentToken = this.extractToken();
	return this.currentToken;
};

/**
 * Do the actual work of extracting and returning the next token 
 * from the source.  Implemented by scanner subclasses.
 * @return the next token.
 * @throws Exception if an error occurred.
 */
extractToken = function () {
};

/**
 * Call the source's currentChar() method.
 * @return the current character from the source.
 * @throws Exception if an error occurred.
 */
currentChar = function () {
	return this.source.currentChar();
};

/**
 * Call the source's nextChar() method.
 * @return the next character from the source.
 * @throws Exception if an error occurred.
 */
nextChar = function () {
	return this.source.nextChar();
};

/**
 * Constructor.
 * @param source the source to be used with this scanner.
 */
exports.Scanner = function (source) {
	return {
		source: source
		, currentToken: null
		, nextToken: nextToken
		, extractToken: extractToken
		, currentChar: currentChar
		, nextChar: nextChar
	};
};
