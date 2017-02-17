import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');
const reviews = require('../data/reviews');
const socials = require('../data/social');

module.exports = React.createBackboneClass({
  handleReviewClick(e) {
    const review = e.currentTarget.getAttribute('data-review');
    const idx = this.getModel().get('reviews').indexOf(review);
    if (idx === -1) {
      this.getModel().get('reviews').push(review);
      this.getModel().save();
    }
  },

  render() {
    const reviewItems = [];
    Object.keys(reviews[this.getModel().get('campus')]).filter(reviewItem => {
      return reviews[this.getModel().get('campus')][reviewItem].href;
    }).forEach(reviewItem => {
      reviewItems.push(
        <ListGroupItem
          href={reviews[this.getModel().get('campus')][reviewItem].href}
          target="_blank"
          data-review={reviews[this.getModel().get('campus')][reviewItem].key}
          key={reviews[this.getModel().get('campus')][reviewItem].key}
          onClick={this.handleReviewClick}
          className='justify-content-space-between align-items-center'
        >
         {reviewItem}
         <FontAwesome
           name={this.getModel().get('reviews').includes(reviews[this.getModel().get('campus')][reviewItem].key) ? 'star' : 'star-o'}
           className="pull-right"
           size='2x'
         />
        </ListGroupItem>
      );
    });
    const socialItems = [];
    Object.keys(socials[this.getModel().get('campus')]).filter(socialItem => {
      return socials[this.getModel().get('campus')][socialItem].href;
    }).forEach(socialItem => {
      socialItems.push(
        <ListGroupItem
          href={socials[this.getModel().get('campus')][socialItem].href}
          target="_blank"
          data-review={socials[this.getModel().get('campus')][socialItem].key}
          key={socials[this.getModel().get('campus')][socialItem].key}
          onClick={this.handleReviewClick}
          className='justify-content-space-between align-items-center'
        >
          {socialItem}
          <span className="fa-stack pull-right">
            <FontAwesome
              name={this.getModel().get('reviews').includes(socials[this.getModel().get('campus')][socialItem].key) ? 'circle' : 'circle-thin'}
              stack='2x'
            />
            <FontAwesome
              name={socials[this.getModel().get('campus')][socialItem].icon}
              stack='1x'
              inverse={this.getModel().get('reviews').includes(socials[this.getModel().get('campus')][socialItem].key)}
            />
          </span>
        </ListGroupItem>
      );
    });

    return (
      <Panel
        header={
          <h3>
            <FontAwesome name="star" />
            &nbsp; {this.getModel().get('campus')} Coding Academy
          </h3>
        }
      >
        <h4>Let the world know how we are doing!</h4>
        <Row>
          <Col xs={12} md={6}>
            <ListGroup>{reviewItems}</ListGroup>
          </Col>
          <Col xs={12} md={6}>
            <ListGroup>{socialItems}</ListGroup>
          </Col>
        </Row>
      </Panel>
    );
  }
});
