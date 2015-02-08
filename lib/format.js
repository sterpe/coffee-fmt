var
 	coffeeScript	= require('coffee-script/lib/coffee-script/lexer')
,	INDENT		= "INDENT"
,	OUTDENT		= "OUTDENT"
,	TERMINATOR	= "TERMINATOR"
,	HERECOMMENT	= "HERECOMMENT"
,	LINECOMMENT	= "LINECOMMENT"

exports.format = function (code, options) {
	var
		lexer		= new coffeeScript.Lexer()
	,	tokens		= lexer.tokenize(code, {})
	,	lines		= lexer.clean(code).split("\n")
	,	out		= ""
	,	CURR_INDENT	= ""
	,	SPACE		= " "
	,	INDENT_SIZE	= (options.indent.length)
	,	token
	,	nextToken
	,	length
	, 	lastLine = 0
	, 	diff 
	,	i
	

	for (i = 0, length = tokens.length; i < length; i += 1) {
		token = tokens[i]
// 		if (token[2].first_line > lastLine) {
// 			diff = token[2].first_line - lastLine;
// 			for (j = 0; j < diff; j++) {
// 				if (lines[lastLine + j].indexOf('#') !== -1) {
// 					out += lines[lastLine + j] + "\n" + CURR_INDENT;
// 				} else {
// 					out += "\n" + CURR_INDENT;
// 				}
// 			}
// 		}
		if (token[0] === INDENT) {
			CURR_INDENT += options.indent;
			out += options.indent;
		} else if (token[0] === OUTDENT) {
			if (out.slice(-CURR_INDENT.length) === CURR_INDENT) {
				out = out.slice(0, -INDENT_SIZE);
			}
			CURR_INDENT = CURR_INDENT.slice(0, -INDENT_SIZE);
		} else if (token[0] === HERECOMMENT) {
			out += "###" + token[1] + "###";
		} else if (token[0] === LINECOMMENT) {
			out += token[1];
		} else if (token[0] === TERMINATOR) {
			out += token[1];
		} else if (token.generated) {
		} else {
			out += token[1]
		}
		if (token.spaced) { out += SPACE }
		if (token[1] === "->") {
		}
		if (token.newLine) {
				out += (options.newLine + CURR_INDENT)
		}
		if (token[0] === TERMINATOR) { out += CURR_INDENT }
	}
	lines = lines.map(function (line, index) {
		return line.replace(/\s*/g, "");
	});
	out = out.split("\n");
	i = 0;
	out.forEach(function (l, index) {
		var line = l.replace(/\s*/g, "");
		if (!line) { return; }
		while (lines[i] !== line) {
			i++;
		}
		lines[i] = l;
	});
	lines = lines.join("\n");
	if (lines[lines.length - 1] !== "\n") {
		lines += "\n";
	}

	lines = lines.replace(/->([^\S\n]*)([^\n])/g, "-> $2");
	return lines
}
