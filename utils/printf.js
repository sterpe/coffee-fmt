var sprintf = require('sprintf-js').sprintf
, FORMATS = require('../constants/Formats')
, q = []
;

exports.printf = function () {
	var args = Array.prototype.slice.call(arguments)
	;

	// At the end of a line, the next SOURCE_LINE message is sent before the line's
	// final token.  Fix that here.
	if (args[0] === FORMATS.get("SOURCE_LINE_FORMAT")) {
		q.unshift({ lineNum: args[1], sprintf: sprintf.apply(sprintf, args) });
		return;
	}
	if (args[0] === FORMATS.get("TOKEN_FORMAT")) {
		if (q.length && q[q.length - 1].lineNum === args[2]) {
			console.log(q.pop().sprintf);
		}
	}
	return console.log(sprintf.apply(sprintf, args));
};
