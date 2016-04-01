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

module.exports.getItems = (count) => {
	// gets the latest [count] items
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
	activity.id = moment().unix();
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
