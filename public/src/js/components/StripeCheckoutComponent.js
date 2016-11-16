var React = require('react');
require('react.backbone');
var StripeCheckout = require('react-stripe-checkout').default;

module.exports = React.createBackboneClass({

  onToken: function(token) {
    var that = this;
    $.ajax('/api/charges/' + token.id, {
      method: 'POST',
      data: {
        amount: this.getModel().get('paymentAmount'),
        card_id: token.card.id
      },
      success: function() {
        that.getModel().set('paymentAmount', 0);
        that.props.user.fetch();
      }
    });
  },


  render: function() {

    var disabled = '';
    if (isNaN(this.getModel().get('paymentAmount')) || this.getModel().get('paymentAmount')<= 0 || this.props.user.id !== this.props.currentUser.id) {
      disabled = 'disabled';
    }

    return (
      <StripeCheckout
        token={this.onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
        name="Austin Coding Academy"
        description="Campus Manager"
        data-locale="auto"
        zipCode={true}
        amount={this.getModel().get('paymentAmount')}
        email={this.getModel().get('username')}
      >
        <button className={'btn btn-primary '+disabled} disabled={disabled} data-test="make-payment">3. Pay With Card
          <i className="material-icons right">send</i>
        </button>
      </StripeCheckout>
    );
  }
});
