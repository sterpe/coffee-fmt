var FrontendFactory = require('./frontend/FrontendFactory')
, BackendFactory = require('./backend/BackendFactory')
, Source = require('./frontend/Source').Source
, MESSAGES = require('./constants/MessageTypes')
, FORMATS = require('./constants/Formats')
, printf = require('./utils/printf').printf
, onSourceMessage
, onParserMessage
, onBackendMessage
;

onSourceMessage = function (message) {
	switch (message.type) {
		case MESSAGES.get("SOURCE_LINE"):
			printf(FORMATS.get("SOURCE_LINE_FORMAT")
				, message.arguments[0]
				, message.arguments[1]
			);
			break;
		default:
			return;
	}
};

onParserMessage = function (message) {
	var tokenValue
	, PREFIX_WIDTH = 5
	, spaces
	, s = ""
	;
	switch (message.type) {
		case MESSAGES.get("PARSER_SUMMARY"):
			printf(FORMATS.get("PARSER_SUMMARY_FORMAT")
				, message.arguments[0]
				, message.arguments[1]
				, message.arguments[2]
			);
			break;
		case MESSAGES.get("TOKEN"):
			printf(FORMATS.get("TOKEN_FORMAT")
				, message.arguments[2]
				, message.arguments[0]
				, message.arguments[1]
				, message.arguments[3]
			);
			tokenValue = message.arguments[4];
			if (tokenValue !== null) {
				if (token.type === TOKEN_TYPES.get("STRING")) {
					tokenValue = "\"" + tokenValue + "\"";
				}
				printf(FORMATS.get("VALUE_FORMAT")
					, tokenValue
				);
			}
			break;
		case MESSAGES.get("SYNTAX_ERROR"):
			spaces = PREFIX_WIDTH + message.arguments[1];
			for (i = 1; i < spaces; ++i) {
				s += " ";
			}
			s += "^\n*** " + message.arguments[3];
			if (message.arguments[2] !== null) {
				s += " [at \"" + message.arguments[2] + "\"]";
			}
			console.log(s);
			break;
		default:
			return;
	}
};
onBackendMessage = function (message) {
	switch (message.type) {
		case MESSAGES.get("INTERPRETER_SUMMARY"):
			printf(FORMATS.get("INTERPRETER_SUMMARY_FORMAT")
				, message.arguments[0]
				, message.arguments[1]
				, message.arguments[2]
			);
			break;
		case MESSAGES.get("COMPILER_SUMMARY"):
			printf(FORMATS.get("COMPILER_SUMMARY_FORMAT")
				, message.arguments[0]
				, message.arguments[1]
			);
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
