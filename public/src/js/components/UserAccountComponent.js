var React = require('react');
var Backbone = require('backbone');
var _ = require('underscore');
var moment = require('moment');
require('react.backbone');
var StripeCheckoutComponent = React.createFactory(require('./StripeCheckoutComponent'));

module.exports = React.createBackboneClass({
  paymentModel: new Backbone.Model({
    paymentAmount: 0,
    username: ''
  }),

  _changeAmount (e) {
    this.paymentModel.set({
      paymentAmount: Number(this.refs.amount.value) * 100,
      username: this.getModel().get('username')
    });
  },

  render () {
    var that = this
    var charges = _.map(_.filter(this.getModel().get('charges'), charge => {
      return !charge.refunded && charge.paid;
    }), charge => {
      that.props.userAccountModel.set('totalPaid', that.props.userAccountModel.get('totalPaid') + (charge.amount / 100));
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
          <div className="input-field">
            <label className="grey-text text-darken-2" htmlFor="payment-amount">2. Enter Payment Amount ($)</label>
            <input id="payment-amount" ref="amount" onChange={this._changeAmount} placeholder={Number(this.paymentModel.get('paymentAmount')).toFixed(2)} type="text" className="validate active"/>
          </div>
          <StripeCheckoutComponent user={this.getModel()} model={this.paymentModel} currentUser={this.props.currentUser} />
        </div>
      </div>
    );
  }
});
