"use strict";

const config = require("../config.json");
const rss = config.site.rss;
const rss_options = config.site.rss_options;

const Promise = require("bluebird");
const FeedParser = require("feedparser");
const request = require("request");
const _ = require("lodash");
const moment = require("moment");

const socket = require("./sockets");

module.exports.init = function init() {
  return new Promise((resolveAll, rejectAll) => {
    const rss_feed_promises = [];

    for (const rss_feed of rss) {
      rss_feed_promises.push(new Promise((resolve, reject) => {
        const posts = [];
        let meta;
        const feedparser = new FeedParser();

        const req = request({
          url: rss_feed.url
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

          req.pipe(feedparser);
        });

        feedparser.on("error", done);
        feedparser.on("end", done);
        feedparser.on("readable", function readable() {
          let post;
          meta = this.meta;
          while (post = this.read()) {
            let content = post.summary;
            if (rss_feed.read_more) {
              content = `${content} <a href="${post.origlink || post.link}" target="_blank">Read More</a>`;
            }
            posts.push({
              error: false,
              plugin: "rss",
              provider: rss_feed.provider,
              type: "update",
              title: post.title,
              content: content,
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

          resolve(posts);
        }
      }));
    }

    Promise.all(rss_feed_promises).then((all_feed_data) => {
      const results = _.chain(all_feed_data)
        .flatten()
        .sortBy((feed_data) => {
          return moment(feed_data.timestamp).unix() * -1;
        })
        .value();

      resolveAll(results);
    }, rejectAll);
  });
};
