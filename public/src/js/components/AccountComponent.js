var React = require('react');
require('react.backbone');
var StripeCheckout = require('react-stripe-checkout');

module.exports = React.createBackboneClass({

  onToken: function(token) {
    console.log("hello");
  },

  render: function() {
    return (
      <StripeCheckout
        token={this.onToken}
        stripeKey="pk_test_Pi945jG3lbulcX6849528WgI"
        amount={249000}
        name="Austin Coding Academy"
        description="Course"
        data-locale="auto"
        zipCode={true}
        />
    );
  }
});
