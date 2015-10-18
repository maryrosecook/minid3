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
    var update = addSelectionMixin([]);
    var enter = addSelectionMixin([]);
    var exit = addSelectionMixin([]);

    this.forEach(function(subSelection) {
      // update
      var subUpdate = subSelection.filter(function(n, i) { return n && data[i] !== undefined; });
      subUpdate.forEach(function(item, i) { item.__data__ = data[i]; });
      var numUpdateItems = subUpdate.length;
      subUpdate.length = data.length; // if data len < subSel len, discards subSel items

      // enter
      var subEnter = subSelection.map(function(n) { return n === null ? null : undefined; });
      subEnter.length = Math.min(numUpdateItems, data.length);
      for (var i = subEnter.length; i < data.length; i++) {
        subEnter.push({ __data__: data[i] });
      }

      // exit
      var subExit = [];
      subExit.length = Math.min(subSelection.length, data.length);
      for (var i = data.length; i < subSelection.length; i++) {
        delete subSelection[i].__data__;
        subExit.push(subSelection[i]);
      }

      update.push(setParentNode(subUpdate, subSelection.parentNode));
      enter.push(setParentNode(subEnter, subSelection.parentNode));
      exit.push(setParentNode(subExit, subSelection.parentNode));
    });

    update.enter = function() {
      return enter;
    };

    update.exit = function() {
      return exit;
    };

    return update;
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

function initialSelection() {
  var subSelection = [document];
  subSelection.parentNode = document.documentElement;
  return addSelectionMixin([subSelection]);
};

var minid3 = {
  select: function(selectorString) {
    return initialSelection().select(selectorString);
  },

  selectAll: function(selectorString) {
    return initialSelection().selectAll(selectorString);
  }
};
