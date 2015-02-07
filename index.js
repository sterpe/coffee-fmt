#!/usr/bin/node

var
 	argv		= require('minimist')(process.argv.slice(2))
,	fs		= require('fs')
,	format		= require('./lib/format').format
,	options		= {
				indent: argv.indent_style === "space" ? " " : "\t",
				newLine: "\n"
			  }
,	i
;

if (options.indent === " ") {
	for (i = 1; i < argv.indent_size; i += 1) {
		options.indent += " "
	}
}

function eachFile(file, options) {
	var
		code		= fs.readFileSync(file).toString()
	;

	process.stdout.write(format(code, options));
	return 0
}

eachFile(argv.i, options);

process.exit(0);
