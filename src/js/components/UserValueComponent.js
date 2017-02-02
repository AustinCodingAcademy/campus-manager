var React = require('react');

module.exports = React.createClass({
	render () {
		return (
			<div className="Select-value">
				<span className="Select-value-label">
					{this.props.value.user.fullName()}
				</span>
			</div>
		);
	}
});
