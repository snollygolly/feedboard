"use strict";

module.exports.process = (header, data) => {
	// TODO: check for hash correctness?
	// assume all checks have passed here
	const returnObj = feedboardProcessing["update"](data);
	console.log(data);
	returnObj.error = false;
	returnObj.icon = "fa-fortawesome";
	returnObj.avatar = "/assets/img/feedboard-logo.png";
	returnObj.plugin = "feedboard";
	// send it back
	return returnObj;
};

const feedboardProcessing = {
	update: (data) => {
		return {
			title: `It's a great day!`,
			content: "Feedboard has been updated!"
		};
	}
};
