###
# Just nobody look.
# At this, what a disaster!
# I blame Coffeescript.
###

{Lexer}		= require('./lexer')
INDENT		= "INDENT"
OUTDENT		= "OUTDENT"
TERMINATOR	= "TERMINATOR"
HERECOMMENT	= "HERECOMMENT"
COMMENT		= "COMMENT"
IDENTIFIER	= "IDENTIFIER"
NUMBER		= "NUMBER"
STRING		= "STRING"
PADDED_LR_TYPES	= [
			"UNARY",
			"LOGIC",
			"SHIFT",
			"COMPARE",
			"COMPOUND_ASSIGN",
			"MATH",
			"RELATION",
			"FORIN",
			"FOROF",
			"INSTANCEOF",
			"UNLESS",
			"IF",
			"THEN",
			"ELSE",
			"OWN",
			"WHEN",
			"LEADING_WHEN",
			"=",
			"->",
			"FOR",
			"BY",
			"RETURN",
			"THROW",
			"WHILE",
			"SWITCH",
			"+",
			"CLASS"
			"-"
]

fmt = (code, options) ->
	lexer		= new Lexer()
	tokens 		= lexer.tokenize code, { rewrite: false, verbose: options.verbose }
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
#			console.log tokens[i], i
#			FOO BAR BAZ BEEP BOOP XXX XXX XXX ABCDEFGHIJKLMNOPQRSTUVWXZY 01234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ 01234567890
			token = tokens[i]
			CURR_INDENT = if token[0] is INDENT
				CURR_INDENT + options.tab
			else if token[0] is OUTDENT
				CURR_INDENT.slice(0, -INDENT_SIZE)
			else
				CURR_INDENT
#			console.log("CURR_INDENT IS:" + CURR_INDENT.length);
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
#				if token[1][0] is "\n"
				if true
					if (token[1].split("#")[0].indexOf("\n") is -1) and formatted_code.length
#						console.log true
						inline = token[1].split("\n").shift()
						if formatted_code.length and not (formatted_code.charAt(formatted_code.length - 1).match(/\s/))
							formatted_code += " "
						else
							formatted_code = formatted_code.trim()
							formatted_code += " "
						formatted_code += inline.trim().replace(/^#(\s)*/, "# ")
						token[1] = token[1].split("\n").slice(1).join("\n")
					comments.push {
						type: COMMENT
						text: token[1]
						token: token
						index: i
					}
					CURR_LINE = token[2].first_line
					return
			if token[2].first_line > (CURR_LINE)
				formatted_code += "\n" + CURR_INDENT
				CURR_LINE = token[2].first_line
			if token.generated
				return
			if token[0] is TERMINATOR
				return
			if token[0] is "PROGRAM"
				return
#			console.log(comments)
			for j in [0..comments.length - 1] by 1
				do (j) ->
#					console.log ("$" + comments[j].text + "$")
					if comments[j].text.length is 0
						return
					if comments[j].type is COMMENT
						tmp = comments[j].text.split("\n")
						if (tmp.length)
							if formatted_code.slice(-2) != "\n\n"
								formatted_code += "\n" + CURR_INDENT
						bool = false
						tmp.forEach (line) ->
							text = line.split("#");
							text = text[1] or text[0];
							bool = bool or text.trim()
							if bool
								formatted_code += "# " + text.trim()
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
			tmp = ""
			# Tokens that should always* have whitespace pads on left and right
			if token[0] in PADDED_LR_TYPES
				if not formatted_code.charAt(formatted_code.length - 1).match(/\s/)
					tmp += " "
				if token[1] is "=="
					tmp += "is"
				else if token[1] is "!="
					tmp += "isnt"
				else if token[1] is "!"
					tmp += "not"
				else if token[1] is "&&"
					tmp += "and"
				else if token[1] is "||"
					tmp += "or"
				else if token[1] is "||="
					tmp += "or="
				else if token[1] is "&&="
					tmp += "and="
				else
					tmp += token[1]
			else if token[0] in ["@"]
				if not formatted_code.charAt(formatted_code.length - 1).match(/\s/)
					tmp += " "
				tmp += token[1]
			else if token[0] is ","
				if tokens[i - 1][0] is "IDENTIFIER" or tokens[i - 1][0] is "NUMBER"
					formatted_code = formatted_code.trim()
				tmp += token[1]
			else if token[0] is "IDENTIFIER"
				if tokens[i - 1][0] is "," or tokens[i - 1][0] is "IDENTIFIER" or
						formatted_code.charAt(formatted_code.length - 1) is ")"
					tmp += " "
				tmp += token[1]
			else if token[0] is "STRING"
				if tokens[i - 1][0] is "," or tokens[i - 1][0] is "IDENTIFIER"
					tmp += " "
				tmp += token[1]
			else if token[0] is "NUMBER"
				if tokens[i - 1][0] is "," or tokens[i - 1][0] is "IDENTIFIER"
					tmp += " "
				tmp += token[1]
			else if token[0] is ":"
				if tokens[i - 1][0] is IDENTIFIER
					tmp += token[1] + " "
			else
				tmp = token[1]
			if tokens[i - 1][0] in PADDED_LR_TYPES
				if not formatted_code.charAt(formatted_code.length - 1).match(/\s/) and
				not tmp.charAt(0).match(/\s/)
					tmp = " " + tmp
			if tokens[i - 1][0] is "," and tmp.charAt(0) isnt " "
				tmp = " " + tmp
#			console.log "tmp ", tmp
			formatted_code += tmp

	if true and
	formatted_code.slice(-options.newLine.length) isnt options.newLine
		formatted_code += options.newLine
	return formatted_code

module.exports.format = fmt
