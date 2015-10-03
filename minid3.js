function quote(string) {
  return '"' + string + '"'; // XXX not complete
}

var selectionMixin = {
  select: function(selectorString) {
    return addSelectionMixin(this.reduce(function(a, e) {
      a.push(e.map(function(s) { return s.querySelector(selectorString); }));
      return a;
    }, []));
  },

  selectAll: function(selectorString) {
    return addSelectionMixin(this.reduce(function(a, e) {
      return a.concat(e.map(function(s) {
        return arr(s.querySelectorAll(selectorString)); }));
    }, []));
  }
};

function addSelectionMixin(selection) {
  for (var key in selectionMixin) {
    selection[key] = selectionMixin[key];
  }

  return selection;
};

function arr(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var minid3 = {
  select: function(selectorString) {
    return addSelectionMixin([[document]]).select(selectorString);
  },

  selectAll: function(selectorString) {
    return addSelectionMixin([[document]]).selectAll(selectorString);
  }
};
