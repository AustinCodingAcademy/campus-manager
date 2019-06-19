module.exports = {
  'Create Course': browser => {
    browser
    .pause(300)
    .click('a[href="#courses"]')
    .click('a[data-test="new-course"]')
    .click('[placeholder="Name"]')
    .setValue('[placeholder="Name"]', 'Test Course')
    .setValue('#section', 1)
    // textbooks
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    .setValue('#virtual', 'test.com')
    .clearValue('#cost')
    .setValue('#cost', '2000.00')
    .setValue('#seats', 1)
    // term
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    // location
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    // days
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    // timestart
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    // timeend
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .click('button[type="submit"]')
    .pause(300)
    .verify.containsText('[data-test="name"]', 'Test Course')
    .verify.containsText('[data-test="section"]', '1')
    .verify.containsText('[data-test="location"]', 'Test Location')
    .verify.containsText('[data-test="term"]', 'Test Term')
    .verify.containsText('[data-test="days"]', 'Mon 10:59 pm - 12:59 pm')
    .verify.containsText('[data-test="cost"]', '$2000.00')
    .verify.containsText('[data-test="seats"]', '0 / 1')
  }
}
