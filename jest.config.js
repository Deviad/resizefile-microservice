const  merge = require('merge');
const ts_preset = require('ts-jest/jest-preset');
const mongo_preset = require('@shelf/jest-mongodb/jest-preset');


module.exports = merge.recursive(mongo_preset, ts_preset, {
	clearMocks: true,
	verbose: true,
	testEnvironment: "node",
	coveragePathIgnorePatterns: [
		"/node_modules/"
	],
	resetMocks: true,
	collectCoverageFrom: [
		"src/**/**/*.ts",
		"!src/bootstrap.ts",
		"!typings/**/*.ts"
	],
	globals: {
		"ts-jest": {
			tsConfig: {
				importHelpers: true,
				typeRoots: [ "node_modules/@types", "typings" ]
			}
		},
		test_url: `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 5006}`,
		__MONGO_URI__: "mongodb://root:password@localhost:20000/something",
		__MONGO_DB_NAME__: "something"
	},
});
