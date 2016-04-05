import React from "react";
import ReactMarkdown from "react-markdown";

import moment from "moment";

class ActivityComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			iconClass: `fa fa-lg ${this.props.data.icon}`
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({iconClass: `fa fa-lg ${nextProps.data.icon}`});
	}

	render() {
		return (
			<div className="feed-panel panel panel-default">
				<div className="panel-heading">
					<small className="pull-right">{moment(this.props.data.timestamp).format("MMMM Do YYYY, h:mm:ss a")}</small>
					<p className="panel-title">
						<span className={this.state.iconClass}></span>
						{this.props.data.title}
					</p>
				</div>
				<div className="panel-body">
					<img className="panel-avatar" src={this.props.data.avatar} />
					<ReactMarkdown
						source={this.props.data.content}
					/>
				</div>
			</div>
		);
	}
}

export default ActivityComponent;