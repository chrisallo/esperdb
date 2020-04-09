import EsperBtree from "./btree";

const REVERSE_MARKER = /^--/;
const DEFAULT_BTREE_ORDER = 50;
const DEFAULT_MIN_ITEMS = 3;

const _private = new WeakMap();

class EsperIndexer {
  constructor({
    collectionName = '',
    primaryKey = null,
    columns = []
  }) {
    _private.set(this, {
      collectionName,
      primaryKey,
      columns,
      btree: new EsperBtree({
        order: DEFAULT_BTREE_ORDER,
        min: DEFAULT_MIN_ITEMS,
        primaryKey,
        unique: primaryKey
          && columns.length === 1
          && columns[0] === primaryKey,
        compare: (a, b) => {
          for (let i in this.columns) {
            const col = this.columns[i].replace(REVERSE_MARKER, '');
            const rev = REVERSE_MARKER.test(this.columns[i]) ? -1 : 1;
            const ta = typeof a[col], tb = typeof b[col], va = a[col], vb = b[col];
            if (ta === tb) {
              if (va !== vb) {
                switch (ta) {
                  case 'boolean': return va ? rev : -rev;
                  case 'number': return va > vb ? rev : -rev;
                  case 'string': return va.localeCompare(vb) > 0 ? rev : -rev;
                  default: return rev; // object, function, etc
                }
              }
            } else {
              if (ta === 'undefined' || va === null) return -rev;
              else if (tb === 'undefined' || vb === null) return rev;
            }
          }
          return 0;
        }
      })
    });
  }
  get collectionName() {
    const { collectionName } = _private.get(this);
    return collectionName;
  }
  get key() {
    return this.columns.join('>');
  }
  get columns() {
    const { columns } = _private.get(this);
    return columns;
  }
  iterate(query, options, handler) {
    const { btree } = _private.get(this);
    let { skip = 0, limit = 0 } = options || {};
    skip = Math.max(0, skip);
    limit = Math.max(0, limit);

    let count = 0;
    btree.iterateFrom(query, item => {
      if (skip === 0) {
        if (handler) {
          if (handler(item) === false) {
            return false;
          }
        }
        count++;
        if (limit === count) return false;
      } else {
        skip--;
      }
    });
  }
  put(data) {
    const { btree } = _private.get(this);
    return btree.put(data);
  }
  replace(oldData, newData) {
    const { btree } = _private.get(this);
    if (btree.remove(oldData)) {
      btree.put(newData);
    }
  }
  remove(data) {
    const { btree } = _private.get(this);
    return btree.remove(data);
  }
  clear() {
    const { btree } = _private.get(this);
    return btree.clear();
  }
  calculateScore(query, options = {}) {
    let score = 0;
    if (typeof options === 'object' && options !== null) {
      const relatedColumns = query.getRelatedColumns();
      const indexedColumns = this.columns.map(col => col.replace(/^--/, ''));

      let weight = 1.0;
      for (let j in indexedColumns) {
        const indexedColumn = indexedColumns[j];
        if (relatedColumns.indexOf(indexedColumn) >= 0) {
          score += weight;
        } else {
          weight *= 0.2;
        }
      }
      if (indexedColumns.length > 0 && indexedColumns[indexedColumns.length - 1] === options.orderBy) {
        weight += 2 * Math.sqrt(indexedColumns.length) / indexedColumns.length;
      }
    }
    return score;
  }
  // async replace(newIndexes) {
  //   const addedIndexKeys = [];
  //   const removedIndexKeys = [];

  //   const compareKey = (a, b) => a.localeCompare(b);
  //   const currentIndexKeys = this.indexes.map(idx => this.indexToKey(idx)).sort(compareKey);
  //   const newIndexKeys = newIndexes.map(idx => this.indexToKey(idx)).sort(compareKey);

  //   let currentIndexCursor = 0;
  //   let newIndexCursor = 0;
  //   while (currentIndexCursor < currentIndexKeys.length || newIndexCursor < newIndexKeys.length) {
  //     const currentIndexKey = currentIndexKeys[currentIndexCursor] || null;
  //     const newIndexKey = newIndexKeys[newIndexCursor] || null;
  //     if (currentIndexKey && newIndexKey) {
  //       const compared = compareKey(currentIndexKey, newIndexKey);
  //       if (compared === 0) { // equal > skip
  //         currentIndexCursor++;
  //         newIndexCursor++;
  //       } else if (compared > 0) { // current is greater than new > add new
  //         addedIndexKeys.push(newIndexKey);
  //         newIndexCursor++;
  //       } else { // new is greater than current > remove current
  //         removedIndexKeys.push(currentIndexKey);
  //         currentIndexCursor++;
  //       }
  //     } else if (currentIndexKey) { // current is spare > remove current
  //       removedIndexKeys.push(currentIndexKey);
  //       currentIndexCursor++;
  //     } else if (newIndexKey) { // new is spare > add new
  //       addedIndexKeys.push(newIndexKey);
  //       newIndexCursor++;
  //     }
  //   }
  //   this.indexes = newIndexes;
  // }
}

export default EsperIndexer;