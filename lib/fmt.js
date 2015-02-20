var COMMENT, HERECOMMENT, IDENTIFIER, INDENT, Lexer, NUMBER, OUTDENT, PADDED_LR_TYPES, STRING, TERMINATOR, fmt,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Lexer = require('./lexer').Lexer;

INDENT = "INDENT";

OUTDENT = "OUTDENT";

TERMINATOR = "TERMINATOR";

HERECOMMENT = "HERECOMMENT";

COMMENT = "COMMENT";

IDENTIFIER = "IDENTIFIER";

NUMBER = "NUMBER";

STRING = "STRING";

PADDED_LR_TYPES = ["UNARY", "LOGIC", "SHIFT", "COMPARE", "COMPOUND_ASSIGN", "MATH", "RELATION", "FORIN", "FOROF", "INSTANCEOF", "UNLESS", "IF", "THEN", "ELSE", "OWN", "WHEN", "LEADING_WHEN", "=", "->", "FOR", "BY", "RETURN", "THROW", "WHILE", "SWITCH", "+", "-"];

fmt = function(code, options) {
  var CURR_INDENT, CURR_LINE, INDENT_SIZE, comments, formatted_code, i, lexer, tokens, _fn, _i, _ref;
  lexer = new Lexer();
  tokens = lexer.tokenize(code, {
    rewrite: false,
    verbose: options.verbose
  });
  formatted_code = "";
  CURR_INDENT = "";
  CURR_LINE = 0;
  INDENT_SIZE = options.tab.length;
  comments = [];
  tokens.unshift([
    'PROGRAM', '', {
      first_line: 0,
      first_column: 0,
      last_line: 0,
      last_column: 0
    }
  ]);
  _fn = function(i) {
    var j, tmp, token, _fn1, _j, _ref1, _ref2, _ref3, _ref4;
    token = tokens[i];
    CURR_INDENT = token[0] === INDENT ? CURR_INDENT + options.tab : token[0] === OUTDENT ? CURR_INDENT.slice(0, -INDENT_SIZE) : CURR_INDENT;
    if (token[0] === INDENT || token[0] === OUTDENT) {
      return;
    }
    if (token[0] === HERECOMMENT) {
      if (tokens[i - 1][1] === "\n" || token[2].first_line !== token[2].last_line) {
        comments.push({
          type: HERECOMMENT,
          text: token[1].trim(),
          token: token,
          index: i
        });
        CURR_LINE = token[2].first_line;
        return;
      } else if (formatted_code.length && !(formatted_code.charAt(formatted_code.length - 1).match(/\s/))) {
        formatted_code += " ";
      } else {
        formatted_code = formatted_code.trim();
        formatted_code += " ";
      }
      formatted_code += "### ";
      token[1] = token[1].trim() + " ###";
    }
    if (token[0] === COMMENT) {
      if (tokens[i - 1][1] === "\n") {
        comments.push({
          type: COMMENT,
          text: token[1],
          token: token,
          index: i
        });
        CURR_LINE = token[2].first_line;
        return;
      } else if (formatted_code.length && !(formatted_code.charAt(formatted_code.length - 1).match(/\s/))) {
        formatted_code += " ";
      } else {
        formatted_code = formatted_code.trim();
        formatted_code += " ";
      }
      formatted_code += "#";
      if (token[1].trim().charAt(0) !== "!") {
        formatted_code += " ";
      }
    }
    if (token[2].first_line > CURR_LINE) {
      formatted_code += "\n" + CURR_INDENT;
      CURR_LINE = token[2].first_line;
    }
    if (token.generated) {
      return;
    }
    if (token[0] === TERMINATOR) {
      return;
    }
    if (token[0] === "PROGRAM") {
      return;
    }
    _fn1 = function(j) {
      var tmp;
      if (comments[j].type === COMMENT) {
        formatted_code += "# ";
        formatted_code += comments[j].text;
        return formatted_code += "\n" + CURR_INDENT;
      } else if (comments[j].type === HERECOMMENT) {
        if (comments[j].token.first_line === comments[j].token.last_line && comments[j].token.first_line === tokens[comments[j].index - 1].last_line && tokens[comments[j].index - 1][1] !== "\n") {
          formatted_code = formatted_code.slice(0, formatted_code.lastIndexOf("\n"));
        }
        if (formatted_code.length && !(formatted_code.charAt(formatted_code.length - 1).match(/\s/))) {
          formatted_code += " ";
        }
        formatted_code += "###\n" + CURR_INDENT;
        tmp = comments[j].text.split("\n");
        tmp.forEach(function(line) {
          return formatted_code += CURR_INDENT + line.trim() + "\n" + CURR_INDENT;
        });
        return formatted_code += "###\n" + CURR_INDENT;
      }
    };
    for (j = _j = 0, _ref1 = comments.length - 1; _j <= _ref1; j = _j += 1) {
      _fn1(j);
    }
    comments = [];
    tmp = "";
    if (_ref2 = token[0], __indexOf.call(PADDED_LR_TYPES, _ref2) >= 0) {
      if (!formatted_code.charAt(formatted_code.length - 1).match(/\s/)) {
        tmp += " ";
      }
      if (token[1] === "==") {
        tmp += "is";
      } else if (token[1] === "!=") {
        tmp += "isnt";
      } else if (token[1] === "!") {
        tmp += "not";
      } else if (token[1] === "&&") {
        tmp += "and";
      } else if (token[1] === "||") {
        tmp += "or";
      } else if (token[1] === "||=") {
        tmp += "or=";
      } else if (token[1] === "&&=") {
        tmp += "and=";
      } else {
        tmp += token[1];
      }
    } else if ((_ref3 = token[0]) === "@") {
      if (!formatted_code.charAt(formatted_code.length - 1).match(/\s/)) {
        tmp += " ";
      }
      tmp += token[1];
    } else if (token[0] === ",") {
      if (tokens[i - 1][0] === "IDENTIFIER" || tokens[i - 1][0] === "NUMBER") {
        formatted_code = formatted_code.trim();
      }
      tmp += token[1];
    } else if (token[0] === "IDENTIFIER") {
      if (tokens[i - 1][0] === "," || tokens[i - 1][0] === "IDENTIFIER" || formatted_code.charAt(formatted_code.length - 1) === ")") {
        tmp += " ";
      }
      tmp += token[1];
    } else if (token[0] === "STRING") {
      if (tokens[i - 1][0] === "," || tokens[i - 1][0] === "IDENTIFIER") {
        tmp += " ";
      }
      tmp += token[1];
    } else if (token[0] === "NUMBER") {
      if (tokens[i - 1][0] === "," || tokens[i - 1][0] === "IDENTIFIER") {
        tmp += " ";
      }
      tmp += token[1];
    } else if (token[0] === ":") {
      if (tokens[i - 1][0] === IDENTIFIER) {
        tmp += token[1] + " ";
      }
    } else {
      tmp = token[1];
    }
    if (_ref4 = tokens[i - 1][0], __indexOf.call(PADDED_LR_TYPES, _ref4) >= 0) {
      if (!formatted_code.charAt(formatted_code.length - 1).match(/\s/) && !tmp.charAt(0).match(/\s/)) {
        tmp = " " + tmp;
      }
    }
    if (tokens[i - 1][0] === "," && tmp.charAt(0) !== " ") {
      tmp = " " + tmp;
    }
    return formatted_code += tmp;
  };
  for (i = _i = 0, _ref = tokens.length - 1; _i <= _ref; i = _i += 1) {
    _fn(i);
  }
  if (true && formatted_code.slice(-options.newLine.length) !== options.newLine) {
    formatted_code += options.newLine;
  }
  return formatted_code;
};

module.exports.format = fmt;
