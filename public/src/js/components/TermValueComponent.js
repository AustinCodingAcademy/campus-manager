import * as React from 'react';
const moment = require('moment');

module.exports = React.createClass({
	render () {
		return (
			<div className="Select-value" title={this.props.value.title}>
				<span className="Select-value-label">
					{`${this.props.value.term.get('name')} (${moment.utc(this.props.value.term.get('start_date')).format('ddd, MMM Do, YYYY')} - ${moment.utc(this.props.value.term.get('start_date')).format('ddd, MMM Do, YYYY')})`}
				</span>
			</div>
		);
	}
});
