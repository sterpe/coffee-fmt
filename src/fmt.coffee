{Lexer}		= require('./lexer')
INDENT		= "INDENT"
OUTDENT		= "OUTDENT"
TERMINATOR	= "TERMINATOR"
HERECOMMENT	= "HERECOMMENT"
COMMENT		= "COMMENT"

fmt = (code, options) ->
	lexer		= new Lexer()
	tokens 		= lexer.tokenize code, { rewrite: false }
	formatted_code	= ""
	CURR_INDENT	= ""
	CURR_LINE	= 0
	INDENT_SIZE	= options.tab.length
	comments	= []

	tokens.unshift [
		'PROGRAM',
		''
		,
		first_line: 0
		first_column: 0
		last_line: 0
		last_column: 0
	]

	for i in [0..tokens.length - 1] by 1 
		do (i) ->
			console.log tokens[i], i
#			FOO BAR BAZ BEEP BOOP XXX XXX XXX ABCDEFGHIJKLMNOPQRSTUVWXZY 01234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ 01234567890
			token = tokens[i]
			CURR_INDENT = if token[0] is INDENT
				CURR_INDENT + options.tab
			else if token[0] is OUTDENT
				CURR_INDENT.slice(0, -INDENT_SIZE)
			else
				CURR_INDENT
			console.log("CURR_INDENT IS:" + CURR_INDENT.length);
			if token[0] is INDENT or token[0] is OUTDENT
					return
			if token[0] is HERECOMMENT
#				formatted_code += "###" + token[1] + "###"
				comments.push {
					type: HERECOMMENT
					text: token[1]
				}
				CURR_LINE = token[2].first_line
				return
			if token[0] is COMMENT
#				formatted_code += "# " + token[1]
				comments.push {
					type: COMMENT
					text: token[1]
				}
				CURR_LINE = token[2].first_line
				return
			if token[2].first_line > CURR_LINE 
				formatted_code += "\n" + CURR_INDENT
				CURR_LINE = token[2].first_line
			if token.generated
				return
			if token[0] is TERMINATOR
				return
			for j in [0..comments.length - 1] by 1
				do (j) ->
					if comments[j].type is COMMENT
						formatted_code += "# " + comments[j].text
						formatted_code += "\n" + CURR_INDENT
			comments = []
			formatted_code += token[1]

	if true and
	formatted_code.slice(-options.newLine.length) isnt options.newLine
		formatted_code += options.newLine
	return formatted_code

module.exports.format = fmt
