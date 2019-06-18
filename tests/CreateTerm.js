module.exports = {
  'Create Term': browser => {
    browser
    .click('#admin-dropdown')
    .click('a[href="#terms"]')
    .click('a[data-test="new-term"]')
    .setValue('input#name', 'Test Term')
    // .pause(500)
    // .clearValue('input#start-date')
    // .pause(500)
    // .setValue('input#start-date', 'Wed, Jan 3, 2018')
    // .pause(500)
    // .click('.modal-title')
    // .pause(500)
    // .clearValue('input#end-date')
    // .pause(500)
    // .setValue('input#end-date', 'Fri, Jun 1, 2018')
    // .pause(500)
    // .click('.modal-title')
    // .pause(500)
    // .click('input#end-date');
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
    .pause(1210)
    // .verify.containsText('[label="Name"]', 'Test Term')
    // .verify.containsText('[label="Dates"]', 'Wed, Jan 3, 2018 - Fri, Jun 1, 2018')
  }
}
