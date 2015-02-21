# Constants
# ---------

# List of the token pairs that must be balanced.
BALANCED_PAIRS = [
  ['(', ')']
  ['[', ']']
  ['{', '}']
  ['INDENT', 'OUTDENT'],
  ['CALL_START', 'CALL_END']
  ['PARAM_START', 'PARAM_END']
  ['INDEX_START', 'INDEX_END']
]

# The inverse mappings of `BALANCED_PAIRS` we're trying to fix up, so we can
# look things up from either end.
exports.INVERSES = INVERSES = {}

# The tokens that signal the start/end of a balanced pair.
EXPRESSION_START = []
EXPRESSION_END   = []

for [left, rite] in BALANCED_PAIRS
  EXPRESSION_START.push INVERSES[rite] = left
  EXPRESSION_END  .push INVERSES[left] = rite

# Tokens that indicate the close of a clause of an expression.
EXPRESSION_CLOSE = ['CATCH', 'THEN', 'ELSE', 'FINALLY'].concat EXPRESSION_END

# Tokens that, if followed by an `IMPLICIT_CALL`, indicate a function invocation.
IMPLICIT_FUNC    = ['IDENTIFIER', 'SUPER', ')', 'CALL_END', ']', 'INDEX_END', '@', 'THIS']

# If preceded by an `IMPLICIT_FUNC`, indicates a function invocation.
IMPLICIT_CALL    = [
  'IDENTIFIER', 'NUMBER', 'STRING', 'JS', 'REGEX', 'NEW', 'PARAM_START', 'CLASS'
  'IF', 'TRY', 'SWITCH', 'THIS', 'BOOL', 'NULL', 'UNDEFINED', 'UNARY', 'YIELD'
  'UNARY_MATH', 'SUPER', 'THROW', '@', '->', '=>', '[', '(', '{', '--', '++'
]

IMPLICIT_UNSPACED_CALL = ['+', '-']

# Tokens that always mark the end of an implicit call for single-liners.
IMPLICIT_END     = ['POST_IF', 'FOR', 'WHILE', 'UNTIL', 'WHEN', 'BY',
  'LOOP', 'TERMINATOR']

# Single-line flavors of block expressions that have unclosed endings.
# The grammar can't disambiguate them, so we insert the implicit indentation.
SINGLE_LINERS    = ['ELSE', '->', '=>', 'TRY', 'FINALLY', 'THEN']
SINGLE_CLOSERS   = ['TERMINATOR', 'CATCH', 'FINALLY', 'ELSE', 'OUTDENT', 'LEADING_WHEN']

# Tokens that end a line.
LINEBREAKS       = ['TERMINATOR', 'INDENT', 'OUTDENT']

# Tokens that close open calls when they follow a newline.
CALL_CLOSERS     = ['.', '?.', '::', '?::']
