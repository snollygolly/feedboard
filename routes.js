"use strict";

const config = require("./config.json");
const env = config.env[process.env.NODE_ENV];
const fs = require("fs");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const feeds = require("./controllers/feeds.js");

function renderFile(src) {
	return new Promise(function renderPromise(resolve, reject) {
		fs.readFile(src, {"encoding": "utf8"}, function readFileOutput(err, data) {
			if (err) return reject(err);
			resolve(data);
		});
	});
}

// routes
routes.get("/", function* get() {
	// yield this.render("index", {title: config.site.name, script: "feeds"});
	this.body = yield renderFile(`${__dirname}/${env.views_dir}/index.html`);
});

routes.post("/feeds/:provider", feeds.process);

app.use(routes.middleware());
