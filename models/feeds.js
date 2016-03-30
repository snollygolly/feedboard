"use strict";

const config = require("../config.json");

const plugins = {};
// load in all enabled plugins
for (const plugin of config.site.plugins) {
	plugins[plugin] = require(`./plugins/${plugin}`);
}

module.exports.process = function* process(provider, data) {
	if (!plugins[provider]) {
		return {error: true, message: "Provider not supported"};
	}
	const result = yield plugins[provider].process(data);
	return result;
};

module.exports.getItems = (count) => {
	// gets the latest [count] items
	return [
		{
			id: 1,
			data: {
				title: "test 1"
			}
		},
		{
			id: 2,
			data: {
				title: "test 2"
			}
		},
		{
			id: 3,
			data: {
				title: "test 3"
			}
		}
	];
};

module.exports.getItem = (id) => {

};
