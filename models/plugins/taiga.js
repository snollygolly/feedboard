"use strict";

module.exports.process = (header, data) => {
	// TODO: check for hash correctness?
	// assume all checks have passed here
	const returnObj = taigaProcessing["activity"](data);
	returnObj.error = false;
	returnObj.icon = "fa-certificate";
	returnObj.avatar = "/assets/img/taiga-logo.svg";
	returnObj.plugin = "taiga";
	returnObj.user = "Taiga";
	if (data.data.owner) {
		returnObj.user = data.data.owner.user;
	}
	// send it back
	return returnObj;
};

const taigaProcessing = {
	activity: (data) => {
		return {
			type: "activity",
			title: `Project: ${data.data.project} - #${data.data.id} [${data.type}]`,
			content: `${data.data.subject}<br>${data.data.description}`
		};
	}
};
