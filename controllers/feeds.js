"use strict";

const config = require("../config.json");

const model = require("../models/feeds.js");
const socket = require("./sockets");

module.exports.process = function* process() {
	this.state.api = true;
	// which plugin are they wanting to use?
	const provider = this.params.provider;
	if (config.site.plugins.indexOf(provider) === -1) {
		// they didn't pass a plugin that isn't supported
		return this.body = {error: true, message: "Provider not supported"};
	}
	// the plugin they are trying to use is available, let's send it over
	const result = yield model.process(provider, this.request.header, this.request.body);
	// if there's an error, just return it
	if (result.error === true) {
		return this.body = result;
	}
	// there wasn't an error, so send out a socket event
	socket.update(result);
	// check to see if this was feedboard updating itself
	if (result.plugin == "feedboard" && result.type == "update") {
		socket.restart();
	}
	return this.body = result;
};
