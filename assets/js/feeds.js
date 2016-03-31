var panelTemplate;

$(document).ready(function() {
	clearFeed();

	var socket = io();

	// for updates
	socket.on('update', function(data){
		if (data.error === false) {
			buildPanel(data);
		}else{
			console.log("error: " + data.message);
			console.log(data);
		}
	});
});

function clearFeed() {
	$("#feed-container").empty();
}

function buildPanel(data) {
	// build the main panel container
	var panelDiv = document.createElement("div");
	$(panelDiv).addClass("feed-panel panel panel-default");
	// build the heading container
	var panelHeading = document.createElement("div");
	$(panelHeading).addClass("panel-heading");
	// build the icon
	var panelIcon = document.createElement("span");
	$(panelIcon).addClass("fa-2x fa " + data.icon);
	// build the timestamp
	var panelTime = document.createElement("h6");
	$(panelTime).addClass("pull-right");
	$(panelTime).html(data.timestamp);
	// build the actual title
	var panelTitle = document.createElement("p");
	$(panelTitle).addClass("panel-title");
	$(panelTitle).html("&nbsp;&nbsp;&nbsp;" + data.title);
	// build the avatar
	var panelAvatar = document.createElement("img");
	$(panelAvatar).addClass("panel-avatar");
	$(panelAvatar).attr("src", data.avatar);
	// build the body
	var panelBody = document.createElement("div");
	$(panelBody).addClass("panel-body");
	$(panelBody).html(data.content);
	// start attaching elements to each othe
	$(panelTitle).prepend(panelIcon);
	$(panelHeading).append(panelTime);
	$(panelHeading).append(panelTitle);
	$(panelDiv).append(panelHeading);
	$(panelBody).prepend(panelAvatar);
	$(panelDiv).append(panelBody);
	// prepend the panel
	$(panelDiv).hide().prependTo("#feed-container").fadeIn(1000);
}
