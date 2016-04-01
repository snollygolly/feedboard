"use strict";

module.exports.process = (header, data) => {
	// TODO: check for user agency (hookshot)
	// TODO: check for hash correctness
	// assume all checks have passed here
	const returnObj = githubProcessing[header["x-github-event"]](data);
	returnObj.error = false;
	returnObj.icon = "fa-github";
	returnObj.avatar = data.sender.avatar_url;
	returnObj.plugin = "github";
	// send it back
	return returnObj;
};

const githubProcessing = {
	create: (data) => {
		return {
			title: `${data.repository.full_name} was created!`,
			content: data.description
		};
	},
	ping: (data) => {
		return {
			title: `${data.repository.full_name} was set up!`,
			content: `Moment of Zen: ${data.zen}`
		};
	},
	pull_request: (data) => {
		return {
			title: `Pull request #${data.number} was ${data.action} in ${data.pull_request.head.repo.full_name}!`,
			content: data.pull_request.title
		};
	},
	push: (data) => {
		return {
			title: `${data.sender.login} performed a push to ${data.repository.full_name}`,
			content: data.head_commit.message
		};
	}
};
