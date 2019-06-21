module.exports = {
  'Make Student': browser => {
    browser
    .click('.navbar-brand')
    .click('#admin-dropdown')
    .click('[href="#users"]')
    // UsersListComponent
    .click('[data-test="add-user"]')
    .pause(300)
    // UserModalComponent
    .setValue('#first_name', 'Test')
    .pause(1000)
    .setValue('#last_name', 'Client')
    .setValue('#username', 'test@gmail.com')
    .setValue('input[type="tel"]', '(555) 555-5555')
    .keys(browser.Keys.TAB)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.DOWN_ARROW)
    .keys(browser.Keys.ENTER)
    .setValue('#github', 'gitname')
    .setValue('#rocketchat', 'rocketname')
    .setValue('#discourse', 'discoursename')
    .setValue('#linkedIn', 'personname')
    .setValue('#website', 'http://test.com')
    .click('#campus')
    .setValue('#campus', 'Austin Coding Academy')
    .setValue('#zipcode', '78752')
    .setValue('#insightly', 'testid')
    .clearValue('#price')
    .setValue('#price', '100')
    .setValue('#credits', 'KC Materials Fee 5/15/17: -100.00')
    .setValue('#note', 'test')
    .click('button[type="submit"]')
    .pause(2000) // * keep this, seems necessary to pass
    // UsersListComponent
    .verify.containsText('tbody > tr:nth-child(2) > [data-test="name"]', 'Client, Test')
    .verify.containsText('tbody > tr:nth-child(2) > [data-test="email"]', 'test@gmail.com')
    .verify.containsText('tbody > tr:nth-child(2) > [data-test="phone"]', '(555) 555-5555')
    .verify.containsText('tbody > tr:nth-child(2) > [data-test="location"]', 'Austin')
    .verify.containsText('tbody > tr:nth-child(2) > [data-test="roles"]', 'student')
  }
}
