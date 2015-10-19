var selectionMixin = {
  select: function(selector) {
    var subSelectionMaker = selector instanceof Function ?
        selector : function(node) { return node.querySelector(selector); };

    return addSelectionMixin(this.reduce(function(a, subSelection) {
      var newSubSelection = [];
      for (var i = 0; i < subSelection.length; i++) { // can't map - subS maybe padded w/ len
        newSubSelection.push(subSelectionMaker(subSelection[i], subSelection.parentNode));
      }

      a.push(setParentNode(newSubSelection, subSelection.parentNode));
      return a;
    }, []));
  },

  selectAll: function(selector) {
    return addSelectionMixin(this.reduce(function(a, subSelection) {
      return a.concat(subSelection.map(function(node) {
        return setParentNode(toArray(node.querySelectorAll(selector)), node);
      }));
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
  },

  append: function(nodeName) {
    return this.select(function(node, parentNode) {
      if (!node) {
        return null;
      } else {
        var childNode = document.createElement(nodeName);
        var appendTo = node instanceof Node ? node : parentNode;
        childNode.__data__ = node.__data__;
        appendTo.appendChild(childNode);
        return childNode;
      }
    });
  }
};

function setParentNode(selection, parentNode) {
  selection.parentNode = parentNode;
  return selection;
};

function addSelectionMixin(selection) {
  for (var key in selectionMixin) {
    selection[key] = selectionMixin[key];
  }

  return selection;
};

function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var minid3 = {
  select: function(selectorString) {
    return addSelectionMixin([setParentNode([document], document.documentElement)])
      .select(selectorString);
  },

  selectAll: function(selectorString) {
    return addSelectionMixin([setParentNode(toArray(document.querySelectorAll(selectorString)),
                                            document.documentElement)]);
  }
};
