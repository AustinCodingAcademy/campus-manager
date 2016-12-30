module.exports = {
  'Create Client': browser => {
    browser
    .setValue('input[name="first_name"]', 'Test')
    .setValue('input[name="last_name"]', 'Client')
    .setValue('input[name="phone"]', '5555555555')
    .setValue('input[name="username"]', 'test@client.com')
    .setValue('input[name="password"]', 'testpw')
    .waitForElementVisible('button[type="submit"]', 1000)
    .click('button[type="submit"]')
    .pause(1000)
  }
}
