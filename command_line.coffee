posix:    require 'posix'
path:     require 'path'
coffee:   require 'coffee-script'
optparse: require('./../../vendor/optparse-js/src/optparse')

BANNER: '''
  coffee compiles CoffeeScript source files into JavaScript.

  Usage:
    coffee path/to/script.coffee
        '''

SWITCHES: [
  ['-i', '--interactive',   'run an interactive CoffeeScript REPL']
  ['-r', '--run',           'compile and run a CoffeeScript']
  ['-o', '--output [DIR]',  'set the directory for compiled JavaScript']
  ['-w', '--watch',         'watch scripts for changes, and recompile']
  ['-p', '--print',         'print the compiled JavaScript to stdout']
  ['-l', '--lint',          'pipe the compiled JavaScript through JSLint']
  ['-e', '--eval',          'compile a cli scriptlet or read from stdin']
  ['-t', '--tokens',        'print the tokens that the lexer produces']
  [      '--tree',          'print the parse tree that Jison produces']
  ['-n', '--no-wrap',       'raw output, no function safety wrapper']
  ['-g', '--globals',       'attach all top-level variables as globals']
  ['-v', '--version',       'display CoffeeScript version']
  ['-h', '--help',          'display this help message']
]

WATCH_INTERVAL: 0.5

# The CommandLine handles all of the functionality of the `coffee` utility.
exports.run: ->
  @parse_options()
  @compile_scripts()
  this

# The "--help" usage message.
exports.usage: ->
  puts '\n' + @option_parser.toString() + '\n'
  process.exit 0

# The "--version" message.
exports.version: ->
  puts "CoffeeScript version " + coffee.VERSION
  process.exit 0

# Compile a single source file to JavaScript.
exports.compile: (script, source) ->
  source ||= 'error'
  options: {}
  options.no_wrap: true if @options.no_wrap
  options.globals: true if @options.globals
  try
    CoffeeScript.compile(script, options)
  catch error
    process.stdio.writeError(source + ': ' + error.toString())
    process.exit 1 unless @options.watch
    null

# Compiles the source CoffeeScript, returning the desired JavaScript, tokens,
# or JSLint results.
exports.compile_scripts: ->
  return unless source: @sources.shift()
  opts: @options
  posix.cat(source).addCallback (code) ->
    if      opts.tokens   then puts coffee.tokenize(code).join(' ')
    else if opts.tree     then puts coffee.tree(code).toString()
    else
      js: coffee.compile code
      if      opts.run    then eval js
      else if opts.print  then puts js
      else if opts.lint   then exports.lint js
      else                     exports.write_js source, coffee.compile code
    exports.compile_scripts()

# Write out a JavaScript source file with the compiled code.
exports.write_js: (source, js) ->
  filename: path.basename(source, path.extname(source)) + '.js'
  dir:      @options.output or path.dirname(source)
  js_path:  path.join dir, filename
  posix.open(js_path, process.O_CREAT | process.O_WRONLY | process.O_TRUNC, 0755).addCallback (fd) ->
    posix.write(fd, js)

# Pipe compiled JS through JSLint (requires a working 'jsl' command).
exports.lint: (js) ->
  jsl: process.createChildProcess('jsl', ['-nologo', '-stdin'])
  jsl.addListener 'output', (result) ->
    puts result.replace(/\n/g, '') if result
  jsl.addListener 'error', (result) ->
    puts result if result
  jsl.write js
  jsl.close()

# Use OptionParser for all the options.
exports.parse_options: ->
  opts:         @options: {}
  oparser:      @option_parser: new optparse.OptionParser SWITCHES
  oparser.add:  oparser['on']

  oparser.add 'interactive',      -> opts.interactive: true
  oparser.add 'run',              -> opts.run:         true
  oparser.add 'output', (n, dir)  -> opts.output:      dir
  oparser.add 'watch',            -> opts.watch:       true
  oparser.add 'print',            -> opts.print:       true
  oparser.add 'lint',             -> opts.lint:        true
  oparser.add 'eval',             -> opts.eval:        true
  oparser.add 'tokens',           -> opts.tokens:      true
  oparser.add 'tree',             -> opts.tree:        true
  oparser.add 'help',             => @usage()
  oparser.add 'version',          => @version()

  paths: oparser.parse(process.ARGV)
  @sources: paths[2...paths.length]
