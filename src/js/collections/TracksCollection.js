const Backbone = require('backbone');
const TrackModel = require('../models/TrackModel');

module.exports = Backbone.Collection.extend({
  url: 'api/tracks',
  model: TrackModel,
  comparator: (a, b) => {
    const aTerm = a.get('courses').pluck('term')[0];
    const bTerm = b.get('courses').pluck('term')[0];
    if (aTerm && bTerm) {
      const aStartDate = aTerm.get('start_date');
      const bStartDate = bTerm.get('start_date');
      if (aStartDate === bTerm) {
        if (aTerm.get('name') === bTerm.get('name')) {
          return 0;
        }
        return aTerm.get('name') > bTerm.get('name') ? 1 : -1;
      }
      return aStartDate > bStartDate ? 1 : -1;
    }
    return 1;
  }
});
