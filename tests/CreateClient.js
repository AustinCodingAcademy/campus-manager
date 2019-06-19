module.exports = {
  'Create Client': browser => {
    browser
    .setValue('input[name="first_name"]', 'Test')
    .setValue('input[name="last_name"]', 'Client')
    .setValue('input[name="username"]', 'test@client.com')
    .setValue('input[type="tel"]', '(555) 555-5555')
    .setValue('#password', '123456AB')
    .waitForElementVisible('button[type="submit"]', 300)
    .click('button[type="submit"]')
    .pause(300)
    .verify.containsText('[data-test="name"]', 'Test Client')
    .verify.containsText('[data-test="email"]', 'test@client.com')
    .verify.containsText('[data-test="phone"]', '(555) 555-5555')
  }
}
