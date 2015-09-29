function makeInstance() {
  return mixin(api, [[document]]);
};

var api = {
  select: function(selectorString) {
    return this.map(function(s) { console.log(s);return s.querySelector(selectorString); });
  },

  selectAll: function(selectorString) {
    return this.map(function(s) { return s.querySelectorAll(selectorString); });
  }
};

function mixin(from, to) {
  for (var i in from) {
    to[i] = from[i];
  }

  return to;
};

var minid3 = {
  select: function(selectorString) {
    return makeInstance().select(selectorString);
  },

  selectAll: function(selectorString) {
    return makeInstance().selectAll(selectorString);
  }
};
