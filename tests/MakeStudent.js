module.exports = {
  'Make Student': browser => {
    browser
    .click('[data-test="edit-profile"]')
    .pause(500)
    .click('[href="#users"]')
    .pause(500)
    .click('[data-test="edit-user"]')
    .pause(300)
    .click('label[for="is_student"]')
    .pause(500)
    .click('input[type="submit"]')
    .pause(500)
  }
}
