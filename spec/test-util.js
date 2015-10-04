var jsdom = require("jsdom");

var testUtil = {
  withDocument: function(html, test) {
    var virtualConsole = jsdom.createVirtualConsole();

    virtualConsole.on("log", function () {
      var a = arguments;
      console.log(a[0]||"", a[1]||"", a[2]||"", a[3]||"", a[4]||"", a[5]||"", a[6]||"", a[7]||"");
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
