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
    .click('button[type="submit"]')
    .pause(500)
    .verify.containsText('[label="Name"]', 'Test Textbook')
    .verify.containsText('[label="Instructor URL"]', 'http://test.com')
    .verify.containsText('[label="Student URL"]', 'http://test.com')
  }
}
