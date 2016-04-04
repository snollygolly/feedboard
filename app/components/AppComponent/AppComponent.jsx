import React from "react";
import ReactDOM from 'react-dom';

import ActivityComponent from "../ActivityComponent";
import AlertComponent from "../AlertComponent";

let socket;

socket = io();

class AppComponent extends React.Component {
	constructor(props) {
    super(props);

    // Initial State
    this.state = {
			activity: [],
			alerts: []
		};

		// Bind functions to this
    this._bootstrap = this._bootstrap.bind(this);
    this._update = this._update.bind(this);
    this._removeAlert = this._removeAlert.bind(this);
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
			let activity = this.state.activity;
			activity.unshift(data);
			this.setState({activity: activity});
		} else {
			console.log("error: " + data.message);
			console.log(data);
		}
	}

	_removeAlert(e) {
		let alertIndex = parseInt(e.target.value, 10);
		let alerts = this.state.alerts;
		alerts.splice(alertIndex, 1);
		this.setState({alerts: alerts});
	}

	_restart(data) {
		let alerts = this.state.alerts;
		data.type = "info";
		data.message = "Feedboard has been updated! Refresh your browser to get the latest.";
		alerts.unshift(data);
		this.setState({alerts: alerts});
	}

	render() {
		return (
		  <div className="container-fluid">
		  	<div id="alert-container" className="row">
		  		{
		  			this.state.alerts.map((alert, index) => {
		  				return (
		  					<AlertComponent
		  						key={index}
		  						data={alert}
		  						removeTask={this._removeAlert}
		  					/>
	  					);
		  			})
		  		}
		  	</div>
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