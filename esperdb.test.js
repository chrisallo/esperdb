(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  function encryptionTest () {
    describe('encryption', function () {});
  }

  function storeTest () {
    describe('store', function () {});
  }

  function interfaceTest () {
    describe('interface', function () {
      encryptionTest();
      storeTest();
    });
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var DEFAULT_ORDER = 3;
  var DEFAULT_MIN_ITEMS = 1;
  var DEFAULT_UNIQUE = true;

  var DEFAULT_COMPARE = function DEFAULT_COMPARE(a, b) {
    return a - b;
  };

  var MIN_ORDER = 2;
  var _seed = 0;

  var BtreeNode = /*#__PURE__*/function () {
    function BtreeNode(_ref) {
      var _ref$order = _ref.order,
          order = _ref$order === void 0 ? DEFAULT_ORDER : _ref$order,
          _ref$min = _ref.min,
          min = _ref$min === void 0 ? DEFAULT_MIN_ITEMS : _ref$min,
          _ref$unique = _ref.unique,
          unique = _ref$unique === void 0 ? DEFAULT_UNIQUE : _ref$unique,
          _ref$primaryKey = _ref.primaryKey,
          primaryKey = _ref$primaryKey === void 0 ? null : _ref$primaryKey,
          _ref$compare = _ref.compare,
          compare = _ref$compare === void 0 ? DEFAULT_COMPARE : _ref$compare;

      classCallCheck(this, BtreeNode);

      this._nid = ++_seed;
      this.options = {
        order: order,
        min: min,
        unique: unique,
        primaryKey: primaryKey,
        compare: compare
      };
      this.values = []; // array of array<data>

      this.parent = null;
      this.children = [null]; // always have a trailing child
    }

    createClass(BtreeNode, [{
      key: "spawn",
      value: function spawn() {
        return new BtreeNode(_objectSpread({}, this.options));
      }
    }, {
      key: "get",
      value: function get(i) {
        // => Array<data>
        return this.values[i];
      }
    }, {
      key: "indexAtValues",
      value: function indexAtValues(index, val) {
        var pk = this.options.primaryKey;

        if (pk) {
          for (var i in this.values[index]) {
            var item = this.values[index][i];

            if (item[pk] === val[pk]) {
              return parseInt(i);
            }
          }

          return -1;
        } else {
          return this.values[index].indexOf(val);
        }
      }
    }, {
      key: "placeOf",
      value: function placeOf(val) {
        // => [index, isMatch]
        for (var i = 0; i < this.values.length; i++) {
          if (this.values[i].length > 0) {
            var compared = this.options.compare(val, this.values[i][0]);

            if (compared <= 0) {
              return [i, compared === 0];
            }
          }
        }

        return [this.values.length, false];
      }
    }, {
      key: "resolveOverflow",
      value: function resolveOverflow() {
        var _this = this;

        var pivot = parseInt(this.order / 2);

        if (this.parent) {
          var _this$siblings = slicedToArray(this.siblings, 3),
              prev = _this$siblings[0],
              next = _this$siblings[1],
              index = _this$siblings[2];

          if (prev && prev.hasSpace) {
            // shift to previous
            prev.values.push(this.parent.values[index - 1]);
            prev.children.push(this.children.shift());

            if (prev.children[prev.children.length - 1]) {
              prev.children[prev.children.length - 1].parent = prev;
            }

            this.parent.values[index - 1] = this.values.shift();
          } else if (next && next.hasSpace) {
            // shift to next
            next.values.unshift(this.parent.values[index]);
            next.children.unshift(this.children.pop());

            if (next.children[0]) {
              next.children[0].parent = next;
            }

            this.parent.values[index] = this.values.pop();
          } else {
            // split
            var right = this.spawn();
            right.values = this.values.slice(pivot + 1);
            right.parent = this.parent;
            right.children = this.children.slice(pivot + 1);
            right.children.forEach(function (c) {
              if (c) c.parent = right;
            });

            var _this$parent$placeOf = this.parent.placeOf(this.values[pivot][0]),
                _this$parent$placeOf2 = slicedToArray(_this$parent$placeOf, 2),
                _index = _this$parent$placeOf2[0],
                _ = _this$parent$placeOf2[1];

            this.parent.values.splice(_index, 0, this.values[pivot]);
            this.parent.children.splice(_index + 1, 0, right);
            this.parent.children.forEach(function (c) {
              if (c) c.parent = _this.parent;
            }); /// keep the left node

            this.values.length = pivot;
            this.children.length = pivot + 1;

            if (this.parent.overflow) {
              this.parent.resolveOverflow();
            }
          }
        } else {
          // this is root
          var left = this.spawn();
          left.values = this.values.slice(0, pivot);
          left.parent = this;
          left.children = this.children.slice(0, pivot + 1);
          left.children.forEach(function (c) {
            if (c) c.parent = left;
          });

          var _right = this.spawn();

          _right.values = this.values.slice(pivot + 1);
          _right.parent = this;
          _right.children = this.children.slice(pivot + 1);

          _right.children.forEach(function (c) {
            if (c) c.parent = _right;
          });

          this.values = [this.values[pivot]];
          this.children = [left, _right];
        }
      }
    }, {
      key: "resolveUnderflow",
      value: function resolveUnderflow() {
        var _this2 = this;

        if (this.parent) {
          var _this$siblings2 = slicedToArray(this.siblings, 3),
              prev = _this$siblings2[0],
              next = _this$siblings2[1],
              index = _this$siblings2[2];

          if (prev && prev.hasExtra) {
            this.values.unshift(this.parent.values[index - 1]);
            this.children.unshift(prev.children.pop());
            if (this.children[0]) this.children[0].parent = this;
            this.parent.values[index - 1] = prev.values.pop();
          } else if (next && next.hasExtra) {
            this.values.push(this.parent.values[index]);
            this.children.push(next.children.shift());

            if (this.children[this.children.length - 1]) {
              this.children[this.children.length - 1].parent = this;
            }

            this.parent.values[index] = next.values.shift();
          } else {
            if (prev) {
              this.values = [].concat(toConsumableArray(prev.values), [this.parent.values[index - 1]]);
              this.children = [].concat(toConsumableArray(prev.children), toConsumableArray(this.children));
              this.children.forEach(function (c) {
                if (c) c.parent = _this2;
              });
              this.parent.values.splice(index - 1, 1);
              this.parent.children.splice(index - 1, 1);
            } else if (next) {
              this.values = [this.parent.values[index]].concat(toConsumableArray(next.values));
              this.children = [].concat(toConsumableArray(this.children), toConsumableArray(next.children));
              this.children.forEach(function (c) {
                if (c) c.parent = _this2;
              });
              this.parent.values.splice(index, 1);
              this.parent.children.splice(index + 1, 1);
            }

            if (this.parent.underflow) {
              this.parent.resolveUnderflow();
            }
          }
        } else {
          this.values = toConsumableArray(this.children.map(function (c) {
            return c ? c.values : [];
          }).reduce(function (a, c) {
            return a.concat(c);
          }, []));
          this.children = toConsumableArray(this.children.map(function (c) {
            return c ? c.children : [];
          }).reduce(function (a, c) {
            return a.concat(c);
          }, []));
          this.children.forEach(function (c) {
            if (c) c.parent = _this2;
          });
        }
      }
    }, {
      key: "prettyprint",
      value: function prettyprint() {
        var _console;

        var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var prints = ["parent=".concat(this.parent ? this.parent._nid : 0), "nid=".concat(this._nid), this.values];

        if (depth) {
          prints.unshift('\t'.repeat(depth));
        }

        (_console = console).log.apply(_console, prints);

        for (var i in this.children) {
          if (this.children[i]) this.children[i].prettyprint(depth + 1);
        }
      }
    }, {
      key: "order",
      get: function get() {
        return this.options.order;
      }
    }, {
      key: "unique",
      get: function get() {
        return this.options.unique;
      }
    }, {
      key: "size",
      get: function get() {
        return this.values.length;
      }
    }, {
      key: "leaf",
      get: function get() {
        return this.children.every(function (child) {
          return child === null;
        });
      }
    }, {
      key: "hasSpace",
      get: function get() {
        return this.size < this.order;
      }
    }, {
      key: "hasExtra",
      get: function get() {
        return this.size > this.options.min;
      }
    }, {
      key: "siblings",
      get: function get() {
        // => [prev, next, index]
        if (this.parent) {
          var index = this.parent.children.indexOf(this);
          return [this.parent.children[index - 1] || null, this.parent.children[index + 1] || null, index];
        }

        return [null, null, -1];
      }
    }, {
      key: "overflow",
      get: function get() {
        return this.size > this.order;
      }
    }, {
      key: "underflow",
      get: function get() {
        return this.size < this.options.min;
      }
    }]);

    return BtreeNode;
  }();

  var _private = new WeakMap();

  var Btree = /*#__PURE__*/function () {
    function Btree() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      classCallCheck(this, Btree);

      options.order = Math.max(MIN_ORDER, options.order || DEFAULT_ORDER);

      _private.set(this, {
        root: new BtreeNode(_objectSpread({}, options)),
        count: 0
      });
    }

    createClass(Btree, [{
      key: "iterateFrom",
      value: function iterateFrom(data, handler) {
        var index = 0;

        var _private$get = _private.get(this),
            root = _private$get.root;

        var stack = [root];

        while (stack.length > 0) {
          var val = stack.pop();

          if (val instanceof BtreeNode) {
            var _val$placeOf = val.placeOf(data),
                _val$placeOf2 = slicedToArray(_val$placeOf, 2),
                _index2 = _val$placeOf2[0],
                match = _val$placeOf2[1];

            for (var i = val.children.length - 1; i > _index2; i--) {
              if (i < val.values.length) stack.push(val.values[i]);
              if (val.children[i]) stack.push(val.children[i]);
            }

            if (_index2 < val.values.length) stack.push(val.values[_index2]);
            if (val.children[_index2] && !match) stack.push(val.children[_index2]);
          } else if (Array.isArray(val)) {
            for (var _i in val) {
              if (handler(val[_i], index++) === false) return;
            }
          }
        }
      }
    }, {
      key: "iterateAll",
      value: function iterateAll(handler) {
        var index = 0;

        var _private$get2 = _private.get(this),
            root = _private$get2.root;

        var stack = [root];

        while (stack.length > 0) {
          var val = stack.pop();

          if (val instanceof BtreeNode) {
            for (var i = val.children.length - 1; i >= 0; i--) {
              if (i < val.values.length) stack.push(val.values[i]);
              if (val.children[i]) stack.push(val.children[i]);
            }
          } else if (Array.isArray(val)) {
            for (var _i2 in val) {
              if (handler(val[_i2], index++) === false) return;
            }
          }
        }
      }
    }, {
      key: "put",
      value: function put(val) {
        // => inserted: boolean
        var _private$get3 = _private.get(this),
            root = _private$get3.root;

        var node = root;

        while (!node.leaf) {
          var _node$placeOf = node.placeOf(val),
              _node$placeOf2 = slicedToArray(_node$placeOf, 2),
              _index3 = _node$placeOf2[0],
              _match = _node$placeOf2[1];

          if (_match) {
            if (!this.unique) {
              var valueIndex = node.indexAtValues(_index3, val);

              if (valueIndex < 0) {
                node.values[_index3].push(val);

                _private.get(this).count++;
                return true;
              } else {
                node.values[_index3][valueIndex] = val;
              }
            } else {
              node.values[_index3] = [val];
            }

            return false;
          }

          node = node.children[_index3];
        }

        var _node$placeOf3 = node.placeOf(val),
            _node$placeOf4 = slicedToArray(_node$placeOf3, 2),
            index = _node$placeOf4[0],
            match = _node$placeOf4[1];

        if (!match) {
          node.values.splice(index, 0, [val]);
          node.children.splice(index, 0, null);
          if (node.overflow) node.resolveOverflow();
          _private.get(this).count++;
          return true;
        } else {
          if (!this.unique) {
            var _valueIndex = node.indexAtValues(index, val);

            if (_valueIndex < 0) {
              node.values[index].push(val);
              _private.get(this).count++;
              return true;
            } else {
              node.values[index][_valueIndex] = val;
            }
          } else {
            node.values[index] = [val];
          }

          return false;
        }
      }
    }, {
      key: "remove",
      value: function remove(val) {
        // => removed: boolean
        var _private$get4 = _private.get(this),
            root = _private$get4.root;

        var node = root;

        while (!node.leaf) {
          var _node$placeOf5 = node.placeOf(val),
              _node$placeOf6 = slicedToArray(_node$placeOf5, 2),
              _index4 = _node$placeOf6[0],
              _match2 = _node$placeOf6[1];

          if (_match2) {
            if (node.values[_index4].length === 1) {
              var nextLeafNode = node.children[_index4 + 1];

              while (!nextLeafNode.leaf) {
                nextLeafNode = nextLeafNode.children[0];
              }

              var swapper = nextLeafNode.values[0];
              nextLeafNode.values[0] = node.values[_index4];
              node.values[_index4] = swapper;
              nextLeafNode.values.splice(0, 1);
              nextLeafNode.children.splice(0, 1);

              if (nextLeafNode.underflow) {
                nextLeafNode.resolveUnderflow();
              }
            } else {
              var valueIndex = node.indexAtValues(_index4, val);
              if (valueIndex > -1) node.values[_index4].splice(valueIndex, 1);
            }

            _private.get(this).count--;
            return true;
          }

          node = node.children[_index4];
        }

        var _node$placeOf7 = node.placeOf(val),
            _node$placeOf8 = slicedToArray(_node$placeOf7, 2),
            index = _node$placeOf8[0],
            match = _node$placeOf8[1];

        if (match) {
          if (node.values[index].length === 1) {
            node.values.splice(index, 1);
            node.children.splice(index, 1);

            if (node.underflow) {
              node.resolveUnderflow();
            }
          } else {
            var _valueIndex2 = node.indexAtValues(index, val);

            if (_valueIndex2 > -1) node.values[index].splice(_valueIndex2, 1);
          }

          _private.get(this).count--;
          return true;
        }

        return false;
      }
    }, {
      key: "clear",
      value: function clear() {
        var _private$get5 = _private.get(this),
            root = _private$get5.root;

        _private.set(this, {
          root: root.spawn(),
          count: 0
        });
      }
    }, {
      key: "prettyprint",
      value: function prettyprint() {
        var _private$get6 = _private.get(this),
            root = _private$get6.root;

        root.prettyprint();
      }
    }, {
      key: "unique",
      get: function get() {
        return _private.get(this).root.unique;
      }
    }, {
      key: "count",
      get: function get() {
        return _private.get(this).count;
      }
    }]);

    return Btree;
  }();

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function libBtreeTest () {
    var ADD_COUNT = 10000;
    var UPDATE_COUNT = 2500;
    var REMOVE_COUNT = 2000;
    var RANGE = 5000;
    describe('btree non-unique', function () {
      this.timeout(60000);
      var seed = 0;
      var data = [];

      for (var i = 0; i < ADD_COUNT; i++) {
        var n = parseInt(RANGE * Math.random()) % RANGE;
        var x = {
          k: "k_".concat(++seed),
          n: n
        };
        data.push(x);
      }

      var updated = [];

      for (var _i = 0; _i < UPDATE_COUNT; _i++) {
        var idx = parseInt((data.length - 1) * Math.random());
        if (!updated.includes(data[idx])) updated.push(data[idx]);
      }

      var removed = [];

      for (var _i2 = 0; _i2 < REMOVE_COUNT; _i2++) {
        var _idx = parseInt((data.length - 1) * Math.random());

        if (!removed.includes(data[_idx])) removed.push(data[_idx]);
      }

      var remained = [];

      for (var _i3 in data) {
        if (!removed.includes(data[_i3])) {
          remained.push(data[_i3]);
        }
      }

      var sorted = [].concat(data).sort(function (a, b) {
        return a.n - b.n;
      });
      var bt = null;
      before(function (done) {
        bt = new Btree({
          order: 50,
          unique: false,
          primaryKey: 'k',
          compare: function compare(a, b) {
            return a.n - b.n;
          }
        });
        done();
      });
      beforeEach(function (done) {
        bt.clear();
        done();
      });
      it('add > iterateAll', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var list = [];
        bt.iterateAll(function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i4 = 1; _i4 < list.length; _i4++) {
          assert.isAtLeast(list[_i4].n, list[_i4 - 1].n);
        }

        done();
      });
      it('add > iterateAll break', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var limit = 2000;
        var list = [];
        bt.iterateAll(function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
          if (list.length === limit) return false;
        });
        assert.sameOrderedMembers(sorted.map(function (x) {
          return x.k;
        }).slice(0, limit), list.map(function (x) {
          return x.k;
        }));

        for (var _i5 = 1; _i5 < list.length; _i5++) {
          assert.isAtLeast(list[_i5].n, list[_i5 - 1].n);
        }

        done();
      });
      it('add > iterateFrom match top', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = 0;
        var list = [];
        bt.iterateFrom(sorted[cursor], function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.slice(cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i6 = 1; _i6 < list.length; _i6++) {
          assert.isAtLeast(list[_i6].n, list[_i6 - 1].n);
        }

        done();
      });
      it('add > iterateFrom not match top', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = 0;
        var list = [];
        bt.iterateFrom({
          n: sorted[cursor].n - 0.5
        }, function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.slice(cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i7 = 1; _i7 < list.length; _i7++) {
          assert.isAtLeast(list[_i7].n, list[_i7 - 1].n);
        }

        done();
      });
      it('add > iterateFrom match middle', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = sorted.map(function (d) {
          return d.n;
        }).indexOf(10);
        var list = [];
        bt.iterateFrom(sorted[cursor], function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.slice(cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i8 = 1; _i8 < list.length; _i8++) {
          assert.isAtLeast(list[_i8].n, list[_i8 - 1].n);
        }

        done();
      });
      it('add > iterateFrom not match middle', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = sorted.map(function (d) {
          return d.n;
        }).indexOf(10);
        var list = [];
        bt.iterateFrom({
          n: sorted[cursor].n - 0.5
        }, function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.slice(cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i9 = 1; _i9 < list.length; _i9++) {
          assert.isAtLeast(list[_i9].n, list[_i9 - 1].n);
        }

        done();
      });
      it('add > iterateFrom match bottom', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var max = sorted.reduce(function (a, c) {
          return Math.max(a, c.n);
        }, 0);
        var cursor = sorted.map(function (d) {
          return d.n;
        }).indexOf(max);
        var list = [];
        bt.iterateFrom(sorted[cursor], function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.slice(cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i10 = 1; _i10 < list.length; _i10++) {
          assert.isAtLeast(list[_i10].n, list[_i10 - 1].n);
        }

        done();
      });
      it('add > iterateFrom not match bottom', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var max = sorted.reduce(function (a, c) {
          return Math.max(a, c.n);
        }, 0);
        var cursor = sorted.map(function (d) {
          return d.n;
        }).indexOf(max);
        var list = [];
        bt.iterateFrom({
          n: sorted[cursor].n - 0.5
        }, function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameOrderedMembers(sorted.slice(cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i11 = 1; _i11 < list.length; _i11++) {
          assert.isAtLeast(list[_i11].n, list[_i11 - 1].n);
        }

        done();
      });
      it('add > iterateFrom not match exceed bottom', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = data.length - 1;
        var list = [];
        bt.iterateFrom({
          n: sorted[cursor].n + 0.5
        }, function (x, i) {
          list.push(x);
        });
        assert.sameMembers([], list);
        done();
      });
      it('add > iterateFrom match break', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = sorted.map(function (d) {
          return d.n;
        }).indexOf(10);
        var limit = 2000;
        var list = [];
        bt.iterateFrom(sorted[cursor], function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
          if (list.length === limit) return false;
        });
        assert.sameOrderedMembers(sorted.slice(cursor, limit + cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i12 = 1; _i12 < list.length; _i12++) {
          assert.isAtLeast(list[_i12].n, list[_i12 - 1].n);
        }

        done();
      });
      it('add > iterateFrom not match break', function (done) {
        data.forEach(function (value) {
          bt.put(value);
        });
        var cursor = sorted.map(function (d) {
          return d.n;
        }).indexOf(10);
        var limit = 2000;
        var list = [];
        bt.iterateFrom({
          n: sorted[cursor].n - 0.5
        }, function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
          if (list.length === limit) return false;
        });
        assert.sameOrderedMembers(sorted.slice(cursor, limit + cursor).map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i13 = 1; _i13 < list.length; _i13++) {
          assert.isAtLeast(list[_i13].n, list[_i13 - 1].n);
        }

        done();
      });
      it('add > update > iterateAll', function (done) {
        data.forEach(function (v) {
          bt.put(v);
        });
        updated.forEach(function (v) {
          var u = _objectSpread$1({}, v, {
            m: 'marked'
          });

          bt.put(u);
        });
        var list = [];
        bt.iterateAll(function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.isTrue(list.filter(function (x) {
          return updated.map(function (i) {
            return i.k;
          }).includes(x.k);
        }).every(function (x) {
          return x.m === 'marked';
        }));
        assert.sameOrderedMembers(sorted.map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i14 = 1; _i14 < list.length; _i14++) {
          assert.isAtLeast(list[_i14].n, list[_i14 - 1].n);
        }

        done();
      });
      it('add > remove > iterateAll', function (done) {
        data.forEach(function (v) {
          bt.put(v);
        });
        removed.forEach(function (v) {
          bt.remove(v);
        });
        var list = [];
        bt.iterateAll(function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameMembers(remained.map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i15 = 1; _i15 < list.length; _i15++) {
          assert.isAtLeast(list[_i15].n, list[_i15 - 1].n);
        }

        done();
      });
      it('add > remove > re-add > iterateAll', function (done) {
        data.forEach(function (v) {
          bt.put(v);
        });
        removed.forEach(function (v) {
          bt.remove(v);
        });
        removed.forEach(function (v) {
          bt.put(v);
        });
        var list = [];
        bt.iterateAll(function (x, i) {
          assert.equal(i, list.length);
          list.push(x);
        });
        assert.sameMembers(sorted.map(function (x) {
          return x.k;
        }), list.map(function (x) {
          return x.k;
        }));

        for (var _i16 = 1; _i16 < list.length; _i16++) {
          assert.isAtLeast(list[_i16].n, list[_i16 - 1].n);
        }

        done();
      });
    });
  }

  function kernelTest () {
    describe('kernel', function () {
      libBtreeTest();
    });
  }

  function utilsTest () {
    describe('utils test', function () {// TODO:
    });
  }

  describe('esperdb test', function () {
    describe('unit test', function () {
      interfaceTest();
      kernelTest();
      utilsTest();
    });
  });

})));