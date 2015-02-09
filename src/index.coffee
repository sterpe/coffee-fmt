argv		= require('minimist') process.argv.slice(2)
fs		= require 'fs'
{format}	= require '.lib/format'
TAB		= "\t"
SPACE		= " "
LINEBREAK	= "\n"
options		= 
	tab: argv.indent_style is "space" ? SPACE : TAB
	newLine: argv.new_line

options.tab += (SPACE for i in [1..argv.indent_size]).join ""

fmt = (filename, options) ->
	code = fs.readfileSync filename
	code = code.toString()
	code = format code, options
	process.stdout.write code
	return 0

fmt argv.i, options

process.exit 0
