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
		var badge = '';
		if (this.props.option.course.get('registered')) {
			badge = (
				<small>
          <span className="new badge" data-badge-caption="registered"></span>
        </small>
			);
		}
		return (
			<div
			className={this.props.className}
			onMouseDown={this.handleMouseDown}
			onMouseEnter={this.handleMouseEnter}
			onMouseMove={this.handleMouseMove}
			title={this.props.option.title}>
				<h4><strong>{this.props.option.course.get('name')}</strong>{badge}</h4>
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
        <br />
        {`$${this.props.option.user && this.props.option.user.get('price') ? Number(this.props.option.user.get('price')).toFixed(2) : Number(this.props.option.course.get('cost')).toFixed(2)}`}
				<br />
				{this.props.option.course.get('seats') - this.props.option.course.get('registrations').length} seats left
        <br />
				{this.props.option.course.get('term').get('name')}
			</div>
		);
	}
})
