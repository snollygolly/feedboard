"use strict";

const app = require("../index").app;
const io = app.io;
const feeds = require("../models/feeds.js");

io.on("connection", (ctx, data) => {
	console.log("join event fired", data);
});

io.on("bootstrap", (ctx, data) => {
	console.log("bootstrap event fired", data);
	// TODO: tie data to getItems parameters
	ctx.socket.emit("feed", feeds.getItems(3));
});

io.on("update", (ctx, data) => {
	console.log("update event fired", data);
});

io.on("disconnect", (ctx, data) => {
	console.log("leave event fired", data);
});

module.exports.update = function update(data) {
	// Broadcasts to all other connections
	io.broadcast("update", data);
};
