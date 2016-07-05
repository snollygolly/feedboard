"use strict";

const config = require("../config.json");
const rss = config.site.rss;
const rss_options = config.site.rss_options;

const Promise = require("bluebird");
const FeedParser = require("feedparser");
const request = require("request");
const _ = require("lodash");
const moment = require("moment");
const r = require("rethinkdbdash")(config.site.db);
const defer = require("co-defer");

const socket = require("../controllers/sockets");

module.exports.init = function* init() {
  yield poll();

  defer.setInterval(function* interval() {
    const results = yield poll();
    if (results && results.length > 0) {
      socket.update(results);
    }
  }, (rss_options.interval || 5) * 60 * 1000);
};

module.exports.getItems = function* getItems(limit) {
  let results;

  if (limit) {
    results = yield r.table("rss").orderBy({index: r.desc("timestamp")}).limit(limit);
  } else {
    results = yield r.table("rss").orderBy({index: r.desc("timestamp")});
  }

  return results;
};

function* poll() {
  // const stored_items = yield module.exports.getItems();

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
        // Read each item parsed from the XML feed
        while (post = this.read()) {
          let content = post.summary;
          // Remove any `Read More` links from the content
          content = content.replace(/<a[^>]*>(?:[^<]*)Read More(?:[^<]*)<\/a>/, "");
          // Add a `Read More` link to the end of the content
          // content = `${content} <a href="${post.origlink || post.link}" target="_blank">Read More</a>`;
          // Push the formatted item onto the array
          posts.push({
            error: false,
            plugin: "rss",
            provider: rss_feed.provider,
            type: "update",
            title: post.title,
            content: content,
            link: post.guid || post.permalink || post.origlink || post.link,
            avatar: meta.image.url,
            timestamp: moment(post.pubdate).format().toString()
          });
        }
      });

      function done(err) {
        if (err) {
          console.error("ERROR!", err);
          reject(new Error("Error reading RSS feed"));
        }

        // Resolve the current feed's Promise after all items have been processed
        resolve(posts);
      }
    }));
  }

  // Format the data from all feeds
  const all_feed_data = yield Promise.all(rss_feed_promises);
  const formatted_all_feed_data = _.chain(all_feed_data)
    // Flatten all feed data to one array
    .flatten()
    // Sort the array in DESC order of post date
    .sortBy((feed_data) => {
      return moment(feed_data.timestamp).unix() * -1;
    })
    .value();

  const feed_links = yield _.map(formatted_all_feed_data, "link");

  let old_feed_links = yield r.table("rss").filter(
    (doc) => {
      return r.expr(feed_links)
        .contains(doc("link"));
    }
  );

  old_feed_links = _.map(old_feed_links, "link");

  const new_items = yield _.filter(formatted_all_feed_data, (feed_item) => {
    return old_feed_links.indexOf(feed_item.link) === -1;
  });

  if (new_items.length === 0) {
    return [];
  }

  let inserted_items = [];
  try {
    const results = yield r.table("rss").insert(new_items, {returnChanges: true});
    inserted_items = _.map(results.changes, "new_val");
  } catch (e) {
    console.error(`ERROR! In rss:init\n${e}`);
  }

  return inserted_items;
}
