"use strict";

import config from "../../../config.json";

import React from "react";
import ReactDOM from "react-dom";

// MATERIAL-UI
// theme
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import { getMuiTheme, MuiThemeProvider } from "material-ui/styles";
import { grey50, grey100 } from "material-ui/styles/colors";
// components
import {
	Card, CardTitle,
	Dialog,
	MenuItem,
	Paper,
	RefreshIndicator,
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
			activity: [],
			rss: [],
			rssEnabled: config.site.rss && config.site.rss.length > 0,
			rssModal: {
				title: null,
				src: null,
				isOpen: false
			},
    	activeFilter: {
				activity: "",
				rss: ""
			},
			filteredData: {
				activity: [],
				rss: []
			},
			filters: {
				activity: [],
				rss: []
			},
			filterValue: {
				activity: "plugin",
				rss: "provider"
			},
			alerts: [],
			currentTime: moment().format("h:mm:ss a")
		};

		this._doFilter = {
			activity: (event, index, value) => {
				_doFilterSpecific(value, "activity");
			},
			rss: (event, index, value) => {
				_doFilterSpecific(value, "rss");
			}
		};

		function _doFilterSpecific(value, type) {
			const data = this.state[type];
			const filteredData = this.state.filteredData;
			const activeFilter = this.state.activeFilter;

			activeFilter[type] = value;
			let filterValue = {};
			filterValue[this.state.filterValue[type]] = value;

			if (value === "") {
				filteredData[type] = data;
			} else {
				filteredData[type] = _.filter(data, filterValue);
			}

			this.setState({
				activeFilter: activeFilter,
				filteredData: filteredData
			});
		}

		// Bind functions to this
    this._bootstrapReceived = this._bootstrapReceived.bind(this);
    this._updateReceived = this._updateReceived.bind(this);
		this._updateItem = this._updateItem.bind(this);
    this._buildNotification = this._buildNotification.bind(this);
    this._createAlert = this._createAlert.bind(this);
    this._removeAlert = this._removeAlert.bind(this);
		this._handleRSSModalClose = this._handleRSSModalClose.bind(this);
		this._handleRSSModalOpen = this._handleRSSModalOpen.bind(this);
		this._handleRSSModalLoad = this._handleRSSModalLoad.bind(this);
    this._restartReceived = this._restartReceived.bind(this);
    this._buildFilters = this._buildFilters.bind(this);
		_doFilterSpecific = _doFilterSpecific.bind(this);
  }

	getChildContext() {
		return { muiTheme: getMuiTheme(lightBaseTheme) };
	}

	componentDidMount() {
		socket.emit("bootstrap", "go");

		socket.on("bootstrap", this._bootstrapReceived);
		socket.on("restart", this._restartReceived);
		socket.on("update", this._updateReceived);

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
	_bootstrapReceived(data) {
		const currentState = this.state;
		const [activity, rss] = _.partition(JSON.parse(data), (feedData) => {
			return feedData.plugin !== "rss";
		});

		currentState.filters = this._buildFilters(activity, rss);

		currentState.filteredData.activity = activity;
		currentState.filteredData.rss = rss;

		this.setState({
			activity: activity,
			rss: rss,
			filteredData: currentState.filteredData,
			filters: currentState.filters
		});
	}

	_updateReceived(data) {
		if (Array.isArray(data)) {
			for (const item of data) {
				this._updateItem(item);
			}
		} else {
			this._updateItem(data);
		}
	}

	_updateItem(data) {
		if (data.error === false) {
			let filters = this.state.filters;
			// RSS update
			if (data.plugin === "rss") {
				let rss = this.state.rss;
				rss.unshift(data);
				rss = rss.slice(0, 25);

				filters = this._buildFilters(undefined, rss);

				this.setState({
					rss: rss,
					filters: filters
				});

				this._doFilter.rss(undefined, undefined, this.state.activeFilter.rss);
			}
			// Activity update
			else {
				let activity = this.state.activity;
				activity.unshift(data);
				activity = activity.slice(0, 25);

				filters = this._buildFilters(activity, undefined);

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

				this._doFilter.activity(undefined, undefined, this.state.activeFilter.activity);
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

	_handleRSSModalClose() {
		const rssModal = this.state.rssModal;
		rssModal.isOpen = false;
		rssModal.isLoading = false;
		rssModal.title = null;
		rssModal.src = null;

		this.setState({
			rssModal: rssModal
		});
	}

	_handleRSSModalOpen(modalData) {
		const rssModal = this.state.rssModal;
		rssModal.isOpen = true;
		rssModal.isLoading = true;
		rssModal.title = modalData.title;
		rssModal.src = modalData.src;

		this.setState({
			rssModal: rssModal
		});
	}

	_handleRSSModalLoad() {
		const rssModal = this.state.rssModal;
		rssModal.isLoading = false;

		this.setState({
			rssModal: rssModal
		});
	}

	_restartReceived(data) {
		let alerts = this.state.alerts;
		data.type = "info";
		data.message = {__html: "Feedboard has been updated! <a href=\"javascript:window.location.reload(true);\" class=\"alert-link\">Refresh</a> your browser to get the latest."};
		alerts.unshift(data);
		this.setState({alerts: alerts});
	}

	_buildFilters(activity, rss) {
		const filters = this.state.filters;

		if (activity) {
			filters.activity = _.chain(activity)
				.map("plugin")
				.uniq()
				.sortBy()
				.value();
			}

		if (rss) {
			filters.rss = _.chain(rss)
				.map("provider")
				.uniq()
				.sortBy()
				.value();
		}

		return filters;
	}

	render() {
		const contentStyle = {
			width: "90%",
			height: "calc(100% - 14.4rem)",
			maxWidth: "none"
		};
		const bodyStyle = {
			padding: "0px"
		};
		const refreshIndicatorStyle = {
			top: "50%",
			left: "50%",
			transform: "translate3d(-50%, -50%, 0px)"
		};
		return (
		  <div className="container-fluid">
		  	<div className="row alert-container">
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
				{ this.state.rssModal.isOpen ?
					<Dialog
						contentStyle={ contentStyle }
						contentClassName="rss-modal-container"
						className="rss-modal"
						bodyStyle={ bodyStyle }
						bodyClassName="rss-modal-content"
	          modal={ false }
	          open={ this.state.rssModal.isOpen }
	          onRequestClose={ this._handleRSSModalClose.bind(this) }
	        >
						<RefreshIndicator
							size={80}
							left={0}
							top={0}
							status={ this.state.rssModal.isLoading ? "loading" : "hide" }
							style={ refreshIndicatorStyle }
						/>
						<iframe
							src={ this.state.rssModal.src }
							onLoad={ this._handleRSSModalLoad.bind(this) }
						></iframe>
					</Dialog> : null
				}
				<div className="row">
					<div className={ this.state.rssEnabled ? "col-xs-12 col-md-8 feed-panel" : "col-xs-12 feed-panel" } >
				  	<div id="filter-container" className="row feed-panel-header">
				  		<div className="col-xs-12 col-sm-3">
				  			<span className="current-time">{ this.state.currentTime }</span>
				  		</div>
				  		<div className="col-xs-12 col-sm-3 col-sm-offset-6">
					  		<form style={{ textAlign: "right" }}>
					  			<SelectField
										value={ this.state.activeFilter.activity }
										onChange={ this._doFilter.activity }
										style={{ textAlign: "left" }}
										fullWidth={ true }
									>
					  				<MenuItem value="" primaryText="Filter by Plugin"/>
					  				{
					  					this.state.filters.activity.map((pluginName, index) => {
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
								this.state.filteredData.activity.map((activity, index) => {
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
					{ this.state.rssEnabled ?
						<Paper className="col-xs-12 col-md-4 feed-panel" style={{ backgroundColor: grey100 }}>
							<div className="row feed-panel-header">
								<div className="col-xs-3 col-xs-offset-9 col-md-6 col-md-offset-6">
									<form style={{ textAlign: "right" }}>
										<SelectField
											value={ this.state.activeFilter.rss }
											onChange={ this._doFilter.rss }
											style={{ textAlign: "left" }}
											fullWidth={ true }
										>
											<MenuItem value="" primaryText="Filter by Feed"/>
											{
												this.state.filters.rss.map((feedName, index) => {
													return (
														<MenuItem
															key={ index }
															value={ feedName }
															primaryText={ feedName }
														/>
													)
												})
											}
										</SelectField>
									</form>
								</div>
							</div>
							<div id="rss-container" className="row feed-panel-body">
								{
									this.state.filteredData.rss.map((rss_data, index) => {
										return (
											<div key={ index } className="col-xs-12 rss-card-container">
												<RSSComponent
													data={ rss_data }
													handleRSSModalOpen={ this._handleRSSModalOpen }
												/>
											</div>
										);
									})
								}
							</div>
						</Paper> : null
					}
				</div>
			</div>
		);
	}
}

AppComponent.childContextTypes = {
	muiTheme: React.PropTypes.object.isRequired
};

export default AppComponent;
