var React = require('react');
var _ = require('underscore');
var moment = require('moment');
var StripeCheckoutComponent = React.createFactory(require('./StripeCheckoutComponent'));
var Select = require('react-select');
var CourseOptionComponent = require('./CourseOptionComponent');
var CourseValueComponent = require('./CourseValueComponent');

module.exports = React.createBackboneClass({
  mixins: [
    React.BackboneMixin('terms', 'update'),
    React.BackboneMixin('paymentModel', 'change')
  ],

  setValue (value) {
    this.props.paymentModel.set('value', value);
  },

  _changeAmount (e) {
    this.props.paymentModel.set({
      paymentAmount: Number(this.refs.amount.value) * 100,
      username: this.getModel().get('username')
    });
  },

  render () {
    var courses = [];
    var currentCourse = this.getModel().currentCourse();
    var futureCourse = this.getModel().futureCourse();

    if (currentCourse) {
      currentCourse.set('registered', true);
      courses.push(currentCourse);
    }

    if (futureCourse) {
      futureCourse.set('registered', true);
      courses.push(futureCourse)
    } else {
      this.props.terms.each(term => {
        term.get('courses').each(course => {
          courses.push(course);
        });
      });
    }

    var options = [];

    _.each(courses, course => {
      var label = course.get('name') +
      course.get('location').get('name') +
      course.get('location').get('address') +
      course.get('location').get('city') +
      course.get('location').get('state') +
      course.get('location').get('zipcode');
      options.push({
        value: course.id,
        label: label,
        course: course,
        user: this.props.user
      });
    });

    this.props.userAccountModel.set('totalPaid', 0);
    var charges = _.map(_.filter(this.getModel().get('charges'), charge => {
      return !charge.refunded && charge.paid;
    }), charge => {
      this.props.userAccountModel.set('totalPaid', this.props.userAccountModel.get('totalPaid') + (charge.amount / 100));
      return(
        <tr key={charge.created}>
          <td>{('$' + (charge.amount / 100).toFixed(2))}</td>
          <td>*{charge.source.last4}</td>
          <td>{moment.unix(charge.created).format('MM/DD/YY')}</td>
        </tr>
      )
    });

    return (
      <div className="card">
        <div className="card-content">
          <span className="card-title">Account</span>
          <table className="striped">
            <thead>
              <tr>
                <th>Cost</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{this.props.userAccountModel.get('courseCharges')}</tbody>
            <tfoot></tfoot>
          </table>
          <hr />
          <table className="striped">
            <thead>
              <tr>
                <th>Paid</th>
                <th>Card</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>{charges}</tbody>
            <tfoot>
              <tr>
                <th><span className={ (this.props.userAccountModel.get('totalPaid') - this.props.userAccountModel.get('totalCourseCost') < 0) ? 'score60' : '' }>${(this.props.userAccountModel.get('totalPaid') - this.props.userAccountModel.get('totalCourseCost')).toFixed(2)}</span></th>
                <th>Balance</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
          <label className="grey-text text-darken-2" htmlFor="course-payment">
            1. What are you paying for?
          </label>
          <Select
            name="courses"
            options={options}
            optionComponent={CourseOptionComponent}
            placeholder="Select a course"
            valueComponent={CourseValueComponent}
            value={this.props.paymentModel.get('value')}
            onChange={this.setValue}
            id="course-payment"
            data-test="course-payment"
          />
          <br />
          <div className="input-field">
            <label className="grey-text text-darken-2" htmlFor="payment-amount">2. Enter Payment Amount ($)</label>
            <input id="payment-amount" ref="amount" onChange={this._changeAmount} placeholder={Number(this.props.paymentModel.get('paymentAmount')).toFixed(2)} type="text" className="validate active"/>
          </div>
          <StripeCheckoutComponent user={this.getModel()} model={this.props.paymentModel} />
        </div>
      </div>
    );
  }
});
