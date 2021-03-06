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
	FlatButton,
	FontIcon
} from "material-ui";

import moment from "moment";

class RSSComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const cardHeaderStyle = {
			backgroundColor: this.context.muiTheme.palette.accent2Color
		};
		const cardHeaderTextStyle = {
			maxWidth: "60%",
			paddingRight: "0px"
		};
		const cardHeaderTimestampStyle = {
			color: grey800,
			width: "40%",
			paddingLeft: "16px",
			textAlign: "right",
			whiteSpace: "initial"
		};
		const cardTextStyle = {
			paddingLeft: "8rem",
			minHeight: "8rem",
			position: "relative"
		};
		const cardActionsStyle = {
			textAlign: "right"
		};
		return (
			<Card>
				<CardHeader
					title={ this.props.data.title }
					titleColor={ grey800 }
					textStyle={ cardHeaderTextStyle }
					style={ cardHeaderStyle }
				>
					<small className="pull-right" style={ cardHeaderTimestampStyle }>{moment(this.props.data.timestamp).format("MMMM Do YYYY, h:mm:ss a")}</small>
				</CardHeader>
				<CardText style={ cardTextStyle }>
					<img
						className="rss-card-avatar"
						alt={ this.props.data.provider }
						src={ this.props.data.avatar }
					/>
					<p
						dangerouslySetInnerHTML={{ __html: this.props.data.content }}
						className="rss-card-body"
					/>
				</CardText>
				<CardActions
					style={ cardActionsStyle }
				>
					<FlatButton
						label="Read More"
						secondary={ true }
						onTouchTap={ () => { this.props.handleRSSModalOpen({ title: this.props.data.title, src: this.props.data.link }) } }
					/>
				</CardActions>
			</Card>
		);
	}
}

RSSComponent.contextTypes = {
	muiTheme: React.PropTypes.object.isRequired
};

export default RSSComponent;
