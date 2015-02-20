var CR, LF, LINEBREAK, SPACE, TAB, argv, fmt, format, fs, i, options;

argv = require('minimist')(process.argv.slice(2));

fs = require('fs');

format = require('./fmt').format;

TAB = "\t";

SPACE = " ";

LF = "\n";

CR = "\r";

LINEBREAK = {
  LF: LF,
  CR: CR,
  CRLF: CR + LF,
  LFCR: LF + CR
};

options = {
  tab: argv.indent_style === "space" ? SPACE : TAB,
  newLine: LINEBREAK[argv.new_line] || LF
};

options.tab += ((function() {
  var j, ref, results;
  results = [];
  for (i = j = 2, ref = argv.indent_size; 2 <= ref ? j <= ref : j >= ref; i = 2 <= ref ? ++j : --j) {
    results.push(SPACE);
  }
  return results;
})()).join("");

fmt = function(filename, options) {
  var code;
  code = fs.readFileSync(filename);
  code = code.toString();
  code = format(code, options);
  process.stdout.write(code);
  return 0;
};

fmt(argv.i, options);

process.exit(0);
