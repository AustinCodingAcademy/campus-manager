module.exports = {
  before: browser => {
    browser
    .resizeWindow(1500, 1000)
    .url('http://localhost:8080/register')
    .waitForElementVisible('body', 1000);
  },
  after: browser => {
    browser.end();
  }
}
