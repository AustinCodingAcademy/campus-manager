module.exports = {
  'Create Client': function (browser) {
    browser
    .resizeWindow(1500, 1000)
    .url('http://localhost:8080/register')
    .waitForElementVisible('body', 1000)
    .setValue('input[name="first_name"]', 'Test')
    .setValue('input[name="last_name"]', 'Client')
    .setValue('input[name="username"]', 'test@client.com')
    .setValue('input[name="password"]', 'testpw')
    .waitForElementVisible('button[type="submit"]', 1000)
    .click('button[type="submit"]')
    .pause(1000)
  },

  'Make Student': function (browser) {
    browser
    .click('[data-activates="nav-admin"]')
    .pause(500)
    .click('[href="#users"]')
    .pause(500)
    .click('[data-test="edit-user"]')
    .pause(300)
    .click('label[for="is_student"]')
    .pause(500)
    .click('input[type="submit"]')
    .pause(500)
  },

  'Create Location': function (browser) {
    browser
    .click('[data-activates="nav-admin"]')
    .pause(5000)
    .click('[href="#locations"]')
    .pause(1000)
    .click('a[data-test="new-location"]')
    .pause(500)
    .click('input[id="name"]')
    .keys('Test Location')
    .keys('\uE004')
    .keys('test@test.com')
    .keys('\uE004')
    .keys('555 Austin Lane')
    .keys('\uE004')
    .keys('555-555-5555')
    .keys('\uE004')
    .keys('Austin')
    .keys('\uE004')
    .keys('TX')
    .keys('\uE004')
    .keys('55555')
    .pause(100)
    .click('input[type="submit"]')
    .pause(1000)
  },

  'Create Term': function (browser) {
    browser
    .click('[data-activates="nav-admin"]')
    .pause(1000)
    .click('[href="#terms"]')
    .pause(1000)
    .click('a[data-test="new-term"]')
    .pause(500)
    .setValue('input[data-test="term-name"]', 'test term')
    .click('input[data-test="term-start-date"]')
    .pause(500)
    .click('div.picker--opened > div > div > div > div > div.picker__header > div.picker__nav--next')
    .pause(500)
    .click('div.picker--opened > div > div > div > div > div.picker__header > div.picker__nav--next') //click next month twice so that term start is at least 30 days from today
    .pause(500)
    .click('tr:nth-of-type(2) > td:first-of-type > div.picker__day')
    .pause(1000)
    .click('input[data-test="term-end-date"]')
    .pause(1000)
    .click('div.picker--opened > div > div > div > div > div.picker__header > div.picker__nav--next')
    .pause(500)
    .click('div.picker--opened > div > div > div > div > div.picker__header > div.picker__nav--next')
    .pause(500)
    .click('div.picker--opened > div > div > div > div > div.picker__header > div.picker__nav--next') //click next month 3x so that term end is at least 30 days from start date
    .pause(500)
    .click('div.picker--opened > div > div > div > div > table.picker__table > tbody > tr:nth-of-type(3) > td:last-of-type > div')
    .pause(500)
    .click('input[type="submit"]')
    .pause(1000);
  },

  'Make Course': function (browser) {
    browser
    .click('[href="#courses"]')
    .pause(1000)
    .click('a[data-test="new-course"]')
    .pause(500)
    .keys('\uE004')
    .keys('test course')
    .keys('\uE004')
    .keys('1234')
    .pause(500)
    .keys('\uE004')
    .keys('12')
    .pause(500)
    .click('label[for="sunday"]')
    .pause(500)
    .keys('\uE004')
    .pause(500)
    .keys('\uE007') // Presses ENTER btn
    .pause(500)
    .keys('\uE004')
    .keys('http://example.com')
    .pause(500)
    .click('input[type="submit"]')
    .pause(5000)
    .pause(5000);
  },

  'Make Payment': function (browser) {
    browser
    .url('http://localhost:8080/#')
    .waitForElementVisible('body', 1000)
    .click('div.Select-placeholder')
    .pause(500)
    .click('div.Select-option.is-focused')
    .pause(500)
    .setValue('input#payment-amount', '200.00')
    .pause(1000)
    .click('[data-test="make-payment"]')
    .pause(3000)
    .keys('4242')
    .pause(100)
    .keys('4242')
    .pause(100)
    .keys('4242')
    .pause(100)
    .keys('4242')
    .pause(500)
    .keys('\uE004')
    .pause(500)
    .keys('11')
    .keys('2020')
    .pause(500)
    .keys('\uE004')
    .pause(500)
    .keys('123')
    .pause(500)
    .keys('\uE004')
    .pause(500)
    .keys('77777')
    .pause(500)
    .keys('\uE007')
    .pause(5000)
    // Pause may need to be longer on other test clients
    .end();
  }
}
