var React = require('react');

module.exports = React.createClass({
	render () {
		return (
			<div className="Select-value" title={this.props.value.title}>
				<span className="Select-value-label">
					{`${this.props.value.location.get('name')}, ${this.props.value.location.get('city')}, ${this.props.value.location.get('state')}`}
				</span>
			</div>
		);
	}
});
