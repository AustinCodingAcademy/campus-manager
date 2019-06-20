module.exports = {
  'Register Course': browser => {
    // TODO
    // Go through registration process
    // LOGIN WITH CREATED STUDENT CREDENTIALS
    // click #user-dropdown
    // click a[href="logout"]
    // click #first_name
    // set 'Test
    // click #last_name
    // set 'Client'
    // click #email
    // set 'test@gmail.com'
    // click #phone
    // set
    // setValue to created student email, so test@gmail.com


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
    .click('a[href="logout"]', function() {
      console.log('logout success')
    })
    .perform(function() {
      browser.url(studentRegisterLink, function() {
        console.log('url success')
        console.log('register link', studentRegisterLink)
      })
    })
    // register student
    .waitForElementVisible('body', 1000)
    // .pause(1000)
    .setValue('#first-name', 'Test')
    .setValue('#last-name', 'Student')
    .setValue('#email', 'test@gmail.com')
    .setValue('#phone', '(555) 555-5555')
    .setValue('#password', 'password123')
    .pause(11000)
  }
}

// browser
// .pause(500)
// .url('http://localhost:8080/#')
// .waitForElementVisible('body', 1000)
// .pause(500)
// .click('div.Select-placeholder')
// .pause(500)
// .click('div.Select-option.is-focused')
// .pause(500)
// .setValue('input#payment-amount', '200.00')
// .pause(1000)
// .click('[data-test="make-payment"]')
// .pause(3000)
// .keys('4242')
// .pause(100)
// .keys('4242')
// .pause(100)
// .keys('4242')
// .pause(100)
// .keys('4242')
// .pause(500)
// .keys('\uE004')
// .pause(500)
// .keys('11')
// .keys('2020')
// .pause(500)
// .keys('\uE004')
// .pause(500)
// .keys('123')
// .pause(500)
// .keys('\uE004')
// .pause(500)
// .keys('77777')
// .pause(500)
// .keys('\uE007')
// .pause(5000);
