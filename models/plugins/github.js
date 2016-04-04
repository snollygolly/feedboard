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
		const refTypeSuffix = (data.ref_type == "tag") ? "ged" : "ed";
		const content = `A new ${data.ref_type} called __${data.ref}__ was created.`;
		return {
			type: "create",
			title: `A new ${data.ref_type} was created for ${data.repository.full_name}!`,
			content: content
		};
	},
	ping: (data) => {
		return {
			type: "ping",
			title: `${data.repository.full_name} was set up!`,
			content: `Moment of Zen: ${data.zen}`
		};
	},
	pull_request: (data) => {
		const headBranch = data.pull_request.head.ref;
		const baseBranch = data.pull_request.base.ref;
		const content = `__${headBranch}__ is being merged into __${baseBranch}__\n${data.pull_request.title}`;
		return {
			type: "pull_request",
			title: `Pull request #${data.number} was ${data.action} in ${data.pull_request.head.repo.full_name}!`,
			content: content
		};
	},
	push: (data) => {
		// setting the commit length
		const commitCount = data.commits.length;
		// getting the correct plural for commits
		const commitPlural = (commitCount === 1) ? "commit" : "commits";
		// get the name of the branch
		const commitBranch = data.ref.split("/").pop();
		// start building out an array of commit messages
		const commitMessages = [];
		const preMsg = "* ";
		for (const commit of data.commits) {
			commitMessages.push(`${preMsg}${commit.message}`);
		}
		const content = `This push contained __${commitCount}__ ${commitPlural} on the __${commitBranch}__ branch.\n${commitMessages.join("\n")}`;
		return {
			type: "push",
			title: `${data.sender.login} performed a push to ${data.repository.full_name}`,
			content: content
		};
	}
};
