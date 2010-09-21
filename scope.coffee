# The **Scope** class regulates lexical scoping within CoffeeScript. As you
# generate code, you create a tree of scopes in the same shape as the nested
# function bodies. Each scope knows about the variables declared within it,
# and has a reference to its parent enclosing scope. In this way, we know which
# variables are new and need to be declared with `var`, and which are shared
# with the outside.

# Import the helpers we plan to use.
{extend} = require('./helpers').helpers

exports.Scope = class Scope

  # The top-level **Scope** object.
  @root: null

  # Initialize a scope with its parent, for lookups up the chain,
  # as well as a reference to the **Expressions** node is belongs to, which is
  # where it should declare its variables, and a reference to the function that
  # it wraps.
  constructor: (parent, expressions, method) ->
    [@parent, @expressions, @method] = [parent, expressions, method]
    @variables = {}
    if @parent
      @garbage = @parent.garbage
    else
      @garbage   = []
      Scope.root = this

  # Create a new garbage level
  startLevel: ->
    @garbage.push []

  # Return to the previous garbage level and erase referenced temporary
  # variables in current level from scope.
  endLevel: ->
    (@variables[name] = 'reuse') for name in @garbage.pop() when @variables[name] is 'var'

  # Look up a variable name in lexical scope, and declare it if it does not
  # already exist.
  find: (name, options) ->
    return true if @check name, options
    @variables[name] = 'var'
    false

  # Test variables and return true the first time fn(v, k) returns true
  any: (fn) ->
    for v, k of @variables when fn(v, k)
      return true
    return false

  # Reserve a variable name as originating from a function parameter for this
  # scope. No `var` required for internal references.
  parameter: (name) ->
    @variables[name] = 'param'

  # Just check to see if a variable has already been declared, without reserving,
  # walks up to the root scope.
  check: (name, options) ->
    immediate = Object::hasOwnProperty.call @variables, name
    return immediate if immediate or (options and options.immediate)
    !!(@parent and @parent.check(name))

  # Generate a temporary variable name at the given index.
  temporary: (type, index) ->
    '_' + type + if index > 1 then index else ''

  # If we need to store an intermediate result, find an available name for a
  # compiler-generated variable. `_var`, `_var2`, and so on...
  freeVariable: (type) ->
    index = 0
    index++ while @check(temp = @temporary type, index) and @variables[temp] isnt 'reuse'
    @variables[temp] = 'var'
    @garbage[@garbage.length - 1].push temp if @garbage.length
    temp

  # Ensure that an assignment is made at the top of this scope
  # (or at the top-level scope, if requested).
  assign: (name, value) ->
    @variables[name] = value: value, assigned: true

  # Does this scope reference any variables that need to be declared in the
  # given function body?
  hasDeclarations: (body) ->
    body is @expressions and @any (k, val) -> val is 'var' or val is 'reuse'

  # Does this scope reference any assignments that need to be declared at the
  # top of the given function body?
  hasAssignments: (body) ->
    body is @expressions and @any (k, val) -> val.assigned

  # Return the list of variables first declared in this scope.
  declaredVariables: ->
    (key for key, val of @variables when val is 'var' or val is 'reuse').sort()

  # Return the list of assignments that are supposed to be made at the top
  # of this scope.
  assignedVariables: ->
    "#{key} = #{val.value}" for key, val of @variables when val.assigned

  # Compile the JavaScript for all of the variable declarations in this scope.
  compiledDeclarations: ->
    @declaredVariables().join ', '

  # Compile the JavaScript forall of the variable assignments in this scope.
  compiledAssignments: ->
    @assignedVariables().join ', '
