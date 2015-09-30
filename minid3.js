function createSelection(selection) {
  return setProto(selection || [[document]], selectionPrototype);
};

var selectionPrototype = {
  select: function(selectorString) {
    return this.reduce(function(a, e) {
      a.push(e.map(function(s) { return s.querySelector(selectorString); }));
      return a
    }, []);
  },

  selectAll: function(selectorString) {
    return this.reduce(function(a, e) {
      return a.concat(e.map(function(s) { return arr(s.querySelectorAll(selectorString)); }));
    }, []);
  },

  data: function(data) {
    // var selection = this[0];
    // var enter =
  }
};

function setProto(obj, proto) {
  obj.__proto__.__proto__ = proto;
  return obj;
};

function arr(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var minid3 = {
  select: function(selectorString) {
    return createSelection().select(selectorString);
  },

  selectAll: function(selectorString) {
    return createSelection().selectAll(selectorString);
  }
};
