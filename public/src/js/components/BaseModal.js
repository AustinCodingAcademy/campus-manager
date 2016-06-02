var React = require('react');
var Modal = require('react-modal');
var _ = require('underscore');

module.exports = React.createClass({
  render: function() {
    var style = {
      overlay: {
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0, 0.5)'
      },
      content: {
        position: 'fixed',
        left: '0px',
        right: '0px',
        bottom: 'auto'
      }
    };
    var propsStyle = this.props.style || {};

    // Extend the differnet branches of the style object with
    // what, if anything, was passed from props
    style.overlay = _.extend({}, style.overlay, propsStyle.overlay);
    style.content = _.extend({}, style.content, propsStyle.content);

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={style}
        onAfterOpen={this.props.onAfterOpen}
        closeTimeoutMS={this.props.closeTimeoutMS}
        shouldCloseOnOverlayClick={this.props.shouldCloseOnOverlayClick}>
        <i
          onClick={this.props.onRequestClose}
          className="material-icons right small close-icon">close</i>
        {this.props.children}
      </Modal>
    );
  }
})
