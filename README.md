# coffee-fmt


a `gofmt` inspired Coffeescript formatter/beautifier.


	npm install -g coffee-fmt
	coffee-fmt --indent_style [space|tab] --indent_size [Integer, ignored when using tabs] -i filename.coffee >> transformed.coffee


###js api###

```javascript
	var fmt = require('coffee-fmt')
	, fs = require('fs')
	, coffee
	, options
	;

	options = {
		indent_style: space,
		indent_size: 7 /* Or whatever */
	};

	coffee = fs.readFileSync('filename.coffee');
	coffee = coffee.toString();

	coffee = fmt.format(coffee, options);

	console.log(coffee);
```

