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
  },

  data: function(data) {
    var enter = [];
    var exit = [];

    this.forEach(function(subSelection) {
      var numSubSelectionElements = subSelection.length;
      var subSelectionEnter = [];
      var subSelectionExit = [];

      // update
      for (var i = 0; i < subSelection.length; i++) {
        if (data[i] !== undefined) {
          subSelection[i].__data__ = data[i];
        }
      }
      subSelection.length = data.length;

      // enter
      subSelectionEnter.length = Math.min(numSubSelectionElements, data.length);
      for (; i < data.length; i++) {
        subSelectionEnter.push({ __data__: data[i] });
      }

      // exit
      subSelectionExit.length = i;
      for (; i < subSelection.length; i++) {
        delete subSelection[i].__data__;
        subSelectionExit.push(subSelection[i]);
      }

      enter.push(subSelectionEnter);
      exit.push(subSelectionExit);
    });

    this.enter = function() {
      return enter;
    };

    this.exit = function() {
      return exit;
    };

    return this;
  },

  attr: function(name, setting) {
    this.forEach(function(subSelection) {
      var i = 0;
      subSelection.forEach(function(element) {
        var value;
        if (typeof setting === 'function') {
          value = setting(element.__data__, i);
        } else {
          value = setting;
        }

        element.setAttribute(name, value);
        ++i;
      });
    });

    return this;
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
