"use strict";

module.exports.process = (header, data) => {
	// TODO: check for hash correctness?
	// assume all checks have passed here
	const returnObj = feedboardProcessing["update"](data);
	returnObj.error = false;
	returnObj.icon = "fa-fort-awesome";
	returnObj.avatar = "/assets/img/feedboard-logo.png";
	returnObj.plugin = "feedboard";
	returnObj.user = "system";
	// send it back
	return returnObj;
};

const feedboardProcessing = {
	update: (data) => {
		return {
			type: "update",
			title: `It's a great day!`,
			content: "Feedboard has been updated!"
		};
	}
};
