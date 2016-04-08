import React from "react";
import { Alert } from "react-bootstrap";

class AlertComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	render() {
		return (
			<Alert
				bsStyle={this.props.data.type}
				onDismiss={this.props.removeTask}
				className="alert-dismissable"
			>
		    <span dangerouslySetInnerHTML={this.props.data.message} />
		  </Alert>
		);
	}
}

export default AlertComponent;