var jsdom = require("jsdom");

var testUtil = {
  withDocument: function(html, cb) {
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
          cb(window)
        } catch (e) {
          console.log(e.stack);
        }
      }
    });
  },

  runWithD3AndMinid3: function(html, test, done) {
    testUtil.withDocument(html, function(d3Window) {
      testUtil.withDocument(html, function(minid3Window) {
        test(d3Window.d3, "d3");
        test(minid3Window.minid3, "minid3");
        done();
      });
    });
  }
};

module.exports = testUtil;
