function setupTestElement(id) {
  var testArea = document.getElementById(id);
  if (!testArea) {
    testArea = document.createElement("div");
    testArea.setAttribute("id", id);
    document.body.appendChild(testArea);
  } else {
    testArea.innerHTML = "";
  }

  return testArea;
};

QUnit.test("can select body gets body", function(assert) {
  assert.ok(d3.select("body")[0][0] === document.body);
  assert.ok(d3.select("body")[0][0] === minid3.select("body")[0][0]);
});

QUnit.test("can chain another selection on initial selection", function(assert) {
  assert.ok(minid3.select("body").select("p")[0][0] === document.body.querySelector("p"));
});

QUnit.test("can chain another selection on initial selection", function(assert) {
  assert.ok(minid3.select("body").select("p")[0][0] === document.body.querySelector("p"));
});

QUnit.test("chained select all expands single item into many", function(assert) {
  var d3Div = setupTestElement("d3");
  d3Div.innerHTML = `
    <p></p>
    <p></p>
  `;

  var minid3Div = setupTestElement("minid3");
  minid3Div.innerHTML = `
    <p></p>
    <p></p>
  `;

  assert.ok(d3.select("#d3").selectAll("p").innerHTML ===
            minid3.select("#d3").selectAll("p").innerHTML);
});


QUnit.test("chained selectAlls on 2x2 nested html should give 2 groups of subs", function(assert) {
  var d3Div = setupTestElement("d3");
  d3Div.innerHTML = `
    <div>
      <p>a1</p>
      <p>c1</p>
    </div>
    <div>
      <p>11</p>
      <p>31</p>
    </div>
  `;

  var d3Results = d3.select("#d3").selectAll("div").selectAll("p");
  var minid3Results = minid3.select("#d3").selectAll("div").selectAll("p");

  assert.ok(minid3Results[0][0].innerText === "a1"); // right content on first matched tag

  // all p tags
  assert.ok(d3Results[0][0] === minid3Results[0][0]);
  assert.ok(d3Results[0][1] === minid3Results[0][1]);
  assert.ok(d3Results[1][0] === minid3Results[1][0]);
  assert.ok(d3Results[1][1] === minid3Results[1][1]);
});

QUnit.test("chained selectAlls on 2x2x2 nested html should give 4 groups of subs", function(assert) {
  var d3Div = setupTestElement("d3");
  d3Div.innerHTML = `
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
  `;

  var d3Results = d3.select("#d3").selectAll("div").selectAll("p").selectAll("strong");
  var minid3Results = minid3.select("#d3").selectAll("div").selectAll("p").selectAll("strong");

  assert.ok(minid3Results[0][0].innerText === "a1"); // right content on first matched tag
  assert.ok(minid3Results[3][1].innerText === "32"); // right content on last matched tag

  assert.ok(d3Results.length === 4);
  assert.ok(minid3Results.length === 4);

  for (var i = 0; i < 4; i++) {
    assert.ok(d3Results[i][1] === minid3Results[i][1]);
    assert.ok(d3Results[i][1] === minid3Results[i][1]);
  }
});


// QUnit.test("enter() adds new data to divs", function(assert) {
//   var data = [1, 2, 3];
//   var d3Div = setupTestElement("d3");
//   var minid3Div = setupTestElement("minid3");

//   d3.select("#d3").selectAll("p").data(data).enter().append("p").text(String);
//   // d3.select("#d3").selectAll("p").data(data);



//   // assert.ok(d3Div.innerHTML === minid3Div.innerHTML);
// });


// var p = d3.select("body").selectAll("p")
//     .data([4, 8, 15, 16, 23, 42])
//     .text(String);

// // Enter…
// p.enter().append("p")
//     .text(String);

// // Exit…
// p.exit().remove();
