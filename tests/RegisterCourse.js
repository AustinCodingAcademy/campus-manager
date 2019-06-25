module.exports = {
  'Register Course': browser => {
    var studentRegisterLink = null;

    // on dashboard screen as admin
    browser.click('[data-test="dashboard"]')
    .pause(1000)

    .execute(function() {
      // grab their unique register link and store in variable, then use .url(studentRegisterLink) to navigate
      studentRegisterLink = document.querySelector('pre').textContent;
      return studentRegisterLink;
    }, [], function(result) {
      studentRegisterLink = result.value;
    })
    // register student, log in as that student, then register for a class
    .click('#user-dropdown')
    .click('a[href="logout"]')
    .perform(function() {
      browser.url(studentRegisterLink);
    })
    // register student
    .waitForElementVisible('body', 1000)
    .setValue('#first-name', 'Test')
    .setValue('#last-name', 'Student')
    .setValue('#email', 'test2@gmail.com')
    .setValue('#phone', '(555) 555-5555')
    .setValue('#password', 'password123')
    .click('button[type="submit"]')
    // student logged in, registers for course
    .click('#account-tabs-tab-register')
    .click('.Select-arrow-zone')
    .keys(browser.Keys.ENTER)
    .click('#payment-amount')
    .setValue('#payment-amount', '490.00')
    .click('#make-payment-stripe')
    .pause(111111)  // ! left off here, test not finding element
    .click('.CodeNotReceived-actionMessage')
    // card #
    .setValue('.is-head-1 .Fieldset-input', '4242 4242 4242 4242')
    // expiration
    .setValue('.Fieldset-childLeft .Fieldset-input', '12/19')
    // cvc
    .setValue('.Fieldset-childRight .Fieldset-input', '123')
    // zip
    .setValue('.Fieldset-childBottom .Fieldset-input', '12345')
    .click('button')
    .pause(5000)

  }
}
