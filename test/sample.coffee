x = 1 # Test
# Assignment:
number   = 42
opposite =true

# Conditions:
number = -42 if opposite

# Functions:
square = (x) -> x * x

# Arrays:
list = [1, 2, 3, 4, 5];		# Test 2

# Objects:
math =
  root:   Math.sqrt# Foo
  square: square			### BAZ
		BIM BOP ###
  cube:   (x) -> x * square x### Bar ###

# Splats:
race = (winner, runners...) ->
  # And the winner is...
		#It moves this one left <- 
		#              It gets rid of this whitespace.
  print winner, runners

# Existence:
alert "I knew it!" if elvis?

# Array comprehensions:
cubes = (math.cube num for num in list)
