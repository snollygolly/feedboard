"use strict";

import React from "react";
import ReactDOM from "react-dom";

// MATERIAL-UI
// theme
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import { getMuiTheme, MuiThemeProvider } from "material-ui/styles";
import { grey50 } from "material-ui/styles/colors";
// components
import {
	Card, CardTitle,
	MenuItem,
	Paper,
	SelectField
} from "material-ui";

import _ from "lodash";
import moment from "moment";

import ActivityComponent from "../ActivityComponent";
import AlertComponent from "../AlertComponent";
import RSSComponent from "../RSSComponent";

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
			},
			rss: []
		};

		// Bind functions to this
    this._bootstrap = this._bootstrap.bind(this);
    this._update = this._update.bind(this);
    this._buildNotification = this._buildNotification.bind(this);
    this._createAlert = this._createAlert.bind(this);
    this._removeAlert = this._removeAlert.bind(this);
    this._restart = this._restart.bind(this);
    this._buildFilters = this._buildFilters.bind(this);
    this._doFilter = this._doFilter.bind(this);
  }

	getChildContext() {
		return { muiTheme: getMuiTheme(lightBaseTheme) };
	}

	componentDidMount() {
		socket.emit("bootstrap", "go");

		socket.on("bootstrap", this._bootstrap);
		socket.on("restart", this._restart);
		socket.on("update", this._update);

		if ("Notification" in window) {
			if (Notification.permission !== "granted" && Notification.permission !== "denied") {
				Notification.requestPermission();
			}
	  }

		let _this = this;

		setInterval(function() {
			_this.setState({
				currentTime: moment().format("h:mm:ss a")
			});
		}, 1000);
	}

	// Socket callbacks
	_bootstrap(data) {
		const [rss, activity] = _.partition(JSON.parse(data), (feedData) => {
			return feedData.plugin === "rss";
		});

		let filters = this._buildFilters(activity);

		this.setState({
			activity: activity,
			rss: rss,
			filteredActivity: activity,
			filters: filters
		});
	}

	_update(data) {
		if (data.error === false) {
			if (data.plugin === "rss") {
				let rss = this.state.rss;
				rss.unshift(data);
				rss = rss.slice(0, 25);

				this.setState({ rss });
			} else {
				let activity = this.state.activity;
				activity.unshift(data);
				activity = activity.slice(0, 25);

				let filters = this._buildFilters(activity);

				this.setState({
					activity: activity,
					filters: filters
				});

				this._buildNotification({
					title: "New Feedboard Activity",
					options: {
						icon: data.avatar,
						body: `${data.title}`
					}
				});

				this._doFilter(this.state.activeFilter);
			}
		} else {
			console.error("error: " + data.message);
			console.error(data);
		}
	}

	_buildNotification(data) {
	  if (!("Notification" in window)) {
	  	// Notification not supported
	  } else if (Notification.permission === "granted") {
	    // If it's okay let's create a notification
	    var notification = new Notification(data.title, data.options);
	  } else if (Notification.permission !== "denied") {
	    Notification.requestPermission(function (permission) {
	      if (permission === "granted") {
	        var notification = new Notification(data.title, data.options);
	      }
	    });
	  }
	}

	_createAlert(alert) {
		return {__html: alert};
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
		data.message = {__html: "Feedboard has been updated! <a href=\"javascript:window.location.reload(true);\" class=\"alert-link\">Refresh</a> your browser to get the latest."};
		alerts.unshift(data);
		this.setState({alerts: alerts});
	}

	_buildFilters(activity) {
		let filters = this.state.filters;

		filters.plugin = _.chain(activity)
			.map("plugin")
			.uniq()
			.sortBy()
			.value();

		return filters;
	}

	_doFilter(event, index, value) {
		const activity = this.state.activity;
		let filteredActivity;

		if (value === "") {
			filteredActivity = activity;
		} else {
			filteredActivity = _.filter(activity, {plugin: value});
		}

		this.setState({
			activeFilter: value,
			filteredActivity: filteredActivity
		});
	}

	render() {
		return (
		  <div className="container-fluid" style={{ backgroundColor: grey50 }}>
		  	<div id="alert-container" className="row">
		  		{
		  			this.state.alerts.map((alert, index) => {
		  				return (
		  					<AlertComponent
		  						key={ index }
		  						data={ alert }
		  						removeTask={ this._removeAlert }
		  					/>
	  					);
		  			})
		  		}
		  	</div>
				<div className="row">
					<div className="col-xs-12 col-md-8 feed-panel">
				  	<div id="filter-container" className="row feed-panel-header">
				  		<div className="col-xs-12 col-sm-3">
				  			<span className="current-time">{ this.state.currentTime }</span>
				  		</div>
				  		<div className="col-xs-12 col-sm-3 col-sm-offset-6">
					  		<form style={{ textAlign: "right" }}>
					  			<SelectField
										value={ this.state.activeFilter }
										onChange={ this._doFilter }
										style={{ textAlign: "left" }}
										fullWidth={ true }
									>
					  				<MenuItem value="" primaryText="Filter by Plugin"/>
					  				{
					  					this.state.filters.plugin.map((pluginName, index) => {
					  						return (
					  						  <MenuItem
					  						  	key={ index }
					  						  	value={ pluginName }
														primaryText={ pluginName }
					  						  />
					  						);
					  					})
					  				}
					  			</SelectField>
				  			</form>
				  		</div>
				  	</div>
						<div id="feed-container" className="row feed-panel-body">
							{
								this.state.filteredActivity.map((activity, index) => {
									return (
										<div className="col-xs-12 activity-card-container" key={ index }>
											<ActivityComponent
												data={ activity }
											/>
										</div>
									);
								})
							}
						</div>
					</div>
					<Paper className="col-xs-12 col-md-4 feed-panel">
						<div className="row feed-panel-header">
							<div className="col-xs-3 col-xs-offset-9 col-md-6 col-md-offset-6">
								<form style={{ textAlign: "right" }}>
									<SelectField
										value=""
										style={{ textAlign: "left" }}
										fullWidth={ true }
									>
										<MenuItem value="" primaryText="Filter by Feed"/>
									</SelectField>
								</form>
							</div>
						</div>
						<div id="rss-container" className="row feed-panel-body">
							{
								this.state.rss.map((rss_data, index) => {
									return (
										<div key={ index } className="col-xs-12 rss-card-container">
											<RSSComponent
												data={ rss_data }
											/>
										</div>
									);
								})
							}
						</div>
					</Paper>
				</div>
			</div>
		);
	}
}

AppComponent.childContextTypes = {
	muiTheme: React.PropTypes.object.isRequired
};

export default AppComponent;
