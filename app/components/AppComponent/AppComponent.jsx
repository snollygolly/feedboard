import React from "react";
import ReactDOM from "react-dom";

import _ from "lodash";
import moment from "moment";

import ActivityComponent from "../ActivityComponent";
import AlertComponent from "../AlertComponent";

let socket;

socket = io();

class AppComponent extends React.Component {
	constructor(props) {
    super(props);

    // Initial State
    this.state = {
    	activeFilter: "",
			activity: [],
			alerts: [],
			currentTime: moment().format("h:mm:ss a"),
			filteredActivity: [],
			filters: {
				plugin: [],
				user: []
			}
		};

		// Bind functions to this
    this._bootstrap = this._bootstrap.bind(this);
    this._update = this._update.bind(this);
    this._removeAlert = this._removeAlert.bind(this);
    this._restart = this._restart.bind(this);
    this._doFilter = this._doFilter.bind(this);
  }

	componentDidMount() {
		socket.emit("bootstrap", "go");

		socket.on("bootstrap", this._bootstrap);
		socket.on("restart", this._restart);
		socket.on("update", this._update);

		let _this = this;

		setInterval(function() {
			_this.setState({
				currentTime: moment().format("h:mm:ss a")
			});
		}, 1000);
	}

	// Socket callbacks
	_bootstrap(data) {
		let activity = JSON.parse(data);
		let filters = this.state.filters;
		
		filters.plugin = _.chain(activity)
			.map('plugin')
			.uniq()
			.sortBy()
			.value();

		this.setState({
			activity: activity,
			filteredActivity: activity,
			filters: filters
		});
	}

	_update(data) {
		if (data.error === false) {
			let activity = this.state.activity;
			activity.unshift(data);
			this.setState({activity: activity});
			this._doFilter(this.state.activeFilter);
		} else {
			console.error("error: " + data.message);
			console.error(data);
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

	_doFilter(event) {
		let activity = this.state.activity;
		let filteredActivity = _.cloneDeep(activity);
		let pluginName = typeof event === "object" ? event.target.value : event;

		if (pluginName && pluginName !== "") {
			filteredActivity = _.filter(activity, {plugin: pluginName});
		}

		this.setState({
			activeFilter: pluginName,
			filteredActivity: filteredActivity
		});
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
		  	<div id="filter-container" className="row">
		  		<div className="col-xs-12 col-md-3">
		  			<span className="current-time">{this.state.currentTime}</span>
		  		</div>
		  		<div className="col-xs-12 col-md-3 col-md-offset-6">
			  		<form>
			  			<select defaultValue="" onChange={this._doFilter} className="form-control">
			  				<option value="">Filter by Plugin</option>
			  				{
			  					this.state.filters.plugin.map((pluginName, index) => {
			  						return (
			  						  <option
			  						  	key={index}
			  						  	value={pluginName}
			  						  >
			  						  	{pluginName}
			  						  </option>
			  						);
			  					})
			  				}
			  			</select>
			  			</form>
		  		</div>
		  	</div>
				<div id="feed-container" className="row">
					{
						this.state.filteredActivity.map((activity, index) => {
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