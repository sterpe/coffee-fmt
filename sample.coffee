### HERE COMMENT ###
# Assignment:
number   = 42
opposite = true

###
	ANOTHER HERE COMMENT
###
# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Arrays:
list = [1, 2, 3, 4, 5]


#
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
# Two comments in a row
	# Indented comment.
cubes = (math.cube num for num in list)

			#comment

# comment#comment#comment
