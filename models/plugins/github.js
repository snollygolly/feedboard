"use strict";

module.exports.process = function* process(data) {
	console.log(JSON.stringify(data));
	return data;
};
