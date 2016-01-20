Neato.utils = {
  haveEqualProps: function(o1, o2) {
    var p;
    for (p in o1) {
      if (typeof(o2[p]) == 'undefined') {return false;}
    }

    for (p in o1) {
      if (o1[p]) {
        switch (typeof(o1[p])) {
          case 'object':
            if (!(this.haveEqualProps(o1[p], o2[p]))) { return false; }
            break;
          case 'function':
            if (typeof(o2[p]) == 'undefined' ||
              (p != 'equals' && o1[p].toString() != o2[p].toString()))
              return false;
            break;
          default:
            if (o1[p] != o2[p]) { return false; }
        }
      } else {
        if (o2[p]) { return false; }
      }
    }

    for (p in o2) {
      if (typeof(o1[p]) == 'undefined') { return false; }
    }

    return true;
  },

  clone: function(obj, options) {
    options = options || {};

    var clone = {}
      , rejectedElements = options.except
      , selectedElements = options.only;

    for (var i in obj) {
      if (
        obj.hasOwnProperty(i) &&
        $.inArray(i, rejectedElements) === -1 &&
        (typeof(selectedElements) === "undefined" || $.inArray(i, selectedElements) !== -1)
      ) {
        clone[i] = obj[i];
      }
    }
    return clone;
  }
};
