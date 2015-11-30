function select(selector) {
  var subSelectionMaker = typeof selector === 'function' ?
      selector : function(node) { return node.querySelector(selector); };

  return mixin(selectExitMixin, this.reduce(function(a, subSelection) {
    var newSubSelection = [];
    for (var i = 0; i < subSelection.length; i++) { // can't map - subS maybe padded w/ len
      newSubSelection.push(subSelectionMaker(subSelection[i], subSelection.parentNode));
    }

    a.push(setParentNode(newSubSelection, subSelection.parentNode));
    return a;
  }, []));
};

function selectAll(selector) {
  return mixin(selectExitMixin, this.reduce(function(a, subSelection) {
    return a.concat(subSelection.map(function(node) {
      return setParentNode(toArray(node.querySelectorAll(selector)), node);
    }));
  }, []));
};

function data(data) {
  var update = mixin(selectExitMixin, []);
  var enter = mixin(enterMixin, []);
  var exit = mixin(selectExitMixin, []);

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
};

function style(name, setting) {
  this.forEach(function(subSelection) {
    var i = 0;
    subSelection.forEach(function(element) {
      if (typeof setting === 'function') {
        element.style[name] = setting(element.__data__, i);
      } else {
        element.style[name] = setting;
      }
      ++i;
    });
  });

  return this;
};

function append(nodeName) {
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
};

var selectExitMixin = {
  select: select,
  selectAll: selectAll,
  data: data,
  style: style,
  append: append
};

var enterMixin = {
  select: select,
  append: append
};

function setParentNode(selection, parentNode) {
  selection.parentNode = parentNode;
  return selection;
};

function mixin(from, to) {
  for (var key in from) {
    to[key] = from[key];
  }

  return to;
};

function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var minid3 = {
  select: function(selector) {
    return mixin(selectExitMixin, [setParentNode([document], document.documentElement)])
      .select(selector);
  },

  selectAll: function(selector) {
    return mixin(selectExitMixin, [setParentNode(toArray(document.querySelectorAll(selector)),
                                                 document.documentElement)]);
  }
};
