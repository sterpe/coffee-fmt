value = 42
lastValue = null
changeValue = (newValue) ->
	lastValue = value
	value = newValue


# many pages of code here


innocent = (nums) ->
	lastValue = 1
	for num in nums
		doSomething lastValue, num
		lastValue = num
	lastValue
