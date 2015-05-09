var FrontendFactory = require('./frontend/FrontendFactory')
, BackendFactory = require('./backend/BackendFactory')
, Source = require('./frontend/Source').Source
, SOURCE_LINE = require('./frontend/Constants').get("SOURCE_LINE")
, SOURCE_LINE_FORMAT = require('./frontend/Constants').get("SOURCE_LINE_FORMAT")
, PARSER_SUMMARY = require('./frontend/Constants').get("PARSER_SUMMARY")
, PARSER_SUMMARY_FORMAT = require('./frontend/Constants').get("PARSER_SUMMARY_FORMAT")
, COMPILER_SUMMARY = require('./frontend/Constants').get("COMPILER_SUMMARY")
, COMPILER_SUMMARY_FORMAT = require('./frontend/Constants').get("COMPILER_SUMMARY_FORMAT")
, INTERPRETER_SUMMARY = require('./frontend/Constants').get("INTERPRETER_SUMMARY")
, INTERPRETER_SUMMARY_FORMAT = require('./frontend/Constants').get("INTERPRETER_SUMMARY_FORMAT")
, sprintf = require('sprintf-js').sprintf
, onSourceMessage
, onParserMessage
, onBackendMessage
;

onSourceMessage = function (message) {
	switch (message.type) {
		case SOURCE_LINE:
			console.log(sprintf(SOURCE_LINE_FORMAT
				, message.arguments[0]
				, message.arguments[1]
			));
			break;
		default:
			return;
	}
};

onParserMessage = function (message) {
	switch (message.type) {
		case PARSER_SUMMARY:
			console.log(sprintf(PARSER_SUMMARY_FORMAT
				, message.arguments[0]
				, message.arguments[1]
				, message.arguments[2]
			));
			break;
		default:
			return;
	}
};
onBackendMessage = function (message) {
	switch (message.type) {
		case INTERPRETER_SUMMARY:
			console.log(sprintf(INTERPRETER_SUMMARY_FORMAT
				, message.arguments[0]
				, message.arguments[1]
				, message.arguments[2]
			));
			break;
		case COMPILER_SUMMARY:
			console.log(sprintf(COMPILER_SUMMARY_FORMAT
				, message.arguments[0]
				, message.arguments[1]
			));
			break;
		default:
			return;
	}
};

module.exports = function (buffer, options) {
	var intermediate = options.intermediate || false
	, xref = options.xref || false
	, source
	, parser
	, backend
	, iCode
	, symTab
	;

	try {
		source = new Source(buffer);
		source.addListener('message', onSourceMessage)
	
		parser = FrontendFactory.createParser("Coffeescript", "top-down", source);
		parser.addListener('message', onParserMessage);
	
		backend = BackendFactory.createBackend(options.operation);
		backend.addListener('message', onBackendMessage);
		
		parser.parse();

		iCode = parser.iCode;
		symTab = parser.symTab;
	
		backend.process(iCode, symTab);
	} catch (e) {
		console.log('***** Internal translator error *****');
		console.log(e.stack);
	}
};
