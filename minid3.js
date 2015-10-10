var selectionMixin = {
  select: function(selectorString) {
    return addSelectionMixin(this.reduce(function(a, subSelection) {
      a.push(subSelection.map(function(node) { return node.querySelector(selectorString); }));
      return a;
    }, []));
  },

  selectAll: function(selectorString) {
    return addSelectionMixin(this.reduce(function(a, subSelection) {
      return a.concat(subSelection.map(function(node) {
        return toArr(node.querySelectorAll(selectorString)); }));
    }, []));
  },

  data: function(data) {
    var enter = [];
    var exit = [];

    this.forEach(function(subSelection) {
      var originalSubSelection = subSelection.slice();
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
      subSelectionEnter.length = Math.min(originalSubSelection.length, data.length);
      for (; i < data.length; i++) {
        subSelectionEnter.push({ __data__: data[i] });
      }

      // exit
      subSelectionExit.length = Math.min(originalSubSelection.length, data.length);
      for (var i = data.length; i < originalSubSelection.length; i++) {
        delete originalSubSelection[i].__data__;
        subSelectionExit.push(originalSubSelection[i]);
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

  style: function(name, setting) {
    this.forEach(function(subSelection) {
      var i = 0;
      subSelection.forEach(function(element) {
        var value;
        if (typeof setting === 'function') {
          element.style[name] = setting(element.__data__, i);
        } else {
          element.style[name] = setting;
        }

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

function toArr(arrayLike) {
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
