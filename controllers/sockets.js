"use strict";

const config = require("../config.json");
const app = require("../index").app;
const io = app.io;
const feeds = require("../models/feeds.js");

const co = require("co");

io.on("connection", (ctx, data) => {
	console.log("join event fired", data);
});

io.on("disconnect", (ctx, data) => {
	console.log("leave event fired", data);
});

io.on("bootstrap", co.wrap(function* co(ctx, data) {
	const results = yield feeds.getItems(config.site.options.results_on_bootstrap);
	io.socket.emit("bootstrap", JSON.stringify(results));
}));

module.exports.restart = function restart() {
	// Broadcasts to all other connections
	io.broadcast("restart", {"time": config.site.options.time_to_wait_before_restart});
};

module.exports.update = function update(data) {
	// Broadcasts to all other connections
	io.broadcast("update", data);
};

function onError(err) {
	// log any uncaught errors
	// co will not throw any errors you do not handle!!!
	// HANDLE ALL YOUR ERRORS!!!
	console.error(err.stack);
	console.log("***: Dying...");
	return process.exit();
}
