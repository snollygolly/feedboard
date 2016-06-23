import React from "react";
import ReactMarkdown from "react-markdown";

// MATERIAL-UI
// theme
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import { getMuiTheme, MuiThemeProvider } from "material-ui/styles";
import { grey800 } from "material-ui/styles/colors";
// components
import {
	Card, CardActions, CardHeader, CardText, CardTitle,
	FontIcon
} from "material-ui";

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
		const cardHeaderStyle = {
			backgroundColor: this.context.muiTheme.palette.accent2Color
		};
		const cardTextStyle = {
			paddingLeft: "8rem",
			minHeight: "8rem",
			position: "relative"
		};
		return (
			<Card>
				<CardHeader
					avatar={ <FontIcon className={this.state.iconClass} color={ grey800 } /> }
					title={ this.props.data.title }
					titleColor={ grey800 }
					children={ <small className="pull-right" style={{ color: grey800 }}>{moment(this.props.data.timestamp).format("MMMM Do YYYY, h:mm:ss a")}</small> }
					style={ cardHeaderStyle }
				>
				</CardHeader>
				<CardText style={ cardTextStyle }>
					<img className="activity-card-avatar" src={this.props.data.avatar} />
					<ReactMarkdown
						source={this.props.data.content}
					/>
				</CardText>
			</Card>
		);
	}
}

ActivityComponent.contextTypes = {
	muiTheme: React.PropTypes.object.isRequired
};

export default ActivityComponent;
