var React = require('react');

module.exports = React.createBackboneClass({
  render: function() {
    return (
      <div>
        <h6>Note: Screensharing only works in <a href="https://www.google.com/chrome/" target="_blank">Google Chrome</a></h6>
        <h5>Step 1: Download this <a href="/files/chrome.crx">Chrome Extension</a></h5>
        <h5>Step 2: Navigate to your extensions manager</h5>
        <img src="/img/extensions.png" style={{ width: '100%' }} />
        <h5>Step 3: Drop to install the extension</h5>
        <img src="/img/drop.png" style={{ width: '100%' }} />
        <h5>Step 4: Click "Add extension"</h5>
        <img src="/img/add.png" style={{ width: '100%' }} />
      </div>
    );
  }
});
