var
 	coffeeScript	= require('coffee-script/lib/coffee-script/lexer')
,	_refl		= require('coffee-script/lib/coffee-script/helpers')
,	repeat		= _refl.repeat
,	INDENT		= "INDENT"
,	OUTDENT		= "OUTDENT"
,	TERMINATOR	= "TERMINATOR"
,	HERECOMMENT	= "HERECOMMENT"
,	LINECOMMENT	= "LINECOMMENT"

    coffeeScript.Lexer.prototype.commentToken = function() {

  var HERECOMMENT_ILLEGAL = /\*\//;
  var COMMENT = /^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:[^\n\S]*#(?!##[^#]).*)+/;
      var comment, here, match;
      if (!(match = this.chunk.match(COMMENT))) {
        return 0;
      }
      comment = match[0], here = match[1];
      if (here) {
        if (match = HERECOMMENT_ILLEGAL.exec(comment)) {
          this.error("block comments cannot contain " + match[0], match.index);
        }
        if (here.indexOf('\n') >= 0) {
          here = here.replace(RegExp("\\n" + (repeat(' ', this.indent)), "g"), '\n');
        }
        this.token('HERECOMMENT', here, 0, comment.length);
	} else {
		this.token('LINECOMMENT', comment, 0, comment.length);
	}
      return comment.length;
    };
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
		return line.replace(/\s*/g, "").replace(/\;*$/g, "");
	});
	out = out.split("\n");
	i = 0;
	out.forEach(function (l, index) {
		var line = l.replace(/\s*/g, "");
		if (!line) { return; }
		while (lines[i] !== line) {
			i++;
			if (i > lines.length) {
				process.stderr.write("Can't match: '" + line + "'");
				process.stderr.write("\n Line : " + index + ".  Abort.\n");
				process.exit(1);
			}
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
