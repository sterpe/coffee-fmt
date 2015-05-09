/**
 * CoffeeParserTD.js
 *
 * The top-down CoffeeScript parser.
 */

var Parser = require('../Parser').Parser
, PARSER_SUMMARY = require('../Constants').get("PARSER_SUMMARY")
, EOF = require('../Constants').get("TYPE_EOF")
, _ = require('lodash')
, parse
, getErrorCount
;

/**
 * Parse a CoffeeScript source program and generate the symbol table
 * and the intermediate code.
 */
parse = function () {
	var token = this.nextToken()
	, startTime = new Date().valueOf()
	;

	while (token.type !== EOF) {
		token = this.nextToken();
	}

	elapsedTime = (new Date().valueOf() - startTime)/1000;
	this.sendMessage({
		type: PARSER_SUMMARY
		, arguments: [
			token.lineNum
			, this.getErrorCount()
			, elapsedTime
		]
	});
};

/** 
 * Return the number of syntax errors found by the parser.
 * @return the error count.
 */
getErrorCount = function () {
	return 0;
};

/**
 * Constructor.
 * @param scanner the scanner to be used with this parser.
 */
exports.CoffeeParserTD = function (scanner) {
	return _.extend(new Parser(scanner), {
		parse: parse
		, getErrorCount: getErrorCount
	});
};
