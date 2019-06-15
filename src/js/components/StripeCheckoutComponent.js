import * as React from 'react';
import * as Backbone from 'backbone';
import StripeCheckout from 'react-stripe-checkout';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import PlaidLink from 'react-plaid-link';
import PayConfirmationModalComponent from './PayConfirmationModalComponent';

module.exports = React.createBackboneClass({
  getInitialState() {
    return {
      paymentAmount: this.props.paymentAmount,
      course: this.props.course,
      showModal: false
    };
  },

  open() {
    this.setState({
      showModal: true
    });
  },

  close() {
    this.setState({
      showModal: false
    });
  },

  register() {
    this.setState({
      paymentAmount: 0
    });
    Backbone.$.ajax('/api/registrations', {
      method: 'POST',
      data: {
        courseId: this.state.course.id,
        userId: this.getModel().id,
        track: true
      },
      success: () => {
        this.state.course.get('registrations').add(this.getModel());
        this.getModel().fetch();
        this.open();
      },
      error: (model, res) => {
        this.setState({
          error: res.responseJSON.message,
          alertVisible: ''
        });
      }
    });
  },

  onToken(token) {
    $.ajax('/api/charges/' + token.id, {
      method: 'POST',
      data: {
        amount: this.state.paymentAmount * 1.03,
        card_id: token.card.id,
        course_id: this.state.course.id,
        user_id: this.getModel().id,
        fee: this.state.paymentAmount * 0.03
      },
      success: this.register
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      paymentAmount: nextProps.paymentAmount,
      course: nextProps.course,
      balance: nextProps.balance
    });
  },

  handleOnSuccess(token, metadata) {
    $.ajax('/api/charges/plaid/' + token, {
      method: 'POST',
      data: {
        amount: this.state.paymentAmount,
        course_id: this.state.course.id,
        user_id: this.getModel().id,
        fee: 0,
        metadata
      },
      success: this.register
    });
  },

  handleOnExit() {
    // handle the case when your user exits Link
  },

  render() {
    return (
      <div>
        <PlaidLink
          clientName="Austin Coding Academy"
          env={process.env.PLAID_ENV}
          product={process.env.PLAID_PRODUCTS}
          publicKey={process.env.PLAID_PUBLIC_KEY}
          onExit={this.handleOnExit}
          onSuccess={this.handleOnSuccess}
          style={{width: '100%', padding: 0, borderWidth: 0}}>
          <Button block bsStyle="primary" disabled={!(this.state.course.id && Number(this.state.paymentAmount) > 0 && (Number(this.state.paymentAmount) / 100 >= 490 || this.props.currentUser.get('is_admin') || this.state.balance < 0))} data-test="make-payment">
            <FontAwesome name="bank" /> 3. Pay by eCheck (No Fee)
          </Button>
        </PlaidLink>
        <div style={{display: 'flex', justifyContent: 'center', margin: '5px 0'}}>Or</div>
        <StripeCheckout
          token={this.onToken}
          stripeKey={process.env.STRIPE_PUBLISHABLE_KEY}
          name="Austin Coding Academy"
          description="Campus Manager"
          data-locale="auto"
          zipCode={true}
          amount={Number(this.state.paymentAmount) * 1.03}
          email={this.getModel().get('username')}
        >
          <Button block bsStyle="primary" disabled={!(this.state.course.id && Number(this.state.paymentAmount) > 0 && (Number(this.state.paymentAmount) / 100 >= 490 || this.props.currentUser.get('is_admin') || this.state.balance < 0))} data-test="make-payment">
            <FontAwesome name="credit-card" /> 3. Pay With Card (+ 3% fee)
          </Button>
        </StripeCheckout>
        <PayConfirmationModalComponent
          show={this.state.showModal}
          onHide={this.close}
        />
      </div>
    );
  }
});
