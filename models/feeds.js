"use strict";

const config = require("../config.json");

const r = require("rethinkdb");
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
	result = yield createActivity(result);
	return result;
};

module.exports.getItems = function* getItems(limit) {
	const results = yield getRecentActivites(limit);
	return results;
};

module.exports.getItem = (id) => {

};

let connection;

function* createConnection() {
	try {
		// Open a connection and wait for r.connect(...) to be resolve
		connection = yield r.connect(config.site.db);
	}catch (err) {
		console.error(err);
	}
}

function* createActivity(activity) {
	// set up the connection
	yield createConnection();
	// set the time on it
	activity.timestamp = moment().valueOf();
	// write to the db
	const result = yield r.table("activity").insert(activity, {returnChanges: true}).run(connection);
	connection.close();
	return result.changes[0].new_val;
}

function* getActivity(id) {
	// set up the connection
	yield createConnection();
	// check to see if the document exists
	const result = yield r.table("activity").get(id).run(connection);
	if (result === null) {
		throw new Error("Activity not found / feedModel.getActivity");
	}
	connection.close();
	return result;
}

function* getRecentActivites(limit) {
	// set up the connection
	yield createConnection();
	// check to see if the document exists
	const results = yield r.db("feedboard").table("activity").orderBy({index: "timestamp"}).limit(limit).run(connection);
	if (results === null) {
		throw new Error("Activity not found / feedModel.getRecentActivites");
	}
	connection.close();
	return results;
}
