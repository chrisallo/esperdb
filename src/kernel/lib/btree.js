
const DEFAULT_ORDER = 3;
const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_COMPARE = (a, b) => a - b;
const MIN_ORDER = 2;

let _seed = 0;

class BtreeNode {
  constructor({
    order = DEFAULT_ORDER,
    min = DEFAULT_MIN_ITEMS,
    compare = (a, b) => a - b
  }) {
    this._nid = ++_seed;
    this.options = { order, min, compare };
    this.values = [];
    this.parent = null;
    this.children = [null]; // always have a trailing child
  }
  get order() {
    return this.options.order;
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
    return new BtreeNode({ ...this.options });
  }
  get(i) {
    return this.values[i];
  }
  placeOf(val) { // => [index, isMatch]
    for (let i = 0; i < this.values.length; i++) {
      const compared = this.options.compare(val, this.values[i]);
      if (compared <= 0) {
        return [i, compared === 0];
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
        const right = this.spawn();
        right.values = this.values.slice(pivot + 1);
        right.parent = this.parent;
        right.children = this.children.slice(pivot + 1);
        right.children.forEach(c => { if (c) c.parent = right; });

        const [index, _] = this.parent.placeOf(this.values[pivot]);
        this.parent.values.splice(index, 0, this.values[pivot]);
        this.parent.children.splice(index + 1, 0, right);
        this.parent.children.forEach(c => { if (c) c.parent = this.parent; });

        /// keep the left node
        this.values.length = pivot;
        this.children.length = pivot + 1;
        if (this.parent.overflow) {
          this.parent.resolveOverflow();
        }
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
    }
  }
  resolveUnderflow() {
    if (this.parent) {
      const [prev, next, index] = this.siblings;
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
          this.values = [...prev.values, this.parent.values[index - 1]];
          this.children = [...prev.children, ...this.children];
          this.children.forEach(c => { if (c) c.parent = this; });

          this.parent.values.splice(index - 1, 1);
          this.parent.children.splice(index - 1, 1);
        } else if (next) {
          this.values = [this.parent.values[index], ...next.values];
          this.children = [...this.children, ...next.children];
          this.children.forEach(c => { if (c) c.parent = this; });

          this.parent.values.splice(index, 1);
          this.parent.children.splice(index + 1, 1);
        }
        if (this.parent.underflow) {
          this.parent.resolveUnderflow();
        }
      }
    } else {
      this.values = [
        ...this.children
          .map(c => c ? c.values : [])
          .reduce((a, c) => a.concat(c), [])
      ];
      this.children = [
        ...this.children
          .map(c => c ? c.children : [])
          .reduce((a, c) => a.concat(c), [])
      ];
      this.children.forEach(c => { if (c) c.parent = this; });
    }
  }
  prettyprint(depth = 0) {
    const prints = [`parent=${this.parent ? this.parent._nid : 0}`, `nid=${this._nid}`, this.values];
    if (depth) {
      prints.unshift('\t'.repeat(depth));
    }
    console.log(...prints);

    for (let i in this.children) {
      if (this.children[i])
        this.children[i].prettyprint(depth + 1);
    }
  }
}

const _private = new WeakMap();
class Btree {
  constructor(options = {}) {
    options.order = Math.max(MIN_ORDER, options.order || DEFAULT_ORDER);
    _private.set(this, {
      root: new BtreeNode({ ...options }),
      count: 0
    });
  }
  get count() {
    return _private.get(this).count;
  }
  add(val) { // => inserted: boolean
    const { root } = _private.get(this);
    let node = root;
    while (!node.leaf) {
      const [index, match] = node.placeOf(val);
      if (match) return false;
      node = node.children[index];
    }
    const [index, match] = node.placeOf(val);
    if (!match) {
      node.values.splice(index, 0, val);
      node.children.splice(index, 0, null);
      if (node.overflow) node.resolveOverflow();
      _private.get(this).count++;
      return true;
    }
    return false;
  }
  remove(val) { // => removed: boolean
    const { root } = _private.get(this);
    let node = root;
    while (!node.leaf) {
      const [index, match] = node.placeOf(val);
      if (match) {
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
        _private.get(this).count--;
        return true;
      }
      node = node.children[index];
    }
    const [index, match] = node.placeOf(val);
    if (match) {
      node.values.splice(index, 1);
      node.children.splice(index, 1);
      if (node.underflow) {
        node.resolveUnderflow();
      }
      _private.get(this).count--;
      return true;
    }
    return false;
  }
  iterate(handler) {
    let index = 0;
    const { root } = _private.get(this);
    const stack = [root];
    while (stack.length > 0) {
      const val = stack.pop();
      if (val instanceof BtreeNode) {
        for (let i = val.children.length - 1; i >= 0; i--) {
          if (i < val.values.length) stack.push(val.values[i]);
          if (val.children[i]) stack.push(val.children[i]);
        }
      } else {
        handler(val, index++);
      }
    }
  }
  prettyprint() {
    const { root } = _private.get(this);
    root.prettyprint();
  }
}