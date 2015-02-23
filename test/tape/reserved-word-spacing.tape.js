var tape = require('tape')
, fs = require('fs')
, fmt = require('./../../lib/fmt.js')
;

tape('reserved word spacing test', function (t) {
	var initial = fs.readFileSync('./test/files/initial/reserved-word-spacing.coffee').toString()
	, expected = fs.readFileSync('./test/files/expected/reserved-word-spacing-expected.coffee').toString()
	;

	var result = fmt.format(initial, {
		tab: "\t",
		newLine: "\n"
	});

	t.plan(1);
	t.equal(result, expected);
});
