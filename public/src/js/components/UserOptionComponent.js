var React = require('react');

module.exports = React.createClass({
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
		return (
			<div
			className={this.props.className}
			onMouseDown={this.handleMouseDown}
			onMouseEnter={this.handleMouseEnter}
			onMouseMove={this.handleMouseMove}
			title={this.props.option.title}>
				<h4><strong>{this.props.option.user.fullName()}</strong></h4>
				{this.props.option.user.get('username')}
        <br />
				{this.props.option.user.get('phone')}
			</div>
		);
	}
})
