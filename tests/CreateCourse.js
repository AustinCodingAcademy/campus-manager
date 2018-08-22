module.exports = {
  'Create Course': browser => {
    browser
    .pause(500)
    .click('a[href="#courses"]')
    .click('a[data-test="new-course"]')
    .pause(500)
    .setValue('#name', 'Test Course')
    .setValue('#section', 1)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    .setValue('#cost', '2000.00')
    .setValue('#seats', 1)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    .setValue('#timeStart', '18:00')
    .setValue('#timeEnd', '21:00')
    .click('button[type="submit"]');
  }
}
