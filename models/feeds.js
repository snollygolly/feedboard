"use strict";

const config = require("../config.json");

const r = require("rethinkdbdash")(config.site.db);
const moment = require("moment");

const plugins = {};
// load in all enabled plugins
for (const plugin of config.site.plugins) {
	plugins[plugin] = require(`./plugins/${plugin}`);
}

module.exports.process = function* process(provider, header, data) {
	if (!plugins[provider]) {
		return {error: true, message: "Provider not supported"};
	}
	let result = plugins[provider].process(header, data);
	result.provider = provider;
	if (result.error === false) {
		result = yield createActivity(result);
	}
	return result;
};

module.exports.getItems = function* getItems(limit) {
	const results = yield getRecentActivites(limit);
	return results;
};

function* createActivity(activity) {
	// set the time on it
	activity.timestamp = moment().valueOf();
	// write to the db
	const result = yield r.table("activity").insert(activity, {returnChanges: true}).run();
	return result.changes[0].new_val;
}

function* getActivity(id) {
	// check to see if the document exists
	const result = yield r.table("activity").get(id).run();
	if (result === null) {
		throw new Error("Activity not found / feedModel.getActivity");
	}
	return result;
}

function* getRecentActivites(limit) {
	// check to see if the document exists
	const results = yield r.table("activity").orderBy({index: r.desc("timestamp")}).limit(limit).run();
	if (results === null) {
		throw new Error("Activity not found / feedModel.getRecentActivites");
	}
	return results;
}
