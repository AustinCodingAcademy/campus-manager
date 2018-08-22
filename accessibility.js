const pa11y = require('pa11y');
const { URL } = require('url');
const htmlReporter = require('pa11y-reporter-html');
const fs = require('fs');
const open = require('open');

pa11y('http://localhost:8080/register', {
  // standards https://github.com/pa11y/pa11y/wiki/HTML-CodeSniffer-Rules
  standard: 'WCAG2AA',
  chromeLaunchConfig: {
    headless: false,
    slowMo: 100
  },
  actions: [
    'set field input[name="first_name"] to Test',
    'set field input[name="last_name"] to Client',
    'set field input[name="username"] to test@client.com',
    'set field input[name="password"] to testpw',
    'set field input[name="phone"] to (555) 555-5555',
    'click element [type="submit"]',
    'wait for element #admin-dropdown to be visible',
    'click element #admin-dropdown',
    'click [href="#terms"]',
    'click a[data-test="new-term"]',
    'wait for element #name to be visible',
    'set field #name to Test Term',
    'click button[type="submit"]',
    'wait for element #admin-dropdown to be visible',
    'click #admin-dropdown',
    'click [href="#locations"]',
    'click a[data-test="new-location"]',
    'wait for element #name to be visible',
    'set field input#name to Test Location',
    'set field input#address to 555 Travis Lane',
    'set field input#city to Austin',
    'set field input#state to TX',
    'set field input#zipcode to 78701',
    'set field input[type="tel"] to +1 (555)555-5555',
    'set field input#contact to John Smith 555-555-5555',
    'set field input#note to On the 5th Floor',
    'click button[type="submit"]',
    'wait for element #admin-dropdown to be visible',
    'click #admin-dropdown',
    'click [href="#textbooks"]',
    'click a[data-test="new-textbook"]',
    'wait for element #name to be visible',
    'set field input#name to Test Textbook',
    'set field input#instructor_url to http://test.com',
    'set field input#student_url to http://test.com',
    'click button[type="submit"]'


    // 'wait for path to be /dashboard',
    // `navigate to ${process.env.URL}`
  ]
}).then(results => {
    htmlReporter.results(results).then(html => {
      const path = './tmp/accessibility.html';
      fs.writeFileSync(path, html);
      open(path);
    });
});
