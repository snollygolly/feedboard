import React from "react";

import ActivityComponent from "../ActivityComponent";

let socket;

socket = io();

class AppComponent extends React.Component {
	constructor(props) {
    super(props);

    // Initial State
    this.state = {
			activity: []
		};

		// Bind functions to this
    this._bootstrap = this._bootstrap.bind(this);
    this._update = this._update.bind(this);
    this._restart = this._restart.bind(this);
  }

	componentDidMount() {
		socket.emit("bootstrap", "go");

		socket.on("bootstrap", this._bootstrap);
		socket.on("restart", this._restart);
		socket.on("update", this._update);
	}

	// Socket callbacks
	_bootstrap(data) {
		this.setState({activity: JSON.parse(data)});
	}

	_update(data) {
		if (data.error === false) {
			let {activity} = this.state;
			activity.unshift(data);
			this.setState({activity: activity});
		} else {
			console.log("error: " + data.message);
			console.log(data);
		}
	}

	_restart(data) {
		setTimeout(function() {
			document.location.reload(true);
		}, data.time * 1000);
	}

	render() {
		return (
		  <div className="container-fluid">
				<div id="feed-container" className="row">
					{
						this.state.activity.map((activity, index) => {
							return (
								<ActivityComponent
									key={index}
									data={activity}
								/>
							);
						})
					}
				</div>
			</div>
		);
	}
}

export default AppComponent;
