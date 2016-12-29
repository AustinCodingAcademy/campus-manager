import * as React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Button } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      paymentAmount: this.props.paymentAmount,
      course: this.props.course
    };
  },

  onToken(token) {
    $.ajax('/api/charges/' + token.id, {
      method: 'POST',
      data: {
        amount: this.state.paymentAmount,
        card_id: token.card.id,
        course_id: this.state.course.id,
        user_id: this.getModel().id
      },
      success: () => {
        this.setState({
          paymentAmount: 0
        });
        this.state.course.get('registrations').add(this.getModel());
        const urlRoot = this.state.course.urlRoot;
        this.state.course.urlRoot += '/register';
        this.state.course.save(null, {
          success: () => {
            this.state.course.urlRoot = urlRoot;
            this.getModel().fetch();
          }
        });
      }
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      paymentAmount: nextProps.paymentAmount,
      course: nextProps.course
    });
  },

  render() {
    return (
      <StripeCheckout
        token={this.onToken}
        stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
        name="Austin Coding Academy"
        description="Campus Manager"
        data-locale="auto"
        zipCode={true}
        amount={this.state.paymentAmount}
        email={this.getModel().get('username')}
      >
        <Button block bsStyle="primary" disabled={this.state.paymentAmount < 490 || !this.state.course.id} data-test="make-payment">
          <FontAwesome name="credit-card" /> 3. Pay With Card
        </Button>
      </StripeCheckout>
    );
  }
});
