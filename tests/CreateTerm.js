module.exports = {
  'Create Term': browser => {
    browser
    .click('#admin-dropdown')
    .click('a[href="#terms"]')
    .click('a[data-test="new-term"]')
    .setValue('input#name', 'Test Term')
    .setValue('input#start-date', 'Test start')
    .setValue('input#end-date', 'Test end')
    .click('button[type="submit"]')
  }
}
