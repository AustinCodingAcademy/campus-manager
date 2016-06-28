module.exports = {
  'Create Client': function (browser) {
    browser
      .url('http://localhost:8080/register')
      .waitForElementVisible('body', 1000)
      .setValue('input[name="first_name"]', 'Test')
      .setValue('input[name="last_name"]', 'Client')
      .setValue('input[name="username"]', 'test@client.com')
      .setValue('input[name="password"]', 'testpw')
      .waitForElementVisible('button[type="submit"]', 1000)
      .click('button[type="submit"]')
      .pause(1000)
      .assert.containsText('.side-nav', 'Logout')
      .end();
  }
}
