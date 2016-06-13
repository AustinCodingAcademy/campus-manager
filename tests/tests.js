var gls = require('gulp-live-server');

var DatabaseCleaner = require('database-cleaner');
var databaseCleaner = new DatabaseCleaner('mongodb');
var connect = require('mongodb').connect;

connect('mongodb://localhost/aca-campus-test', function(err, db) {
  databaseCleaner.clean(db, function() {
    var server = gls('./bin/www', {
      env: {
        NODE_ENV: 'test',
        PORT: 8080
      }
    });

    server.start();

    function (browser) {
      browser
        .url('http://localhost:8080/register')
        .waitForElementVisible('body', 1000)
        .setValue('input[name="username"]', 'test@client.com')
        .setValue('input[name="password"]', 'testpw')
        .waitForElementVisible('button[type="submit"]', 1000)
        .click('button[type="submit"]')
        .pause(1000)
        .assert.containsText('body > div.navbar-fixed > nav > div > ul.right.hide-on-med-and-down > li:nth-child(6) > a', 'test@client.com')
        .end();
    };


    // server.stop();
  });
});
