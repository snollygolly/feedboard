"use strict";

const config = require("./config.json");

const app = require("./index.js").app;
const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const feeds = require("./controllers/feeds.js");

// routes
routes.get("/", function* get() {
	yield this.render("index", {title: config.site.name, script: "feeds"});
});

routes.post("/feeds/:provider", feeds.process);

app.use(routes.middleware());
