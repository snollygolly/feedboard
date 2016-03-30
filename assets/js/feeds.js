var panelTemplate;

$(document).ready(function() {
	clearFeed();

	var socket = io();

	// for updates
	socket.on('update', function(data){
		buildPanel("title", data);
		console.log(data);
	});
});

function clearFeed() {
	$("#feed-container").empty();
}

function buildPanel(title, content) {
	// build the main panel container
	var panelDiv = document.createElement("div");
	$(panelDiv).addClass("feed-panel panel panel-default");
	// build the heading container
	var panelHeading = document.createElement("div");
	$(panelHeading).addClass("panel-heading");
	// build the actual title
	var panelTitle = document.createElement("h3");
	$(panelTitle).addClass("panel-title");
	$(panelTitle).html(title);
	// build the body
	var panelBody = document.createElement("div");
	$(panelBody).addClass("panel-body");
	$(panelBody).html(content);
	// start attaching elements to each othe
	$(panelHeading).append(panelTitle);
	$(panelDiv).append(panelHeading);
	$(panelDiv).append(panelBody);
	// append the panel
	$("#feed-container").append(panelDiv);
}
