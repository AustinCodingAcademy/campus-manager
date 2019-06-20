// join files in one file, so we can use a single session for all tests
function extend(target) {
  const sources = [].slice.call(arguments, 1);
  sources.forEach(source => {
    for (const prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
};

[
  '../CreateSession',
  '../CreateClient',
  '../CreateTerm',
  '../CreateLocation',
  '../CreateTextbook',
  '../CreateCourse',
  '../MakeStudent',
  '../RegisterCourse'
].forEach(test => {
  module.exports = extend(module.exports, require(test));
});
