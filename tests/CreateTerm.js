module.exports = {
  'Create Term': browser => {
    browser
    .click('#admin-dropdown')
    .click('a[href="#terms"]')
    .click('a[data-test="new-term"]')
    .setValue('input#name', 'Test Term')
    .clearValue('input#start-date')
    .setValue('input#start-date', 'Thu, Jun 25, 2020')
    .click('.modal-title')
    .clearValue('input#end-date')
    .setValue('input#end-date', 'Thu, Oct 22, 2020')
    .click('.modal-title')
    .click('input#end-date');
    // function to continue doing browers.click() and verify.containsText('.react-datepicker__current-month', 'June 2019')

    // browser.execute(function() {
    //   let i = 0;
    //   while (i < 300) {
    //     if (document.querySelector('.react-datepicker__current-month').textContent === 'June 2019') {
    //       break;
    //     } else {
    //       browser.click('.datepicker__navigation--previous');
    //       i++
    //     }
    //   }
    //   browser.click('div[aria-label="day-1"]')
    // })
    // .pause(15000)


    browser.click('button[type="submit"]')
    .pause(300)
    .verify.containsText('[label="Name"]', 'Test Term')
    .verify.containsText('[label="Dates"]', 'Thu, Jun 25, 2020 - Thu, Oct 22, 2020')
  }
}
