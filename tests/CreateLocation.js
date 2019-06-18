module.exports = {
  'Create Location': browser => {
    browser
    .pause(500)
    .click('#admin-dropdown')
    .click('[href="#locations"]')
    .click('a[data-test="new-location"]')
    .setValue('input#name', 'Test Location')
    .setValue('input#address', '555 Travis Lane')
    .setValue('input#city', 'Austin')
    .setValue('input#state', 'TX')
    .setValue('input#zipcode', '78701')
    .clearValue('input[type="tel"]')
    .setValue('input[type="tel"]', '+1 (555) 555-5555')
    .setValue('input#contact', 'John Smith 555-555-5555')
    .setValue('input#note', 'On the 5th Floor')
    .click('button[type="submit"]')
    .pause(1000)
    .verify.containsText('[label="Name"]', 'Test Location')
    .verify.containsText('[label="Address"]', '555 Travis Lane, Austin, TX 78701')
    .verify.containsText('[label="Phone"]', '+1 (555) 555-5555')
    .verify.containsText('[label="Contact"]', 'John Smith 555-555-5555')
    .verify.containsText('[label="Note"]', 'On the 5th Floor')
  }
}
