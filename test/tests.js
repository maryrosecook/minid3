function setupTestElement() {
  var testArea = document.getElementById("test-area");
  if (!testArea) {
    testArea = document.createElement("div");
    testArea.setAttribute("id", "test-area");
  } else {
    testArea.innerHTML = "";
  }

  return testArea;
};

QUnit.test("can select body gets body", function(assert) {
  assert.ok(d3.select("body")[0][0] === document.body);
  assert.ok(d3.select("body")[0][0] === minid3.select("body")[0][0]);
});

// QUnit.test("can chain another selection on initial selection", function(assert) {
//   var selection = minid3.select("body").select("p")._getSelection();
//   assert.ok(selection[0] === document.body.querySelector("p"));
// });


//     .data([4, 8, 15, 16, 23, 42])
//     .text(String);

// // Enter…
// p.enter().append("p")
//   .text(String);

// // Exit…
// p.exit().remove();
