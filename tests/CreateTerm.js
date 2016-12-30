module.exports = {
  'Create Term': browser => {
    browser
    .click('#admin-dropdown')
    .click('[href="#terms"]')
    .click('a[data-test="new-term"]')
    .setValue('#name', 'Test Term')
    .click('button[type="submit"]');
  }
}
