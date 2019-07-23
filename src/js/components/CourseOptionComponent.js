import * as React from 'react';
import { Label } from 'react-bootstrap';
import moment from 'moment';

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
		let label = '';
		if (this.props.option.course.get('registered')) {
			label = (
				<small>
          <Label bsStyle="success">Registered</Label>
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
				<h4><strong>{this.props.option.course.get('name')}</strong> {label}</h4>
				{this.props.option.course.get('location').get('name')}
				<br />
				{this.props.option.course.get('location').get('address') + ', '}
				{this.props.option.course.get('location').get('city') + ', '}
				{this.props.option.course.get('location').get('state') + ' '}
				{this.props.option.course.get('location').get('zipcode')}
				<br />
				{`${this.props.option.course.properDays()} ${moment(this.props.option.course.get('timeStart'), 'HH:mm').format('h:mm a')} - ${moment(this.props.option.course.get('timeEnd'), 'HH:mm').format('h:mm a')}`}
				<br />
				Starts on {this.props.option.course.classDates()[0] ? this.props.option.course.classDates()[0].format('ddd, MMM Do, YYYY') : ''}
        <br />
        {`$${this.props.option.user && this.props.option.user.get('price') ? Number(this.props.option.user.get('price')).toFixed(2) : Number(this.props.option.course.get('cost')).toFixed(2)}`}
				<br />
				{this.props.option.course.get('term').get('name')}
			</div>
		);
	}
})
