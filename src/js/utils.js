const _ = require('underscore');
const Hashids = require('hashids');
const hashids = new Hashids();
const moment = require('moment');

module.exports = {
  scoreColor: function(score) {
    if (score >= 70 && score < 85) {
      return '#f0ad4e';
    }
    if (score >= 85 && score < 100) {
      return '#5cb85c';
    }
    if (score === 100) {
      return '#337ab7';
    }
    return '#d9534f';
  },

  bsStyle(score) {
    if (score >= 70 && score < 85) {
      return 'warning';
    }
    if (score >= 85 && score < 100) {
      return 'success';
    }
    if (score === 100) {
      return 'primary';
    }
    return 'danger';
  },

  weightedGradeAverage: function(checkpointGrades, dailyGrades) {
    var dailyAverage;
    var dailyLength = dailyGrades.length;
    if (dailyLength) {
      dailyAverage = _.reduce(dailyGrades, function(memo, dailyLength) { return memo + dailyLength; }) / dailyLength;
    }

    var checkpointAverage;
    var checkpointLength = checkpointGrades.length;
    if (checkpointLength) {
      checkpointAverage = _.reduce(checkpointGrades, function(memo, checkpointLength) { return memo + checkpointLength; }) / checkpointLength;
    }

    if (!checkpointAverage && !dailyAverage){
      return 0;
    } else if (!_.isNumber(checkpointAverage)) {
      return Math.round(dailyAverage);
    } else if (!_.isNumber(dailyAverage)) {
      return Math.round(checkpointAverage);
    } else {
      return Math.round(dailyAverage * .3 + checkpointAverage * .7);
    }
  },

  urlParse: function(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  },

  campusKey: function(user) {
    const campus = user.campus ? user.campus : user.get('campus');
    let key = 'austin'
    switch (campus) {
      case 'San Antonio':
        key = 'sanantonio';
        break;
      case 'Dallas':
        key = 'dallas';
        break;
      case 'Houston':
        key = 'houstontx';
        break;
    }
    return key;
  },

  attendanceCode() {
    return hashids.encode(Number(moment().format('YYYY-MM-DD').split('-').join(''))).slice(0, 4).toUpperCase();
  },

  jitsiUrl(course) {
    return 'https://meet.jit.si/' + hashids.encode([moment.utc(course.get('createdAt')).unix(), moment().format('MMDDYYYY')]);
  }
}
