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
				if tokens[i - 1][1] is "\n" or token[2].first_line isnt token[2].last_line
					comments.push {
						type: HERECOMMENT
						text: token[1].trim()
						token: token
						index: i
					}
					CURR_LINE = token[2].first_line
					return
				else if formatted_code.length and not (formatted_code.charAt(formatted_code.length - 1).match(/\s/))
					formatted_code += " "
				else
					formatted_code = formatted_code.trim()
					formatted_code += " "
				formatted_code += "### "
				token[1] = token[1].trim() + " ###"
			if token[0] is COMMENT
				if tokens[i - 1][1] is "\n"
					comments.push {
						type: COMMENT
						text: token[1]
						token: token
						index: i
					}
					CURR_LINE = token[2].first_line
					return
				else if formatted_code.length and not (formatted_code.charAt(formatted_code.length - 1).match(/\s/))
					formatted_code += " "
				else
					formatted_code = formatted_code.trim()
					formatted_code += " "
				formatted_code += "# "
			if token[2].first_line > (CURR_LINE)
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
					else if comments[j].type is HERECOMMENT
						if comments[j].token.first_line is comments[j].token.last_line and
								comments[j].token.first_line is tokens[comments[j].index - 1].last_line and
								tokens[comments[j].index - 1][1] isnt "\n"
							formatted_code = formatted_code.slice(0, formatted_code.lastIndexOf("\n"))
						if formatted_code.length and not (formatted_code.charAt(formatted_code.length - 1).match(/\s/))
							formatted_code += " "
						formatted_code += "###\n" + CURR_INDENT
						tmp = comments[j].text.split("\n")
						tmp.forEach (line) ->
							formatted_code += CURR_INDENT +
								line.trim() + "\n" + CURR_INDENT
						formatted_code += "###\n" + CURR_INDENT
			comments = []
			formatted_code += token[1]
			if token.spaced
				formatted_code += " "

	if true and
	formatted_code.slice(-options.newLine.length) isnt options.newLine
		formatted_code += options.newLine
	return formatted_code

module.exports.format = fmt
