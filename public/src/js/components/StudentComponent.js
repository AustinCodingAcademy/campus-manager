var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
require('backbone-react-component');
var UserModalComponent = require('./UserModalComponent');
var CourseCardComponent = require('./CourseCardComponent');

module.exports = React.createClass({
  mixins: [Backbone.React.Component.mixin],

  userModal: function() {
    ReactDOM.unmountComponentAtNode($('#modal-container')[0]);
    ReactDOM.render(<UserModalComponent collection={this.props.collection} model={this.props.model}/>, $('#modal-container')[0]);
    $('#user-modal' + this.props.model.id).openModal();
    Materialize.updateTextFields();
  },

  render: function() {

    var courseCards = this.props.model.get('courses');

    return (
      <div className="row">
        <div className="col s12 m6">
          <div className="card">
            <div className="card-content">
              <span className="card-title">
                {this.props.model.get('first_name') + ' ' + this.props.model.get('last_name')}
              </span>
              <p>
                <i className="fa fa-fw fa-envelope"></i>
                <a href={'mailto:' + this.props.model.get('username')}>{this.props.model.get('username')}</a>
              </p>
              <p>
                <i className="fa fa-fw fa-github"></i>
                <a href={'https://github.com/' + this.props.model.get('username')}>
                  {this.props.model.get('github')}
                </a>
              </p>
              <p>
                <i className="fa fa-fw fa-globe"></i>
                <a href={this.props.model.get('website')}>
                  {this.props.model.get('website')}
                </a>
              </p>
              <p>
                <i className="fa fa-fw fa-code"></i>
                <a href={'https://codecademy.com/' + this.props.model.get('codecademy')}>
                  {this.props.model.get('codecademy')}
                </a>
              </p>
            </div>
            <div className="card-action">
              <a className="waves-effect waves-teal btn-flat modal-trigger" onClick={this.userModal}>
                Edit
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
