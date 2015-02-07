var
 	coffeeScript	= require('coffee-script/lib/coffee-script/lexer')
,	INDENT		= "INDENT"
,	OUTDENT		= "OUTDENT"
,	TERMINATOR	= "TERMINATOR"

exports.format = function (code, options) {
	var
		lexer		= new coffeeScript.Lexer()
	,	tokens		= lexer.tokenize(code)
	,	out		= ""
	,	CURR_INDENT	= ""
	,	SPACE		= " "
	,	INDENT_SIZE	= -(options.indent.length)
	,	token
	,	nextToken
	,	length
	,	i
	

	for (i = 0, length = tokens.length; i < length; i += 1) {
		token = tokens[i]
		if (token.generated) { continue }
		if (token[0] === INDENT) {
			CURR_INDENT += (options.indent)
			out += options.indent
		} else if (token[0] === OUTDENT) {
			CURR_INDENT = CURR_INDENT.slice(0, INDENT_SIZE)
			out = out.slice(0, INDENT_SIZE)
		} else {
			out += token[1]
		}
		if (token.spaced) { out += SPACE }
		if (token.newLine) {
			nextToken = tokens[i + 1]
			if (nextToken && nextToken[0] === TERMINATOR &&
					(nextToken[1] === "\n" )) {
			} else {
				out += (options.newLine + CURR_INDENT)
			}
		}
		if (token[0] === TERMINATOR) { out += CURR_INDENT }
	}

	return out
}
