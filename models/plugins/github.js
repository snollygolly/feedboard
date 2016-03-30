"use strict";

module.exports.process = function* process(data) {
	// TODO: check for user agency (hookshot)
	// TODO: check for hash correctness
	// assume all checks have passed here
	const returnObj = {};
	returnObj.error = false;
	// set additional data
	returnObj.data = {
		type: "push",
		repo_id: data.repository.id,
		repo_name: data.repository.name,
		author: data.head_commit.author.name,
		message: data.head_commit.message
	};
	// set the actual content
	returnObj.title = `Github: ${returnObj.data.author} performed a ${"push"} to ${returnObj.data.repo_name}`;
	returnObj.content = returnObj.data.message;
	// send it back
	return returnObj;
};
