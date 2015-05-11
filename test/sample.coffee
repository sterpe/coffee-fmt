
###
SkinnyMochaHalfCaffScript Compiler v1.0
Released under the MIT License
###### An inline block comment ###

### An inline block comment ###
# Assignment:
number   = 42
opposite = true

# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Arrays:
list = [1, 2, 3, 4, 5]

# Objects:
math =
  root:   Math.sqrt
  square: square
  cube:   (x) -> x * square x

# Splats:
race = (winner, runners...) ->
  print winner, runners

# Existence:
alert "I knew it!" if elvis?

# Array comprehensions:
cubes = (math.cube num for num in list)

# Strings:
"I knew it!"
"I \"knew\" it!"
"I \\\"knew\\\" it!"
"I \\"knew\" it!"

"A multi-\
line \
string."
"A broken
multi-line string."
