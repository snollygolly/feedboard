"use strict";

const config = require("../config.json");

const model = require("../models/feeds.js");

module.exports.process = function* process() {
	this.state.api = true;
	// which plugin are they wanting to use?
	const provider = this.params.provider;
	if (config.site.plugins.indexOf(provider) === -1) {
		// they didn't pass a plugin that isn't supported
		return this.body = {error: true, message: "Provider not supported"};
	}
	// the plugin they are trying to use is available, let's send it over
	const result = yield model.process(provider, this.request.body);
	return this.body = {error: false, message: result};
};
