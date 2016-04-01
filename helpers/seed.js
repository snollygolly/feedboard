"use strict";

const config = require("../config.json");
const r = require("rethinkdb");
const co = require("co");

co(function* coWrap() {
	const connection = yield r.connect(config.site.db);

	try {
		yield r.dbCreate(config.site.db.db).run(connection);
		console.log(`Database '${config.site.db.db}' created successfully.`);
	} catch (err) {
		console.log(`Warning! ${err}`);
	}

	try {
		yield r.db(config.site.db.db).tableCreate("activity").run(connection);
		console.log("Table 'activity' created successfully.");
		// create the secondary indexes
		yield r.db(config.site.db.db).table("activity").indexCreate("timestamp").run(connection);
		yield r.db(config.site.db.db).table("activity").indexCreate("provider").run(connection);
		console.log("Table 'activity' indexes created successfully.");

	} catch (err) {
		console.log(`Warning! ${err}`);
	}

	yield connection.close();
	console.log("\nYou're all set!");
	console.log(`Open http://${config.site.db.host}:8080/#tables to view the database.`);
	process.exit();
}).catch(errorHandler);

function errorHandler(err) {
	console.error("Error occurred!", err);
	throw err;
	process.exit();
}
