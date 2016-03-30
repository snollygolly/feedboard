"use strict";

module.exports.process = (header, data) => {
	// TODO: check for user agency (hookshot)
	// TODO: check for hash correctness
	// assume all checks have passed here
	const returnObj = githubProcessing[header["x-github-event"]](data);
	returnObj.error = false;
	// send it back
	return returnObj;
};

const githubProcessing = {
	create: (data) => {
		return {
			title: `Github: ${data.repository.full_name} was created!`,
			content: data.description
		};
	},
	ping: (data) => {
		return {
			title: `Github: ${data.repository.full_name} was set up!`,
			content: data.zen
		};
	},
	pull_request: (data) => {
		return {
			title: `Github: Pull request #${data.number} was ${data.action} in ${data.pull_request.head.repo.full_name}!`,
			content: data.pull_request.title
		};
	},
	push: (data) => {
		return {
			title: `Github: ${data.head_commit.author.name} performed a push to ${data.repository.name}`,
			content: data.head_commit.message
		};
	}
};
