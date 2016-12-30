module.exports = {
  'Create Textbook': browser => {
    browser
    .pause(500)
    .click('#admin-dropdown')
    .click('[href="#textbooks"]')
    .click('a[data-test="new-textbook"]')
    .setValue('input#name', 'Test Textbook')
    .setValue('input#instructor_url', 'http://test.com')
    .setValue('input#student_url', 'http://test.com')
    .click('button[type="submit"]');
  }
}
