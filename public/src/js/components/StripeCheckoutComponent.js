var React = require('react');
require('react.backbone');
var StripeCheckout = require('react-stripe-checkout');

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
        that.props.user.fetch();
      }
    });
  },

  render: function() {

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
        <button className="btn btn-primary" disabled={this.getModel().get('paymentAmount') === 0}>2. Pay With Card
          <i className="material-icons right">send</i>
        </button>
      </StripeCheckout>
    );
  }
});
