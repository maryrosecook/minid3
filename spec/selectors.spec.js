var testUtil = require("./test-util");

describe("selectors", function() {
  it("should be able to select body", function(done) {
    var html = "";
    testUtil.withDocument(html, function(window) {
      expect(window.d3.select("body")[0][0]).toEqual(window.document.body);
      expect(window.d3.select("body")[0][0]).toEqual(window.minid3.select("body")[0][0]);
      done();
    });
  });

  it("should be able to chain selection on initial selection", function(done) {
    var html = "<p id='hi'></p>";
    testUtil.withDocument(html, function(window) {
      expect(window.minid3.select("body").select("p")[0][0].id).toEqual("hi");
      expect(window.minid3.select("body").select("p")[0][0])
        .toEqual(window.document.body.querySelector("p"));
      done();
    });
  });

  it("chained selectAll expands single item into many", function(done) {
    var html = `
      <div id="top">
        <p></p>
        <p></p>
      </div>
    `;

    testUtil.withDocument(html, function(window) {
      expect(window.minid3.select("#top").selectAll("p")[0][0].nodeName).toEqual("P");
      expect(window.minid3.select("#top").selectAll("p")[0][1].nodeName).toEqual("P");
      expect(window.minid3.select("#top").selectAll("p"))
        .toEqual(window.minid3.select("#top").selectAll("p"));
      done();
    });
  });

  it("chained selectAlls on 2x2 nested html should give 2 groups of subs", function(done) {
    var html = `
      <div id="top">
        <div>
          <p>a1</p>
          <p>c1</p>
        </div>
        <div>
          <p>11</p>
          <p>31</p>
        </div>
      </div>
    `;

    testUtil.withDocument(html, function(window) {
      var d3Results = window.d3.select("#top").selectAll("div").selectAll("p");
      var minid3Results = window.minid3.select("#top").selectAll("div").selectAll("p");

      expect(minid3Results[0][0].outerHTML).toEqual("<p>a1</p>"); // right content on last match tag

      // all p tags

      expect(d3Results[0][0]).toEqual(minid3Results[0][0]);
      expect(d3Results[0][0].nodeName).toEqual("P");

      expect(d3Results[0][1]).toEqual(minid3Results[0][1]);
      expect(d3Results[0][1].nodeName).toEqual("P");

      expect(d3Results[1][0]).toEqual(minid3Results[1][0]);
      expect(d3Results[1][0].nodeName).toEqual("P");

      expect(d3Results[1][1]).toEqual(minid3Results[1][1]);
      expect(d3Results[1][1].nodeName).toEqual("P");

      done();
    });
  });

  it("chained selectAlls on 2x2x2 nested html should give 4 groups of subs", function(done) {
    var html = `
      <div id="top">
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

    testUtil.withDocument(html, function(window) {
      var d3Results = window.d3.select("#top").selectAll("div").selectAll("p").selectAll("strong");
      var minid3Results = window.minid3
          .select("#top").selectAll("div").selectAll("p").selectAll("strong");

      expect(minid3Results[0][0].outerHTML)
        .toEqual("<strong>a1</strong>"); // right content on first match
      expect(minid3Results[3][1].outerHTML)
        .toEqual("<strong>32</strong>"); // right content on last match

      expect(d3Results.length).toEqual(4);
      expect(minid3Results.length).toEqual(4);

      for (var i = 0; i < 4; i++) {
        expect(d3Results[i][0]).toEqual(minid3Results[i][0]);
        expect(d3Results[i][0].nodeName).toEqual("STRONG");

        expect(d3Results[i][1]).toEqual(minid3Results[i][1]);
        expect(d3Results[i][1].nodeName).toEqual("STRONG");
      }

      done();
    });
  });
});
