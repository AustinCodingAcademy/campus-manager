module.exports = {
  'Create Client': browser => {
    browser
    .click('#campus-select option[value="Austin"]')
    .setValue('input[name="first_name"]', 'Test')
    .setValue('input[name="last_name"]', 'Client')
    .setValue('input[name="username"]', 'test@client.com')
    .setValue('input[name="password"]', 'testpw')
    .setValue('input[name="phone"]', '(555) 555-5555')
    .waitForElementVisible('button[type="submit"]', 1000)
    .click('button[type="submit"]')
    .pause(1000)
  }
}
