module.exports = {
  'Create Client': function (browser) {
    browser
      .url('http://localhost:8080/register')
      .waitForElementVisible('body', 1000)
      .setValue('input[name="username"]', 'test@client.com')
      .setValue('input[name="password"]', 'testpw')
      .waitForElementVisible('button[type="submit"]', 1000)
      .click('button[type="submit"]')
      .pause(1000)
      // .assert.containsText('.dropdown-button > span:nth-child(1)', 'test@client.com')
      .end();
  }
}
