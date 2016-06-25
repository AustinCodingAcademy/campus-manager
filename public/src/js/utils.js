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
  }
}
