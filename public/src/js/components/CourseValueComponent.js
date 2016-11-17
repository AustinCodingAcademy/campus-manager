var React = require('react');

module.exports = React.createClass({
	propTypes: {
		children: React.PropTypes.node,
		placeholder: React.PropTypes.string,
		value: React.PropTypes.object
	},
	render () {
		return (
			<div className="Select-value" title={this.props.value.title}>
				<span className="Select-value-label">
					{this.props.value.course.get('name') + ', ' + this.props.value.course.get('location').get('name') + ', ' + this.props.value.course.get('location').get('city')+ ' (' + this.props.value.course.shortDays() + ')'}
				</span>
			</div>
		);
	}
});
