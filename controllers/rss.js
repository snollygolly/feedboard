"use strict";

const config = require("../config.json");
const rss = config.site.rss;
const rss_options = config.site.rss_options;

const Promise = require("bluebird");
const FeedParser = require("feedparser");
const request = require("request");
const socket = require("./sockets");

const feedparser = new FeedParser();

module.exports.init = function init() {
  return new Promise(function promise(resolve, reject) {
    const posts = [];
    let meta;

    const req = request({
      url: rss[0].url,
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36",
        "accept": "text/html,application/xhtml+xml"
      }
    });

    req.on("error", (err) => {
      console.error("ERROR!", err);
      reject(new Error("Bad request"));
    });

    req.on("response", (res) => {
      if (res.statusCode !== 200) {
        console.error("ERROR!", "Bad status code");
        reject(new Error("Bad status code"));
      }
      console.log("req received 'response' event");
      req.pipe(feedparser);
    });

    req.on("end", () => {
      console.log("req received 'end' event");
    });

    feedparser.on("error", done);
    feedparser.on("end", done);
    feedparser.on("readable", function readable() {
      let post;
      meta = this.meta;
      while (post = this.read()) {
        posts.push({
          error: false,
          plugin: "rss",
          type: "update",
          title: post.title,
          content: `${post.summary} <a href="${post.origlink || post.link}" target="_blank">Read More</a>`,
          avatar: meta.image.url,
          timestamp: post.pubdate
        });
      }
    });

    function done(err) {
      if (err) {
        console.error("ERROR!", err);
        reject(new Error("Error reading RSS feed"));
      }
      console.log("FeedParser received 'end' event");
      resolve(posts);
    }
  });
};

module.exports.process = function process() {

};
