var testUtil = require("./test-util");

describe("data()", function() {
  it("should be able to set longer data on fewer elements", function(done) {
    var html = `
      <div id="d3">
        <strong>a1</strong>
        <strong>a2</strong>
      </div>
    `;

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      var updatedElements = d3
          .select("#d3")
          .selectAll("strong")
          .data([0, 1, 2, 3]);

      expect(updatedElements[0].length).toEqual(4, libName); // extra slots added
      expect(updatedElements[0][0].__data__).toEqual(0, libName);
      expect(updatedElements[0][1].__data__).toEqual(1, libName);

      // no extra slots
      expect(updatedElements[0][2]).toBeUndefined(libName);
    }, done);
  });

  it("should be able to set shorter data on more elements", function(done) {
    var html = `
      <div id="d3">
        <strong>a1</strong>
        <strong>a2</strong>
        <strong>a3</strong>
      </div>
    `;

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      var updatedElements = d3
        .select("#d3")
        .selectAll("strong")
        .data([0, 1]);

      expect(updatedElements[0].length).toEqual(2, libName);
      expect(updatedElements[0][0].__data__).toEqual(0, libName);
      expect(updatedElements[0][1].__data__).toEqual(1, libName);

      // no extra slots
      expect(updatedElements[0][2]).toBeUndefined(libName);
    }, done);
  });

  it("should be able to set data on equal number of elements", function(done) {
    var html = `
      <div id="d3">
        <strong>a1</strong>
        <strong>a2</strong>
      </div>
    `;

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      var updatedElements = d3
        .select("#d3")
        .selectAll("strong")
        .data([0, 1]);

      expect(updatedElements[0].length).toEqual(2, libName);
      expect(updatedElements[0][0].__data__).toEqual(0, libName);
      expect(updatedElements[0][1].__data__).toEqual(1, libName);

      // no extra slots
      expect(updatedElements[0][2]).toBeUndefined(libName);
    }, done);
  });
});

describe("enter()", function() {
  it("should return unbound elements when extra data", function(done) {
    var html = `
      <div id="d3">
        <strong>a1</strong>
        <strong>a2</strong>
      </div>
    `;

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      var unboundStrongs = d3
          .select("#d3")
          .selectAll("strong")
          .data([0, 1, 2, 3])
          .enter();

      expect(unboundStrongs[0].length).toEqual(4, libName); // pads up to bound items

      expect(unboundStrongs[0][0]).toBeUndefined(libName);
      expect(unboundStrongs[0][1]).toBeUndefined(libName);

      expect(unboundStrongs[0][2].__data__).toEqual(2, libName);
      expect(unboundStrongs[0][3].__data__).toEqual(3, libName);
    }, done);
  });

  it("should return no unbound elements when no extra data", function(done) {
    var html = `
      <div id="d3">
        <strong>a1</strong>
        <strong>a2</strong>
      </div>
    `;

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      var unboundStrongs = d3
          .select("#d3")
          .selectAll("strong")
          .data([0, 1])
          .enter();

      expect(unboundStrongs[0].length).toEqual(2, libName); // pads up to bound items

      expect(unboundStrongs[0][2]).toBeUndefined(libName);
    }, done);
  });

  it("should return no unbound elements when fewer datums than elements", function(done) {
    var html = `
      <div id="d3">
        <strong>a1</strong>
        <strong>a2</strong>
        <strong>a3</strong>
      </div>
    `;

    testUtil.runWithD3AndMinid3(html, function(d3, libName) {
      var unboundStrongs = d3
          .select("#d3")
          .selectAll("strong")
          .data([0, 1])
          .enter();

      expect(unboundStrongs[0].length).toEqual(2, libName); // only pads to number of bound els

      expect(unboundStrongs[0][0]).toBeUndefined(libName);
      expect(unboundStrongs[0][1]).toBeUndefined(libName);
    }, done);
  });
});
