"use strict";

const config = require("../config.json");

const model = require("../models/rss.js");

module.exports.init = function* init(limit) {
  yield model.init(limit);
};

module.exports.process = function* process() {
};
