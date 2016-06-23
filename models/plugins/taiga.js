"use strict";

const plugin_options = require("../../config.json").site.plugin_options.taiga;

module.exports.process = (header, data) => {
	// TODO: check for hash correctness?
	// assume all checks have passed here
	if (plugin_options.allowedTypes.indexOf(data.type) === -1) {
		return {error: true, message: "Taiga webhook type not supported"};
	}

	const returnObj = taigaProcessing[data.type](data);
	returnObj.error = false;
	returnObj.icon = "fa-certificate";
	returnObj.avatar = "/assets/img/taiga-logo.svg";
	returnObj.plugin = "taiga";
	returnObj.user = "Taiga";
	if (data.data.owner) {
		returnObj.user = data.data.owner.name;
	}
	// send it back
	return returnObj;
};

// TODO: Parse out UPDATE hooks for each type since Taiga
//       does not send back a nice, formatted message
const taigaProcessing = {
	issue: (data) => {
		const action = `${data.action.replace(/^./, (letter) => {
			return letter.toUpperCase();
		})}d`;

		const content = `${data.data.subject}<br/>${data.data.owner.name} ${action} this Issue`;

		return {
			type: `${data.type}_${data.action}`,
			title: `Project: ${data.data.project} - #${data.data.id} [Issue]`,
			content: content
		};
	},
	task: (data) => {
		const action = `${data.action.replace(/^./, (letter) => {
			return letter.toUpperCase();
		})}d`;

		const content = `${data.data.subject}<br/>${data.data.owner.name} ${action} this Task`;

		return {
			type: `${data.type}_${data.action}`,
			title: `Project: ${data.data.project} - #${data.data.id} [Task]`,
			content: content
		};
	},
	userstory: (data) => {
		const action = `${data.action.replace(/^./, (letter) => {
			return letter.toUpperCase();
		})}d`;

		const content = `${data.data.subject}<br/>${data.data.owner.name} ${action} this User Story`;

		return {
			type: `${data.type}_${data.action}`,
			title: `Project: ${data.data.project} - #${data.data.id} [User Story]`,
			content: content
		};
	}
};
