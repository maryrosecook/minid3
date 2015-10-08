var testUtil = require("./test-util");

describe("dom mutation", function() {
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

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      d3
        .select("#d3")
        .selectAll("div")
        .selectAll("p")
        .selectAll("strong")
        .style("color", "red");

      var strongs = d3.select("#d3").selectAll("strong")

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

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      d3
        .select("#d3")
        .selectAll("strong")
        .style("color", "red");

      var strongs = d3.select("#d3").selectAll("strong")

      expect(strongs.length).toEqual(1, libName);
      expect(strongs[0].length).toEqual(2, libName);

      strongs[0].forEach(function(strong) {
        expect(strong.style.color).toEqual("red", libName);
      });
    }, done);
  });
});
