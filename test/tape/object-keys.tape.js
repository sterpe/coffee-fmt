var tape = require('tape')
, fs = require('fs')
, fmt = require('../../lib/fmt.js')
;

tape('object keys test', function (t) {
	var initial = fs.readFileSync('./test/files/initial/object-keys.coffee')
	, expected = fs.readFileSync('./test/files/expected/object-keys-expected.coffee')

	var result = fmt.format(initial.toString(), {
		tab: "\t",
		newLine: "\n"
	});

	t.plan(1);
	t.equal(result, expected.toString());
});

