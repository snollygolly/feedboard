var panelTemplate;

var md = new Remarkable({
	"html": true,
	"breaks": true
});

$(document).ready(function() {
	clearFeed();

	var socket = io();
	socket.emit("bootstrap", "go");

	// for bootstrapping the data (or maybe just refreshing?)
	socket.on("bootstrap", function(data){
		try{
			data = JSON.parse(data);
			while (data && data.length > 0){
				buildPanel(data.shift());
			}
		}catch(err){
			console.log("error: " + data.message);
			console.log(data);
		}
	});
	// for updates
	socket.on("update", function(data){
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
	$(panelDiv).addClass("feed-card card");
	// build the heading container
	var panelHeading = document.createElement("div");
	$(panelHeading).addClass("card-header");
	// build the icon
	var panelIcon = document.createElement("span");
	$(panelIcon).addClass("fa-lg fa " + data.icon);
	// build the timestamp
	var panelTime = document.createElement("h6");
	$(panelTime).addClass("pull-right");
	$(panelTime).html(moment(data.timestamp).format("MMMM Do YYYY, h:mm:ss a"));
	// build the actual title
	var panelTitle = document.createElement("p");
	$(panelTitle).addClass("card-title");
	$(panelTitle).html("&nbsp;&nbsp;&nbsp;" + data.title);
	// build the avatar
	var panelAvatar = document.createElement("img");
	$(panelAvatar).addClass("panel-avatar");
	$(panelAvatar).attr("src", data.avatar);
	// build the body
	var panelBody = document.createElement("div");
	$(panelBody).addClass("card-block");
	$(panelBody).html(md.render(data.content));
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
