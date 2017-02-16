import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');

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
    const listItems = [];
    Object.keys(reviews[this.props.currentUser.get('campus')][Object.keys(review)[0]]).forEach(reviewItem => {
      listItems.push(
        <ListGroupItem
          href={review[Object.keys(review)[0]][reviewItem].href}
          target="_blank"
          data-review={review[Object.keys(review)[0]][reviewItem].key}
          key={review[Object.keys(review)[0]][reviewItem].key}
          onClick={this.handleReviewClick}
        >
         {reviewItem}
         <FontAwesome
           name={this.getModel().get('reviews').includes(review[Object.keys(review)[0]][reviewItem].key) ? 'star' : 'star-o'}
           className="pull-right"
         />
        </ListGroupItem>
      );
      return (
        <Col xs={12 / this.reviews.length} key={Object.keys(review)[0]}>
          <h5>{Object.keys(review)[0]}</h5>
          <ListGroup>
            {listItems}
          </ListGroup>
        </Col>
      );
    });

    return (
      <Panel
        header={
          <h3>
            <FontAwesome name="star" />
            &nbsp; Reviews
          </h3>
        }
      >
        <h4>Let us and other potential classmates know how we are doing!</h4>
        <Row>
          {reviewsLists}
        </Row>
      </Panel>
    );
  }
});
