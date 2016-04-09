"use strict";

module.exports.process = (header, data) => {
	// TODO: check for hash correctness?
	// assume all checks have passed here
	const returnObj = pivotalProcessing["activity"](data);
	returnObj.error = false;
	returnObj.icon = "fa-asterisk";
	returnObj.avatar = "/assets/img/pivotal-logo.png";
	returnObj.plugin = "pivotal";
	returnObj.user = data.performed_by.name;
	// send it back
	return returnObj;
};

const pivotalProcessing = {
	activity: (data) => {
		return {
			type: "activity",
			title: `Project: ${data.project.name} - #${data.primary_resources[0].id} [${data.primary_resources[0].story_type}]`,
			content: `${data.primary_resources[0].name}<br>${data.message}`
		};
	}
};
