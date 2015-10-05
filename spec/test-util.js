var jsdom = require("jsdom");

var testUtil = {
  withDocument: function(html, test) {
    var virtualConsole = jsdom.createVirtualConsole();

    virtualConsole.on("log", function () {
      console.log.apply(null, arguments);
    });

    jsdom.env({
      virtualConsole: virtualConsole,
      html: html,
      scripts: ["node_modules/d3/d3.js",
                "minid3.js"],
      done: function (err, window) {
        if (err) { throw err; }

        try {
          test(window.document, window.d3, window.minid3)
        } catch (e) {
          console.log(e.stack);
        }
      }
    });
  }
};

module.exports = testUtil;
