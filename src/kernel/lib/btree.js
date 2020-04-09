
const DEFAULT_ORDER = 3;
const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_UNIQUE = true;
const DEFAULT_COMPARE = (a, b) => a - b;
const MIN_ORDER = 2;

let _seed = 0;

class EsperBtreeNode {
  constructor({
    nid = null,

    /// configurations
    order = DEFAULT_ORDER,
    min = DEFAULT_MIN_ITEMS,
    unique = DEFAULT_UNIQUE,
    primaryKey = null,
    compare = DEFAULT_COMPARE
  }) {
    this._nid = nid || ++_seed;
    this.options = { order, min, unique, primaryKey, compare };
    this.values = []; // array of array<data>
    this.parent = null;
    this.children = [null]; // always have a trailing child

    // operation flags
    this.dirty = false;

    // event listener
    this.eventHandlers = {
      onNodeDiscarded: node => { }
    };
  }
  get order() {
    return this.options.order;
  }
  get unique() {
    return this.options.unique;
  }
  get size() {
    return this.values.length;
  }
  get leaf() {
    return this.children.every(child => child === null);
  }
  get hasSpace() {
    return this.size < this.order;
  }
  get hasExtra() {
    return this.size > this.options.min;
  }
  get siblings() { // => [prev, next, index]
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      return [
        this.parent.children[index - 1] || null,
        this.parent.children[index + 1] || null,
        index
      ];
    }
    return [null, null, -1];
  }
  get overflow() {
    return this.size > this.order;
  }
  get underflow() {
    return this.size < this.options.min;
  }
  spawn() {
    const node = new EsperBtreeNode({
      ...this.options
    });
    node.eventHandlers = this.eventHandlers;
    node.dirty = true;
    return node;
  }
  get(i) { // => Array<data>
    return this.values[i];
  }
  on(eventType, handler) {
    this.eventHandlers[eventType] = handler;
  }
  indexAtValues(values, data) {
    const pk = this.options.primaryKey;
    if (pk) {
      for (let i in values) {
        if (values[i][pk] === data[pk]) {
          return parseInt(i);
        }
      }
      return -1;
    } else {
      return this.values[index].indexOf(data);
    }
  }
  placeOf(val) { // => [index, isMatch]
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].length > 0) {
        const compared = this.options.compare(val, this.values[i][0]);
        if (compared <= 0) {
          return [i, compared === 0];
        }
      }
    }
    return [this.values.length, false];
  }
  resolveOverflow() {
    const pivot = parseInt(this.order / 2);
    if (this.parent) {
      const [prev, next, index] = this.siblings;
      if (prev && prev.hasSpace) {
        // shift to previous
        prev.values.push(this.parent.values[index - 1]);
        prev.children.push(this.children.shift());
        if (prev.children[prev.children.length - 1]) {
          prev.children[prev.children.length - 1].parent = prev;
        }
        this.parent.values[index - 1] = this.values.shift();

        // mark dirtiness
        prev.dirty = true;
        this.dirty = true;
        this.parent.dirty = true;
      } else if (next && next.hasSpace) {
        // shift to next
        next.values.unshift(this.parent.values[index]);
        next.children.unshift(this.children.pop());
        if (next.children[0]) {
          next.children[0].parent = next;
        }
        this.parent.values[index] = this.values.pop();

        // mark dirtiness
        next.dirty = true;
        this.dirty = true;
        this.parent.dirty = true;
      } else {
        // split
        const right = this.spawn();
        right.values = this.values.slice(pivot + 1);
        right.parent = this.parent;
        right.children = this.children.slice(pivot + 1);
        right.children.forEach(c => { if (c) c.parent = right; });

        const [index, _] = this.parent.placeOf(this.values[pivot][0]);
        this.parent.values.splice(index, 0, this.values[pivot]);
        this.parent.children.splice(index + 1, 0, right);
        this.parent.children.forEach(c => { if (c) c.parent = this.parent; });

        /// keep the left node
        this.values.length = pivot;
        this.children.length = pivot + 1;
        if (this.parent.overflow) {
          this.parent.resolveOverflow();
        }

        // mark dirtiness
        this.dirty = true;
        this.parent.dirty = true;
      }
    } else {
      // this is root
      const left = this.spawn();
      left.values = this.values.slice(0, pivot);
      left.parent = this;
      left.children = this.children.slice(0, pivot + 1);
      left.children.forEach(c => { if (c) c.parent = left; });

      const right = this.spawn();
      right.values = this.values.slice(pivot + 1);
      right.parent = this;
      right.children = this.children.slice(pivot + 1);
      right.children.forEach(c => { if (c) c.parent = right; });

      this.values = [this.values[pivot]];
      this.children = [left, right];

      // mark dirtiness
      this.dirty = true;
    }
  }
  resolveUnderflow() {
    if (this.parent) {
      const [prev, next, index] = this.siblings;
      if (prev && prev.hasExtra) {
        // shift from previous sibling
        this.values.unshift(this.parent.values[index - 1]);
        this.children.unshift(prev.children.pop());
        if (this.children[0]) this.children[0].parent = this;
        this.parent.values[index - 1] = prev.values.pop();

        // mark dirtiness
        prev.dirty = true;
        this.dirty = true;
        this.parent.dirty = true;
      } else if (next && next.hasExtra) {
        // shift from next sibling
        this.values.push(this.parent.values[index]);
        this.children.push(next.children.shift());
        if (this.children[this.children.length - 1]) {
          this.children[this.children.length - 1].parent = this;
        }
        this.parent.values[index] = next.values.shift();

        // mark dirtiness
        next.dirty = true;
        this.dirty = true;
        this.parent.dirty = true;
      } else {
        if (prev) {
          // merge with previous node
          this.values = [...prev.values, this.parent.values[index - 1]];
          this.children = [...prev.children, ...this.children];
          this.children.forEach(c => { if (c) c.parent = this; });

          this.parent.values.splice(index - 1, 1);
          this.parent.children.splice(index - 1, 1);

          // mark dirtiness
          this.dirty = true;
          this.parent.dirty = true;
          if (this.eventHandlers.onNodeDiscarded)
            this.eventHandlers.onNodeDiscarded(prev);
        } else if (next) {
          // merge with next node
          this.values = [this.parent.values[index], ...next.values];
          this.children = [...this.children, ...next.children];
          this.children.forEach(c => { if (c) c.parent = this; });

          this.parent.values.splice(index, 1);
          this.parent.children.splice(index + 1, 1);

          // mark dirtiness
          this.dirty = true;
          this.parent.dirty = true;
          if (this.eventHandlers.onNodeDiscarded)
            this.eventHandlers.onNodeDiscarded(next);
        }
        if (this.parent.underflow) {
          this.parent.resolveUnderflow();
        }
      }
    } else {
      // if it's root, merge all the children
      const discardedChildren = this.children;
      const mergedValues = [];
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        if (child) {
          mergedValues.push(...child.values);
        }
        if (i < this.values.length) {
          mergedValues.push(this.values[i]);
        }
      }
      this.children = [
        ...this.children
          .map(c => c ? c.children : [])
          .reduce((a, c) => a.concat(c), [])
      ];
      this.children.forEach(c => { if (c) c.parent = this; });

      // mark dirtiness
      this.dirty = true;
      if (this.eventHandlers.onNodeDiscarded) {
        for (let i in discardedChildren) {
          if (discardedChildren[i]) {
            this.eventHandlers.onNodeDiscarded(discardedChildren[i]);
          }
        }
      }
    }
  }
  prettyprint({ depth = 0, formatter = null }) {
    const prints = [
      `parent=${this.parent ? this.parent._nid : 0}`,
      `nid=${this._nid}`,
      this.values.map(v => formatter ? formatter(v) : JSON.stringify(v))
    ];
    if (depth) {
      prints.unshift('\t'.repeat(depth));
    }
    console.log(...prints);

    for (let i in this.children) {
      if (this.children[i])
        this.children[i].prettyprint({ depth: depth + 1, formatter });
    }
  }
}

const _private = new WeakMap();
class EsperBtree {
  constructor(options = {}) {
    options.order = Math.max(MIN_ORDER, options.order || DEFAULT_ORDER);
    _private.set(this, {
      root: new EsperBtreeNode({ ...options }),
      count: 0
    });
  }
  get order() {
    return _private.get(this).root.order;
  }
  get unique() {
    return _private.get(this).root.unique;
  }
  get count() {
    return _private.get(this).count;
  }
  getAllDirtyNodes() {
    const { root } = _private.get(this);
    const list = [];
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node.dirty) list.push(node);
      for (let i in node.children) {
        if (node.children[i]) {
          stack.push(node.children[i]);
        }
      }
    }
    return list;
  }
  _iterate({
    data = null,
    handler = null
  }) {
    let index = 0;
    const { root } = _private.get(this);
    const stack = [root];
    while (stack.length > 0) {
      const val = stack.pop();
      if (val instanceof EsperBtreeNode) {
        const node = val;
        const [index, _] = data ? node.placeOf(data) : [0, false];

        for (let i = node.children.length - 1; i >= index; i--) {
          if (i < node.values.length) stack.push(node.values[i]);
          stack.push(node.children[i]);
        }
      } else if (Array.isArray(val)) {
        if (handler) {
          for (let i = 0; i < val.length; i++) {
            if (handler(val[i], index++) === false) return;
          }
        }
      }
    }
  }
  iterateFrom(data, handler) {
    this._iterate({ data, handler });
  }
  iterateAll(handler) {
    this._iterate({ data: null, handler });
  }
  put(val) { // => inserted: boolean
    const { root } = _private.get(this);
    let node = root;
    while (!node.leaf) {
      const [index, match] = node.placeOf(val);
      if (match) {
        if (!this.unique) {
          const valueIndex = node.indexAtValues(node.values[index], val);
          if (valueIndex < 0) {
            node.values[index].push(val);
            _private.get(this).count++;
            return true;
          } else {
            node.values[index][valueIndex] = val;
          }
        } else {
          node.values[index] = [val];
        }
        return false;
      }
      node = node.children[index];
    }
    const [index, match] = node.placeOf(val);
    if (!match) {
      node.values.splice(index, 0, [val]);
      node.children.splice(index, 0, null);
      if (node.overflow) node.resolveOverflow();
      _private.get(this).count++;
      return true;
    } else {
      if (!this.unique) {
        const valueIndex = node.indexAtValues(node.values[index], val);
        if (valueIndex < 0) {
          node.values[index].push(val);
          _private.get(this).count++;
          return true;
        } else {
          node.values[index][valueIndex] = val;
        }
      } else {
        node.values[index] = [val];
      }
      return false;
    }
  }
  remove(val) { // => removed: boolean
    const { root } = _private.get(this);
    let node = root;
    while (!node.leaf) {
      const [index, match] = node.placeOf(val);
      if (match) {
        if (node.values[index].length === 1) {
          let nextLeafNode = node.children[index + 1];
          while (!nextLeafNode.leaf) {
            nextLeafNode = nextLeafNode.children[0];
          }

          const swapper = nextLeafNode.values[0];
          nextLeafNode.values[0] = node.values[index];
          node.values[index] = swapper;

          nextLeafNode.values.splice(0, 1);
          nextLeafNode.children.splice(0, 1);
          if (nextLeafNode.underflow) {
            nextLeafNode.resolveUnderflow();
          }
        } else {
          const valueIndex = node.indexAtValues(node.values[index], val);
          if (valueIndex > -1)
            node.values[index].splice(valueIndex, 1);
        }
        _private.get(this).count--;
        return true;
      }
      node = node.children[index];
    }
    const [index, match] = node.placeOf(val);
    if (match) {
      if (node.values[index].length === 1) {
        node.values.splice(index, 1);
        node.children.splice(index, 1);
        if (node.underflow) {
          node.resolveUnderflow();
        }
      } else {
        const valueIndex = node.indexAtValues(node.values[index], val);
        if (valueIndex > -1)
          node.values[index].splice(valueIndex, 1);
      }
      _private.get(this).count--;
      return true;
    }
    return false;
  }
  clear() {
    const { root } = _private.get(this);
    _private.set(this, {
      root: root.spawn(),
      count: 0
    });
  }
  prettyprint(formatter = null) {
    const { root } = _private.get(this);
    root.prettyprint({ depth: 0, formatter });
  }
}

export default EsperBtree;