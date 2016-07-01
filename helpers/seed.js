"use strict";

const config = require("../config.json");
const r = require("rethinkdbdash")(config.site.db);
const co = require("co");

co(function* coWrap() {
	try {
		yield r.dbCreate(config.site.db.db).run();
		console.log(`Database '${config.site.db.db}' created successfully.`);
	} catch (err) {
		console.log(`Warning! ${err}`);
	}

	try {
		yield r.db(config.site.db.db).tableCreate("activity").run();
		console.log("Table 'activity' created successfully.");

		// create the secondary indexes
		yield r.db(config.site.db.db).table("activity").indexCreate("timestamp").run();
		yield r.db(config.site.db.db).table("activity").indexCreate("provider").run();
		yield r.db(config.site.db.db).table("activity").indexCreate("user_id").run();
		console.log("Table 'activity' indexes created successfully.");
	} catch (err) {
		console.log(`Warning! ${err}`);
	}

	try {
		yield r.db(config.site.db.db).tableCreate("rss").run();
		console.log("Table 'rss' created successfully.");

		// create the secondary indexes
		yield r.db(config.site.db.db).table("rss").indexCreate("timestamp").run();
		yield r.db(config.site.db.db).table("rss").indexCreate("provider").run();
		yield r.db(config.site.db.db).table("rss").indexCreate("link").run();
		console.log("Table 'rss' indexes created successfully.");
	} catch (err) {
		console.log(`Warning! ${err}`);
	}

	console.log("\nYou're all set!");
	console.log(`Open http://${config.site.db.host}:8080/#tables to view the database.`);
	process.exit();
}).catch(errorHandler);

function errorHandler(err) {
	console.error("Error occurred!", err);
	throw err;
	process.exit();
}
