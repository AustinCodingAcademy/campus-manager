var _ = require('underscore');

module.exports = {
  scoreColor: function(score) {
    if (score >= 70 && score < 80) {
      return 'orangered';
    }
    if (score >= 80 && score < 90) {
      return '#E8A812';
    }
    if (score >= 90 && score < 100) {
      return 'green';
    }
    if (score === 100) {
      return 'blue';
    }
    return 'red';
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

    // parser.protocol; // => "http:"
    // parser.hostname; // => "example.com"
    // parser.port;     // => "3000"
    // parser.pathname; // => "/pathname/"
    // parser.search;   // => "?search=test"
    // parser.hash;     // => "#hash"
    // parser.host;     // => "example.com:3000"
  }
}
