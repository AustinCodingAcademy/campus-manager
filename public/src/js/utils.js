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
    var dailyAverage = 0;
    var dailyLength = dailyGrades.length;
    if (dailyLength) {
      dailyAverage = _.reduce(dailyGrades, function(memo, dailyLength) { return memo + dailyLength; }) / dailyLength;
    }

    var checkpointAverage = 0;
    var checkpointLength = checkpointGrades.length;
    if (checkpointLength) {
      checkpointAverage = _.reduce(checkpointGrades, function(memo, checkpointLength) { return memo + checkpointLength; }) / checkpointLength;
    }

    if (!checkpointAverage && !dailyAverage){
      return 0;
    } else if (!checkpointAverage) {
      return Math.round(dailyAverage);
    } else if (!dailyAverage) {
      return Math.round(checkpointAverage);
    } else {
      return Math.round(dailyAverage * .3 + checkpointAverage * .7);
    }
  }
}
