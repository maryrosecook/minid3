var testUtil = require("./test-util");

describe("dom mutation", function() {
  describe("style()", function() {
    it("should be able to set color of a lot of nested elements", function(done) {
      var html = `
        <div id="d3">
          <div>
            <p>
              <strong>a1</strong>
              <strong>a2</strong>
            </p>
            <p>
              <strong>c1</strong>
              <strong>c2</strong>
            </p>
          </div>
          <div>
            <p>
              <strong>11</strong>
              <strong>12</strong>
            </p>
            <p>
              <strong>31</strong>
              <strong>32</strong>
            </p>
          </div>
        </div>
      `;

      testUtil.runWithD3AndMinid3(html, function(lib, libName) {
        lib
          .select("#d3")
          .selectAll("div")
          .selectAll("p")
          .selectAll("strong")
          .style("color", "red");

        var strongs = lib.select("#d3").selectAll("strong")

        expect(strongs.length).toEqual(1, libName);
        expect(strongs[0].length).toEqual(8, libName);

        strongs[0].forEach(function(strong) {
          expect(strong.style.color).toEqual("red", libName);
        });
      }, done);
    });

    it("should be able to set color of a lot of unnested elements", function(done) {
      var html = `
        <div id="d3">
          <strong>a1</strong>
          <strong>a2</strong>
        </div>
      `;

      testUtil.runWithD3AndMinid3(html, function(lib, libName) {
        lib
          .select("#d3")
          .selectAll("strong")
          .style("color", "red");

        var strongs = lib.select("#d3").selectAll("strong")

        expect(strongs.length).toEqual(1, libName);
        expect(strongs[0].length).toEqual(2, libName);

        strongs[0].forEach(function(strong) {
          expect(strong.style.color).toEqual("red", libName);
        });
      }, done);
    });
  });

  describe("append()", function() {
    it("should be able to append several els to html (no initial select())", function(done) {
      // regression - blew up w/ HierarchyRequestError because
      // parentNode selectAll switched to html.parentNode on initial
      // select (using enter() for an easy example)

      var html = ``;
      testUtil.runWithD3AndMinid3(html, function(lib, libName) {
        var selection = lib
            .selectAll("p")
            .data([0])
            .enter()
            .append("p");

        var testHTML = `<head></head><body><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body><p></p>`;

        expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
      }, done);
    });

    it("should be able to start with selectAll when matching elements", function(done) {
      // regression - blew up w/ HierarchyRequestError because
      // parentNode selectAll switched to html.parentNode on initial
      // select (using enter() for an easy example)

      var html = `<p></p>`;
      testUtil.runWithD3AndMinid3(html, function(lib, libName) {
        var selection = lib
            .selectAll("p")
            .data([0, 1])
            .enter()
            .append("p");

        var testHTML = `<head></head><body><p></p><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body><p></p>`;

        expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
      }, done);
    });

    describe("on update", function() {
      describe("select", function() {
        it("should append no elements to html after failed select", function(done) {
          var html = "";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("p")
                .data([0, 1, 2])
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].map(function(n) { return n }))
              .toEqual([null, null, null], libName);

            var testHTML = `<head></head><body><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
          }, done);
        });

        it("should bind 1st datum to outer successful sel and inner appended el", function(done) {
          var html = "<strong></strong>";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("strong")
                .data([0, 1])
                .append("strong");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(2, libName);

            expect(selection[0][0].nodeName).toEqual("STRONG", libName);
            expect(selection[0][0].__data__).toEqual(0, libName);

            expect(selection[0][1]).toBeNull(libName);

            expect(lib.select("strong")[0][0].__data__).toEqual(0, libName);
            expect(lib.select("strong strong")[0][0].__data__).toEqual(0, libName);

            var testHTML = `<head></head><body><strong><strong></strong></strong><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
          }, done);
        });

        it("should append nothing, pad nothing after successful select if no data", function(done) {
          var html = "<strong></strong>";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("strong")
                .data([])
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(0, libName);
            expect(selection[0][0]).toBeUndefined(libName)
          }, done);
        });
      });

      describe("selectAll", function() {
        it("should bind 1st datum to outer successful selAll + inner appended el", function(done) {
          // unlike same pattern with select(), doesn't pad selectAll()ed item
          // with a null but still sets both datas to 0

          var html = `<p></p>`;
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .selectAll("p")
                .data([0])
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(1, libName);

            expect(selection[0][0].nodeName).toEqual("P", libName);
            expect(selection[0][0].__data__).toEqual(0, libName);

            expect(selection[0][1]).toBeUndefined(libName);

            expect(lib.select("p")[0][0].__data__).toEqual(0, libName);
            expect(lib.select("p p")[0][0].__data__).toEqual(0, libName);

            var testHTML = `<head></head><body><p><p></p></p><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
          }, done);
        });

        it("should be append no els after empty selectAll", function(done) {
          var html = `
              <div id="d3">
              </div>
            `;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0, 1, 2])
                .append("p");

            expect(selection.length).toEqual(1, libName);

            expect(selection[0].map(function(n) { return n; }))
              .toEqual([null, null, null], libName);

            expect(lib.select("#d3")[0][0].innerHTML.trim()).toEqual('', libName);
          }, done);
        });

        it("should bind data[0] to outer p + inner appended p, no bind rest data", function(done) {
          var html = `<div id="d3"><p></p></div>`;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0, 1, 2])
                .append("p");

            expect(lib.select("p")[0][0].__data__).toEqual(0, libName);
            expect(lib.select("p p")[0][0].__data__).toEqual(0, libName);

            var testHTML = `<head></head><body><div id="d3"><p><p></p></p></div><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
          }, done);
        });

        it("should pad failed selectAll with nulls for update", function(done) {
          var html = `<div id="d3"><p></p><p></p></div>`;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .selectAll("strong")
                .data([0, 1])
                .append("strong");

            expect(selection[0][0]).toBeNull(libName);
            expect(selection[0][1]).toBeNull(libName);
            expect(selection[0][2]).toBeUndefined(libName);

            var testHTML = `<head></head><body><div id="d3"><p></p><p></p></div><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(testHTML, libName);
          }, done);
        });
      });
    });

    describe("after enter()", function() {
      describe("select", function() {
        it("should append several elements to html after failed select", function(done) {
          var html = "";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("p")
                .data([0, 1, 2])
                .enter()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].map(function(n) { return n.nodeName; }))
              .toEqual(["P", "P", "P"], libName);

            expect(selection[0].map(function(n) { return n.__data__; }))
              .toEqual([0, 1, 2], libName);

            var targetHTML = `<head></head><body><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body><p></p><p></p><p></p>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(targetHTML, libName);
          }, done);
        });

        it("should append 1 el to html bound to 2nd datum after successful select", function(done) {
          var html = "<strong></strong>";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("strong")
                .data([0, 1])
                .enter()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(2, libName);

            expect(selection[0][0]).toBeNull(libName)

            expect(selection[0][1].nodeName).toEqual("P", libName)
            expect(selection[0][1].__data__).toEqual(1, libName)
          }, done);
        });

        it("should append nothing, pad nothing after successful select if no data", function(done) {
          var html = "<strong></strong>";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("strong")
                .data([])
                .enter()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(0, libName);
            expect(selection[0][0]).toBeUndefined(libName)
          }, done);
        });
      });

      describe("selectAll", function() {
        it("should be able to append several elements after empty selectAll", function(done) {
          var html = `
              <div id="d3">
              </div>
            `;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0, 1, 2])
                .enter()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].map(function(n) { return n.nodeName; }))
              .toEqual(["P", "P", "P"], libName);

            expect(selection[0].map(function(n) { return n.__data__; }))
              .toEqual([0, 1, 2], libName);

            expect(lib.select("#d3")[0][0].innerHTML.trim())
              .toEqual('<p></p><p></p><p></p>', libName);
          }, done);
        });

        it("should null pad updated els and bind remaining data to appended els", function(done) {
          var html = `
              <div id="d3">
                <p></p>
              </div>
            `;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0, 1, 2])
                .enter()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(3, libName);

            expect(selection[0][0]).toBeNull(libName);

            expect(selection[0][1].nodeName).toEqual("P", libName);
            expect(selection[0][1].__data__).toEqual(1, libName);

            expect(selection[0][2].nodeName).toEqual("P", libName);
            expect(selection[0][2].__data__).toEqual(2, libName);
          }, done);
        });

        it("should append no items if all data already bound", function(done) {
          var html = `
              <div id="d3">
                <p></p>
              </div>
            `;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0])
                .enter()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(1, libName);

            expect(selection[0][0]).toBeNull(libName);

            expect(selection[0][1]).toBeUndefined(libName);
          }, done);
        });

        it("should append to inner nested elements after two selectAlls", function(done) {
          var html = `
            <div id="d3">
              <p></p>
              <p></p>
            </div>
          `;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .selectAll("strong")
                .data([0, 1])
                .enter()
                .append("span");

            expect(selection.length).toEqual(2, libName);

            expect(selection[0].length).toEqual(2, libName);
            expect(selection[0][0].nodeName).toEqual("SPAN", libName);
            expect(selection[0][0].__data__).toEqual(0, libName);
            expect(selection[0][1].nodeName).toEqual("SPAN", libName);
            expect(selection[0][1].__data__).toEqual(1, libName);

            expect(selection[1].length).toEqual(2, libName);
            expect(selection[1][0].nodeName).toEqual("SPAN", libName);
            expect(selection[1][0].__data__).toEqual(0, libName);
            expect(selection[1][1].nodeName).toEqual("SPAN", libName);
            expect(selection[1][1].__data__).toEqual(1, libName);
          }, done);
        });
      });
    });

    describe("after exit()", function() {
      describe("select", function() {
        it("should append nothing after failed select, pad sel to 1", function(done) {
          // padded to 1 because pads to len of failed sel: [null] and
          // append fills in a null to empty exit sel

          var html = "";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("p")
                .data([0, 1, 2])
                .exit()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(1, libName);

            expect(selection[0][0]).toBeNull(libName);

            var targetHTML = `<head></head><body><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(targetHTML, libName);
          }, done);
        });

        it("should append none, pad w/null after success sel if 1 init el, 2 data", function(done) {
          var html = "<strong></strong>";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("strong")
                .data([0, 1])
                .exit()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(1, libName);

            expect(selection[0][0]).toBeNull(libName);

            var targetHTML = `<head></head><body><strong></strong><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(targetHTML, libName);
          }, done);
        });

        it("should append p to str, no pad after successful sel w too short data", function(done) {
          var html = "<strong></strong>";
          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("strong")
                .data([])
                .exit()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(1, libName);

            expect(selection[0][0].nodeName).toEqual("P", libName);
            expect(selection[0][0].__data__).toBeUndefined(libName);

            var targetHTML = `<head></head><body><strong><p></p></strong><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(targetHTML, libName);
          }, done);
        });
      });

      describe("selectAll", function() {
        it("should not pad, append no els when selectAlled nothing, too much data", function(done) {
          var html = `
              <div id="d3">
              </div>
            `;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0, 1, 2])
                .exit()
                .append("p");

            expect(selection.length).toEqual(1, libName);
            expect(selection[0].length).toEqual(0, libName);

            expect(lib.select("#d3")[0][0].innerHTML.trim()).toEqual('', libName);
          }, done);
        });

        it("should null pad updated els append none when too much data", function(done) {
          var html = `<div id="d3"><p></p></div>`;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0, 1, 2])
                .exit()
                .append("p");

            expect(selection[0].length).toEqual(1, libName);
            expect(selection[0][0]).toBeNull(libName);
            expect(selection[0][1]).toBeUndefined(libName);

            var targetHTML = `<head></head><body><div id="d3"><p></p></div><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(targetHTML, libName);
          }, done);
        });

        it("should pad 1 el, append none if all data bound", function(done) {
          var html = `<div id="d3"><p></p></div>`;

          testUtil.runWithD3AndMinid3(html, function(lib, libName) {
            var selection = lib
                .select("#d3")
                .selectAll("p")
                .data([0])
                .exit()
                .append("p");

            expect(selection[0].length).toEqual(1, libName);
            expect(selection[0][0]).toBeNull(libName);
            expect(selection[0][1]).toBeUndefined(libName);

            var targetHTML = `<head></head><body><div id="d3"><p></p></div><script class="jsdom" src="node_modules/d3/d3.js"></script><script class="jsdom" src="minid3.js"></script></body>`;

            expect(lib.select("html")[0][0].innerHTML).toEqual(targetHTML, libName);
          }, done);
        });
      });
    });
  });
});
