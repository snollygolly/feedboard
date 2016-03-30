"use strict";

module.exports.process = function* process(data) {
	// TODO: check for user agency (hookshot)
	console.log(JSON.stringify(data));
	return data;
};
