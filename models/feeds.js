"use strict";

const config = require("../config.json");

const plugins = {};
// load in all enabled plugins
for (const plugin of config.site.plugins) {
	plugins[plugin] = require(`./plugins/${plugin}`);
}

module.exports.process = (provider, header, data) => {
	if (!plugins[provider]) {
		return {error: true, message: "Provider not supported"};
	}
	return plugins[provider].process(header, data);
};

module.exports.getItems = (count) => {
	// gets the latest [count] items
};

module.exports.getItem = (id) => {

};
