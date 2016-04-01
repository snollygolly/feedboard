"use strict";

const config = require("./config.json");
const env = config.env[process.env.NODE_ENV];

const hbs = require("koa-hbs");
const serve = require("koa-static-folder");
// for passport support
const session = require("koa-generic-session");
const bodyParser = require("koa-bodyparser");

const Koa = require("koa");
const app = new Koa();

// socket stuff
const KoaSocket = require("koa-socket");
const io = new KoaSocket();

io.attach(app);

exports.app = app;

// for all socket interations
require("./controllers/sockets");

// misc handlebars helpers
require("./helpers/handlebars");

// trust proxy
app.proxy = true;

// sessions
app.keys = [config.site.secret];
app.use(session());

// body parser
app.use(bodyParser());

// statically serve assets
app.use(serve("./assets"));

// load up the handlebars middlewear
// app.use(hbs.middleware({
// 	viewPath: `${__dirname}/views`,
// 	layoutsPath: `${__dirname}/views/layouts`,
// 	partialsPath: `${__dirname}/views/partials`,
// 	defaultLayout: "main"
// }));

app.use(serve(`./${env.views_dir}`));

app.use(function* appUse(next) {
	try {
		yield next;
	} catch (err) {
		if (this.state.api === true) {
			// if this was an API request, send the error back in a plain response
			this.app.emit("error", err, this);
			this.body = {error: true, message: String(err)};
		} else {
			// this wasn"t an API request, show the error page
			this.app.emit("error", err, this);
			yield this.render("error", {
				dump: err
			});
		}
	}
});

require("./routes");

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

if (process.env.NODE_ENV === "local") {
	// react stuff
	const webpack = require("webpack");
	const webpackConfig = require("./webpack.config.js");
	const WebpackDevServer = require("webpack-dev-server");

	// WEBPACK DEV SERVER
	new WebpackDevServer(webpack(webpackConfig), {
		"hot": true,
		"historyApiFallback": true,
		proxy: {
			"*": `http://localhost:${config.site.port}`
		},
		stats: "errors-only"
	}).listen(config.site.port + 1, "localhost", function webpackDevServer(err, result) {
		if (err) {
			console.log(err);
		}
		console.log(`Webpack Dev Server (Hot-Reload) listening on port ${config.site.port + 1}`);
	});
} 

process.on("SIGINT", function end() {
	process.exit();
});
