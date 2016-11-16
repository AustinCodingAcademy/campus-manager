var React = require('react');

module.exports = React.createClass({
	propTypes: {
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		isDisabled: React.PropTypes.bool,
		isFocused: React.PropTypes.bool,
		isSelected: React.PropTypes.bool,
		onFocus: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		option: React.PropTypes.object.isRequired,
	},
	handleMouseDown (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter (event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove (event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	},
	render () {
		let gravatarStyle = {
			borderRadius: 3,
			display: 'inline-block',
			marginRight: 10,
			position: 'relative',
			top: -2,
			verticalAlign: 'middle',
		};
		var badge = '';
		if (this.props.option.course.get('registered')) {
			badge = (
				<small><span className="new badge" data-badge-caption="registered"></span></small>
			);
		}
		return (
			<div className={this.props.className}
				onMouseDown={this.handleMouseDown}
				onMouseEnter={this.handleMouseEnter}
				onMouseMove={this.handleMouseMove}
				title={this.props.option.title}>
				<h5>{this.props.option.course.get('name')}{badge}</h5>
				{this.props.option.course.get('location').get('name')}
				<br />
				{this.props.option.course.get('location').get('address') + ', '}
				{this.props.option.course.get('location').get('city') + ', '}
				{this.props.option.course.get('location').get('state') + ' '}
				{this.props.option.course.get('location').get('zipcode')}
				<br />
				{this.props.option.course.properDays()}
				<br />
				Starts on {this.props.option.course.classDates()[0].format('ddd, MMM Do, YYYY')}
				<br/ >
				{this.props.option.course.get('seats') - this.props.option.course.get('registrations').length} seats left
			</div>
		);
	}
})
