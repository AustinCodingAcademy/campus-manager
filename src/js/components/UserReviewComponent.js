import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
const FontAwesome = require('react-fontawesome');

module.exports = React.createBackboneClass({
  reviews: [
    'Austin': {
      Google: {
        href: 'https://www.google.com/?gws_rd=ssl#tbm=lcl&q=Austin+Coding+Academy&lrd=0x8644b4e31ad087bd:0xd6644ce54fe2531c,3,&rlfi=hd:;si:15448557169559098140;mv:!1m3!1d234.15636136085305!2d-97.7405641!3d30.268875500000007!2m3!1f0!2f0!3f0!3m2!1i1500!2i835!4f13.1',
        key: 'austin-google'
      },
      Yelp: {
        href: 'https://www.yelp.com/writeareview/biz/lc6l_b5X8qDFFdyLFt7ySg?return_url=%2Fbiz%2Flc6l_b5X8qDFFdyLFt7ySg',
        key: 'austin-yelp'
      },
      'Course Report': {
        href: 'https://www.coursereport.com/schools/austin-coding-academy#/reviews/write-a-review',
        key: 'austin-coursereport'
      },
      SwitchUp: {
        href: 'https://www.switchup.org/bootcamps/austin-coding-academy',
        key: 'austin-switchup'
      },
      Thinkful: {
        href: 'https://www.thinkful.com/bootcamps/austin-coding-academy/',
        key: 'austin-thinkful'
      }
    },
    'San Antonio': {
      Google: {
        href: 'https://www.google.com/?gws_rd=ssl#q=San%20Antonio%20Coding%20Academy&tbs=lf_od:-1,lf_oh:-1,lf:1,lf_ui:2,lf_pqs:EAE&rflfq=1&rlha=0&rllag=29435051,-98485887,1138&tbm=lcl&rldimm=9940786448329656884&lrd=0x865c5f51a21d2429:0x89f4c49b30b4ca34,3,',
        key: 'sanantonio-google'
      },
      Yelp: {
        href: 'https://www.yelp.com/writeareview/biz/lc6l_b5X8qDFFdyLFt7ySg?return_url=%2Fbiz%2Flc6l_b5X8qDFFdyLFt7ySg',
        key: 'sanantonio-yelp'
      },
      'Course Report': {
        href: 'https://www.coursereport.com/schools/austin-coding-academy#/reviews/write-a-review',
        key: 'sanantonio-coursereport'
      },
      SwitchUp: {
        href: 'https://www.switchup.org/bootcamps/austin-coding-academy',
        key: 'sanantonio-switchup'
      },
      Thinkful: {
        href: 'https://www.thinkful.com/bootcamps/austin-coding-academy/',
        key: 'sanantonio-thinkful'
      }
    }
  },

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
