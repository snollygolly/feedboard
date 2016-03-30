"use strict";

module.exports.process = (header, data) => {
	// TODO: check for user agency (hookshot)
	// TODO: check for hash correctness
	// assume all checks have passed here
	const returnObj = githubProcessing[header["x-github-event"]](data);
	console.log(returnObj);
	returnObj.error = false;
	// send it back
	return returnObj;
};

const githubProcessing = {
	ping: (data) => {
		return {
			title: `Github: ${data.repository.full_name} was set up!`,
			content: data.zen
		};
	},
	push: (data) => {
		return {
			title: `Github: ${data.head_commit.author.name} performed a push to ${data.repository.name}`,
			content: data.head_commit.message
		};
	}
};
