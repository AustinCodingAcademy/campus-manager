var React = require('react');
require('react.backbone');
var StripeCheckout = require('react-stripe-checkout');
var PieChart = require('react-chartjs').Pie;
var _ = require('underscore');
var moment = require('moment');

module.exports = React.createBackboneClass({
  colors: [
    '#10649F',
    '#1F23AD',
    '#F7BB0A',
    '#5215A8',
    '#9C07A1',
    '#6DDD09',
    '#DC094C',
    '#F74A0A',
    '#07AB60',
    '#F7900A'
  ],

  genCityData: function(e) {
    if (e) { e.preventDefault(); }
    this.start_date = this.city = this.end_date = '';
    this.cities = _.uniq(this.getCollection().map(function(term) {
      return term.get('location').get('city');
    })),
    this.getModel().set({
      labels: this.cities,
      title: 'Select a city...'
    });
    this.getModel().set({
      colors: this.genColors(),
      datasets: this.genDatasets(),
    });
  },

  genColors: function() {
    return  _.times(this.getModel().get('labels').length, function(n) {
      return this.colors[n];
    }, this);
  },

  genDatasets: function() {
    return _.times(this.getModel().get('labels').length, function() {
      return 100 / this.getModel().get('labels').length;
    }, this);
  },

  handleClick: function(e) {
    var chart = this.refs.registration.getChart();
    if (chart.getElementAtEvent(e)[0]) {
      var label = chart.getElementAtEvent(e)[0]._model.label;
      if (this.cities.indexOf(label) > -1) {
        this.city = label;
        this.startDates = _.uniq(_.map(this.getCollection().filter(function(term) {
            return term.get('location').get('city') === chart.getElementAtEvent(e)[0]._model.label;
          }), function(term) {
            return moment.utc(term.get('start_date')).format('MMM D, YYYY');
          }));
        this.getModel().set({
          labels: this.startDates,
          title: 'Select start date...'
        });
      } else if (this.startDates.indexOf(label) > -1) {
        this.startDate = label;
        this.selectedTerms = this.getCollection().filter(function(term) {
          return term.get('location').get('city') === this.city && moment.utc(term.get('start_date')).format('MMM D, YYYY') === label;
        }, this);
        this.endDate = moment.utc(this.selectedTerms[0].get('end_date')).format('MMM D, YYYY');
        var courses = []
        _.each(this.selectedTerms, function(term) {
          _.each(term.get('courses').filter(function(course) {
            return course.get('registrations').length < course.get('seats');
          }), function(course) {
            courses.push(course);
          });
        });
        this.courseLabels = {};
        _.each(courses, function(course) {
          this.selectedTerm = _.find(this.selectedTerms, function(term) {
            return term.get('courses').get(course);
          });
          this.courseLabels[course.get('name') + ' (' + this.selectedTerm.get('location').get('name') + ' - ' + course.shortDays() + ')'] = course;
        }, this);
        this.getModel().set({
          labels: _.keys(this.courseLabels),
          title: 'Select a course to register...'
        });
      } else if (this.courseLabels[label]) {
        var that = this;
        var course = this.courseLabels[label];
        var r = confirm('Are you sure you want to register for\n' + course.get('name') + '\n' + course.properDays() + '\n' + this.selectedTerm.locationAddress());
        if (r) {
          course.get('registrations').add(this.props.user);
          var urlRoot = course.urlRoot;
          course.urlRoot += '/register';
          course.save(null, {
            success: function() {
              course.urlRoot = urlRoot;
              that.props.user.fetch();
            }
          });
        }
      }
      this.getModel().set({
        colors: this.genColors(),
        datasets: this.genDatasets()
      });
    }
  },

  render: function() {
    if (_.isUndefined(this.getModel().get('labels')) || !this.getModel().get('labels').length) {
      this.genCityData();
    }
    var data = {
      labels: this.getModel().get('labels'),
      datasets: [{
        data: this.getModel().get('datasets'),
        backgroundColor: this.getModel().get('colors'),
        hoverBackgroundColor: this.getModel().get('colors')
      }]
    };

    var options = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return data.labels[tooltipItem.index];
          }
        }
      },
      responsive: true
    };

    var alreadyRegistered = this.getCollection().some(function(term) {
      return _.intersection(this.props.user.get('courses').pluck('_id'), term.get('courses').pluck('_id')).length > 0;
    }, this);

    return (
      <div className="card">
        <div className="card-content">
          <span className="card-title">Registration</span>
          {this.getCollection().length ?
            <div>
              {alreadyRegistered ?
              <div className="card-panel green">
                <span className="white-text">
                  You are all registered and ready to go! See the course textbook, details, and dates below.
                </span>
              </div>
              :
              <div>
                {this.city ? <h5>{this.city}</h5> : ''}
                {this.startDate && this.endDate ? <h5>{this.startDate + ' - ' + this.endDate}</h5> : ''}
                <h6>{this.getModel().get('title')}</h6>
                <PieChart data={data} options={options} onClick={this.handleClick} ref='registration' redraw/>
                <h6><a href="#" onClick={this.genCityData}><i className="fa fa-refresh"></i> reset</a></h6>
              </div>
              }
            </div>
            :
            <div className="card-panel teal">
              <span className="white-text">Stay tuned for upcoming courses!</span>
            </div>
          }
        </div>
      </div>
    );
  }
});
